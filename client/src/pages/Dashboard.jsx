import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, DollarSign, ClipboardList, FolderOpen, BarChart3, LogOut } from 'lucide-react';
import api from '../api.js';



function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.role === 'customer') {
        navigate('/my-dashboard');
        return;
      }
      setProfile(res.data);
    } catch (error) {
      console.log(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading || !profile) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }

  const allModules = [
    { name: 'Customer Management', path: '/customers', icon: Users, roles: ['admin', 'agent'] },
    { name: 'Policy Management', path: '/policies', icon: FileText, roles: ['admin', 'agent'] },
    { name: 'Premium Tracking', path: '/premiums', icon: DollarSign, roles: ['admin', 'agent'] },
    { name: 'Claim Management', path: '/claims', icon: ClipboardList, roles: ['admin', 'agent'] },
    { name: 'Document Management', path: '/documents', icon: FolderOpen, roles: ['admin', 'agent'] },
    { name: 'Reports Dashboard', path: '/reports', icon: BarChart3, roles: ['admin'] },
  ];

  const visibleModules = allModules.filter((m) => m.roles.includes(profile.role));

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
     
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-10">
        <div>
          <h1 className="text-white text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            {profile.name} · <span className="capitalize">{profile.role}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {visibleModules.map((mod) => {
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