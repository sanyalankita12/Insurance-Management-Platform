import { useState } from 'react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password, role });
      alert('Registered successfully!');
      navigate('/login');
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.error || 'Registration failed';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Create Account</h2>

        <input
          type="text" required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 mb-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="email" required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 mb-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="password" required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 mb-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 mb-5 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        >
          <option value="customer">Customer</option>
          <option value="agent">Insurance Agent</option>
          <option value="admin">Administrator</option>
        </select>

        <button
          type="submit"
          className="w-full bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;