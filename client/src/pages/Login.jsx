import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const greetings = {
  customer: {
    title: 'Hi there! Ready to take control of your insurance?',
    subtitle: 'Log in to view your policies, submit claims, update your information, and stay protected with ease.',
  },
  agent: {
    title: 'Hello, Agent!',
    subtitle: 'Your clients are counting on you. Sign in to manage policies, handle requests, and provide trusted guidance.',
  },
  admin: {
    title: 'Administrator Portal',
    subtitle: 'Securely sign in to manage users, monitor system activities, configure policies, and oversee platform operations.',
  },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { role } = useParams();

  const content = greetings[role] || greetings.customer;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log(res.data);
      alert('Login successful!');
    } catch (error) {
      console.log(error);
      alert('Login failed');
    }
  };

  return (
    <div className="w-full bg-slate-900 flex flex-col items-center justify-center text-center px-10 py-10">
      <h1 className="text-white text-4xl font-bold mb-6">{content.title}</h1>
      <p className="text-gray-300 text-lg mb-2">{content.subtitle}</p>

      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
        >
          <h2 className="text-white text-2xl font-bold mb-6 text-center">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 mb-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 mb-5 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200"
          >
            Login
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;