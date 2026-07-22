import { User, Briefcase, Shield, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-slate-800 p-10">
        <h2 className="text-white text-2xl font-bold mb-6">Select Role</h2>

        <div
          onClick={() => navigate('/login/customer')}
          className="bg-slate-700 rounded-lg p-6 mb-4 text-center cursor-pointer hover:bg-slate-600"
        >
          <User className="mx-auto text-blue-400 mb-2" size={32} />
          <p className="text-white font-semibold">Customer</p>
        </div>

        <div
          onClick={() => navigate('/login/agent')}
          className="bg-slate-700 rounded-lg p-6 mb-4 text-center cursor-pointer hover:bg-slate-600"
        >
          <Briefcase className="mx-auto text-green-400 mb-2" size={32} />
          <p className="text-white font-semibold">Insurance Agent</p>
        </div>

        <div
          onClick={() => navigate('/login/admin')}
          className="bg-slate-700 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-600"
        >
          <Shield className="mx-auto text-pink-400 mb-2" size={32} />
          <p className="text-white font-semibold">Administrator</p>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-slate-900 flex flex-col items-center justify-center text-center px-10 py-10">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">Insurance Policy</h1>
        <p className="text-gray-300 text-lg mb-2">Protecting what matters most to you and your family.</p>
        <p className="text-gray-300 text-lg mb-2">Comprehensive coverage. Trusted service. Peace of mind.</p>
        <p className="text-gray-300 text-lg mb-8">Your safety is our priority — always.</p>

        <button
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 bg-white text-slate-800 font-semibold text-lg px-8 py-4 rounded-lg hover:bg-gray-200"
        >
          <UserPlus size={22} />
          Register
        </button>
      </div>
    </div>
  );
}

export default RoleSelect;