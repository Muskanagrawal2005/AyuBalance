const FoodItem = require('../models/FoodItem');

// 1. CREATE FOOD (Manual)
exports.createFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. GET FOODS (Search)
exports.getFoodItems = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    const foods = await FoodItem.find({ ...keyword }).limit(20); 
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- HELPER: Normalize AI Output to match Mongoose Schema ---
const normalizeDosha = (val) => {
  if (!val) return 'neutral';
  const v = val.toLowerCase();
  if (v.includes('pacif')) return 'pacifies';
  if (v.includes('aggrav')) return 'aggravates';
  return 'neutral';
};

// 3. ANALYZE WITH AI (AUTO-DISCOVERY & SANITIZATION)
exports.analyzeFoodWithAI = async (req, res) => {
  const { query } = req.body; 
  console.log(`🤖 Analyzing: "${query}"...`); 

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Server Error: Missing GEMINI_API_KEY" });
  }

  try {
    // A. Check DB first
    const existingFood = await FoodItem.findOne({ 
      name: { $regex: new RegExp(`^${query}$`, "i") } 
    });

    if (existingFood) {
      console.log("✅ Found in DB locally.");
      return res.status(200).json(existingFood);
    }

    // B. AUTO-DISCOVER MODEL
    console.log("🔍 Auto-detecting available models...");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResp = await fetch(listUrl);
    const listData = await listResp.json();

    if (!listData.models) throw new Error("API Key cannot access any models.");

    // Find any Gemini model
    const validModel = listData.models.find(m => 
      m.supportedGenerationMethods.includes("generateContent") && 
      (m.name.includes("gemini") || m.name.includes("flash"))
    );

    if (!validModel) throw new Error("No suitable generative model found.");

    const modelName = validModel.name.replace("models/", "");
    console.log(`✅ Using Model: ${modelName}`);

    // C. CALL THE DISCOVERED MODEL
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const promptText = `
      Analyze the food item: "${query}". 
      Estimate nutritional values for 1 standard serving.
      Estimate Ayurvedic properties.
      
      CRITICAL: Return raw JSON only. 
      For 'doshaEffect', use ONLY these exact lowercase values: "pacifies", "aggravates", "neutral".
      
      Required JSON Structure:
      {
        "name": "${query}",
        "calories": Number,
        "protein_g": Number,
        "carbs_g": Number,
        "fat_g": Number,
        "rasa": "String",
        "virya": "String",
        "doshaEffect": {
          "vata": "String",
          "pitta": "String",
          "kapha": "String"
        }
      }
    `;

    const response = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");

    // D. Parse & Sanitize Response
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Extract JSON
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        text = text.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    const rawData = JSON.parse(text);

    // SANITIZE DATA (Fixing the enum error)
    const foodData = {
      ...rawData,
      name: query.charAt(0).toUpperCase() + query.slice(1), // Capitalize name
      doshaEffect: {
        vata: normalizeDosha(rawData.doshaEffect?.vata),
        pitta: normalizeDosha(rawData.doshaEffect?.pitta),
        kapha: normalizeDosha(rawData.doshaEffect?.kapha),
      }
    };

    // E. Save to DB
    const newFood = await FoodItem.create(foodData);
    console.log("✅ Saved to DB:", newFood.name);

    res.status(201).json(newFood);

  } catch (error) {
    console.error("❌ AI Analysis Failed:", error.message);
    res.status(500).json({ message: `AI Error: ${error.message}` });
  }
};