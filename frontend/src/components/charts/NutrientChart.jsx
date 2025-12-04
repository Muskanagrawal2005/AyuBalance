import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const NutrientChart = ({ analysis }) => {
  if (!analysis) return null;

  const { totals, doshaAnalysis } = analysis;

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
        backgroundColor: ['#A5B4FC', '#FCA5A5', '#86EFAC'], // Purple, Red, Greenish
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
           Foods consuming balancing vs aggravating
        </div>
      </div>
    </div>
  );
};

export default NutrientChart;