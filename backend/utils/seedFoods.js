const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('../models/FoodItem');

// Load env vars (to get MONGO_URI)
dotenv.config({ path: '../.env' }); // Adjust path if you run from inside 'utils'

const foods = [
  // 1. GRAINS
  {
    name: "Basmati Rice (Cooked)",
    servingSize: "1 cup",
    calories: 205,
    protein_g: 4.3,
    carbs_g: 44,
    fat_g: 0.4,
    fiber_g: 0.6,
    rasa: "Sweet",
    virya: "Cooling",
    doshaEffect: { vata: "pacifies", pitta: "pacifies", kapha: "aggravates" }
  },
  {
    name: "Quinoa (Cooked)",
    servingSize: "1 cup",
    calories: 222,
    protein_g: 8,
    carbs_g: 39,
    fat_g: 3.6,
    fiber_g: 5,
    rasa: "Sweet",
    virya: "Heating",
    doshaEffect: { vata: "pacifies", pitta: "aggravates", kapha: "pacifies" }
  },
  
  // 2. LEGUMES
  {
    name: "Mung Dal (Cooked)",
    servingSize: "1 cup",
    calories: 147,
    protein_g: 14,
    carbs_g: 26,
    fat_g: 0.8,
    fiber_g: 15,
    rasa: "Sweet",
    virya: "Cooling",
    doshaEffect: { vata: "pacifies", pitta: "pacifies", kapha: "pacifies" } // Tridoshic
  },
  {
    name: "Red Lentils (Masoor Dal)",
    servingSize: "1 cup",
    calories: 230,
    protein_g: 18,
    carbs_g: 40,
    fat_g: 0.8,
    fiber_g: 16,
    rasa: "Sweet",
    virya: "Cooling",
    doshaEffect: { vata: "aggravates", pitta: "pacifies", kapha: "pacifies" }
  },

  // 3. VEGETABLES
  {
    name: "Cooked Spinach",
    servingSize: "1 cup",
    calories: 41,
    protein_g: 5,
    carbs_g: 7,
    fat_g: 0.5,
    fiber_g: 4,
    rasa: "Bitter",
    virya: "Cooling",
    doshaEffect: { vata: "aggravates", pitta: "pacifies", kapha: "pacifies" }
  },
  {
    name: "Sweet Potato (Baked)",
    servingSize: "1 medium",
    calories: 103,
    protein_g: 2,
    carbs_g: 24,
    fat_g: 0.2,
    fiber_g: 4,
    rasa: "Sweet",
    virya: "Heating",
    doshaEffect: { vata: "pacifies", pitta: "pacifies", kapha: "aggravates" }
  },

  // 4. FRUITS
  {
    name: "Apple (Raw)",
    servingSize: "1 medium",
    calories: 95,
    protein_g: 0.5,
    carbs_g: 25,
    fat_g: 0.3,
    fiber_g: 4.4,
    rasa: "Astringent",
    virya: "Cooling",
    doshaEffect: { vata: "aggravates", pitta: "pacifies", kapha: "pacifies" }
  },
  {
    name: "Banana (Ripe)",
    servingSize: "1 medium",
    calories: 105,
    protein_g: 1.3,
    carbs_g: 27,
    fat_g: 0.4,
    fiber_g: 3.1,
    rasa: "Sweet",
    virya: "Heating",
    doshaEffect: { vata: "pacifies", pitta: "aggravates", kapha: "aggravates" }
  },

  // 5. DAIRY & OILS
  {
    name: "Ghee",
    servingSize: "1 tbsp",
    calories: 120,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 14,
    fiber_g: 0,
    rasa: "Sweet",
    virya: "Cooling",
    doshaEffect: { vata: "pacifies", pitta: "pacifies", kapha: "aggravates" }
  },
  {
    name: "Warm Milk (Cow)",
    servingSize: "1 cup",
    calories: 150,
    protein_g: 8,
    carbs_g: 12,
    fat_g: 8,
    fiber_g: 0,
    rasa: "Sweet",
    virya: "Cooling",
    doshaEffect: { vata: "pacifies", pitta: "pacifies", kapha: "aggravates" }
  }
];

const seedDB = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing foods (Optional: Comment this out if you want to KEEP existing foods)
    // await FoodItem.deleteMany({});
    // console.log('Old foods removed...');

    // Insert new foods
    await FoodItem.insertMany(foods);
    console.log('✅ Foods Imported Successfully!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();