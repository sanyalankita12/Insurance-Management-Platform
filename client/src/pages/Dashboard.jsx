import { useNavigate } from 'react-router-dom';
import { Users, FileText, DollarSign, ClipboardList, FolderOpen, BarChart3 } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  const modules = [
    { name: 'Customer Management', path: '/customers', icon: Users },
    { name: 'Policy Management', path: '/policies', icon: FileText },
    { name: 'Premium Tracking', path: '/premiums', icon: DollarSign },
    { name: 'Claim Management', path: '/claims', icon: ClipboardList },
    { name: 'Document Management', path: '/documents', icon: FolderOpen },
    { name: 'Reports Dashboard', path: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-10 text-center">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className="bg-slate-800 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-700 transition"
            >
              <Icon className="mx-auto text-blue-400 mb-4" size={36} />
              <p className="text-white font-semibold text-lg">{mod.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;