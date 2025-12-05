import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const NutrientChart = ({ analysis }) => {
  if (!analysis) return null;

  // Destructure 'targets' from analysis (This was missing in your snippet!)
  const { totals, doshaAnalysis, targets } = analysis;

  // --- HELPER: Calculate Status (Green/Yellow/Red) ---
  const getProgress = (actual, goal) => {
    // Avoid division by zero
    const safeGoal = goal || 2000; 
    const percentage = Math.round((actual / safeGoal) * 100);
    
    let color = 'bg-emerald-500'; // Green (Good)
    let status = 'Good';

    if (percentage < 70) {
       color = 'bg-yellow-400';
       status = 'Deprived (Low)';
    } else if (percentage > 120) {
       color = 'bg-red-500';
       status = 'Over Limit';
    }
    
    return { percentage, color, status };
  };

  // Calculate stats for each nutrient
  const calStats = getProgress(totals.calories, targets?.calories);
  const proStats = getProgress(totals.protein, targets?.protein);
  const carbStats = getProgress(totals.carbs, targets?.carbs);
  const fatStats = getProgress(totals.fat, targets?.fat);

  // 1. Data for Macro Pie Chart
  const macroData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'],
    datasets: [
      {
        data: [totals.protein, totals.carbs, totals.fat],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  // 2. Data for Dosha Bar Chart
  const doshaData = {
    labels: ['Vata', 'Pitta', 'Kapha'],
    datasets: [
      {
        label: 'Aggravating Factors Count',
        data: [doshaAnalysis.Vata, doshaAnalysis.Pitta, doshaAnalysis.Kapha],
        backgroundColor: ['#A5B4FC', '#FCA5A5', '#86EFAC'], 
      },
    ],
  };

  return (
    <div className="space-y-8 mt-4">
      
      {/* SECTION 1: TARGET COMPARISON (NEW) */}
      <div className="bg-white p-6 rounded shadow border">
        <h3 className="font-bold text-gray-700 mb-4 text-lg">Daily Targets vs Actual</h3>
        
        {/* Calories */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Calories ({totals.calories} / {targets?.calories || 2000})</span>
            <span className={`font-bold ${calStats.status === 'Over Limit' ? 'text-red-500' : calStats.status.includes('Low') ? 'text-yellow-600' : 'text-emerald-600'}`}>
              {calStats.status}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={`h-3 rounded-full ${calStats.color}`} style={{ width: `${Math.min(calStats.percentage, 100)}%` }}></div>
          </div>
        </div>

        {/* Protein */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Protein ({totals.protein}g / {targets?.protein || 50}g)</span>
            <span className="text-xs text-gray-500">{proStats.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${proStats.color}`} style={{ width: `${Math.min(proStats.percentage, 100)}%` }}></div>
          </div>
        </div>

        {/* Carbs */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Carbs ({totals.carbs}g / {targets?.carbs || 300}g)</span>
            <span className="text-xs text-gray-500">{carbStats.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${carbStats.color}`} style={{ width: `${Math.min(carbStats.percentage, 100)}%` }}></div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex gap-6 text-xs mt-6 justify-center bg-gray-50 p-2 rounded">
           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Deprived (Low)</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Good Range</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Over Limit</span>
        </div>
      </div>

      {/* SECTION 2: CHARTS (EXISTING) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Macro Chart */}
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-center font-bold text-gray-700 mb-4">Macronutrient Balance</h3>
          <div className="h-64 flex justify-center">
            <Pie data={macroData} />
          </div>
          <div className="text-center mt-4 text-sm text-gray-600">
             Total Calories: <span className="font-bold text-emerald-600">{totals.calories} kcal</span>
          </div>
        </div>

        {/* Dosha Chart */}
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-center font-bold text-gray-700 mb-4">Ayurvedic Impact (Aggravation)</h3>
          <div className="h-64">
             <Bar data={doshaData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="text-center mt-4 text-sm text-gray-600">
             Foods flagged as aggravating specific doshas
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutrientChart;