import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Reports() {
  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/summary');
      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (!summary) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }

  const policyBarData = {
    labels: ['Active Policies', 'Expired Policies'],
    datasets: [
      {
        label: 'Policies',
        data: [summary.activePolicies, summary.expiredPolicies],
        backgroundColor: ['#4ade80', '#f87171'],
      },
    ],
  };

  const claimDoughnutData = {
    labels: summary.claimStats.map((c) => c.status),
    datasets: [
      {
        data: summary.claimStats.map((c) => c._count.status),
        backgroundColor: ['#facc15', '#4ade80', '#f87171', '#60a5fa'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Reports Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-2">Total Customers</p>
          <p className="text-white text-3xl font-bold">{summary.totalCustomers}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-2">Active Policies</p>
          <p className="text-white text-3xl font-bold">{summary.activePolicies}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-2">Premium Collected</p>
          <p className="text-white text-3xl font-bold">₹{summary.totalPremiumCollected}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-white text-lg font-semibold mb-4 text-center">Policy Status</h2>
          <Bar data={policyBarData} />
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-white text-lg font-semibold mb-4 text-center">Claim Statistics</h2>
          <Doughnut data={claimDoughnutData} />
        </div>
      </div>
    </div>
  );
}

export default Reports;