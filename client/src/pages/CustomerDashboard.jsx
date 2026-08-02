import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import api from '../api.js';
import Navbar from '../components/Navbar.jsx';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const fetchData = async () => {
    try {
      const custRes = await api.get('/auth/my-customer-profile');
      setCustomer(custRes.data);

      const policyRes = await api.get('/policies?limit=100');
      const myPolicies = policyRes.data.data.filter((p) => p.customerId === custRes.data.id);
      setPolicies(myPolicies);

      const claimRes = await api.get('/claims?limit=100');
      const myClaims = claimRes.data.data.filter((c) =>
        myPolicies.some((p) => p.id === c.policyId)
      );
      setClaims(myClaims);
    } catch (error) {
      console.log(error);
      setNotFound(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-4">No customer profile found linked to your account.</p>
        <p className="text-gray-400 mb-6">Please contact your insurance agent to register your customer profile.</p>
        <button onClick={handleLogout} className="bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold">
          Logout
        </button>
      </div>
    );
  }

  if (!customer) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-10">
        <h1 className="text-white text-3xl font-bold">Welcome, {customer.name}</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-white text-xl font-semibold mb-4">My Policies</h2>
        {policies.length === 0 ? (
          <p className="text-gray-400">No policies found.</p>
        ) : (
          <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Policy No.</th>
                <th className="p-3">Premium</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="border-t border-slate-600">
                  <td className="p-3">{p.policyType}</td>
                  <td className="p-3">{p.policyNumber}</td>
                  <td className="p-3">{p.premiumAmount}</td>
                  <td className="p-3 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-white text-xl font-semibold mb-4">My Claims</h2>
        {claims.length === 0 ? (
          <p className="text-gray-400">No claims submitted yet.</p>
        ) : (
          <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3">Reason</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-t border-slate-600">
                  <td className="p-3">{c.reason}</td>
                  <td className="p-3">{c.claimAmount}</td>
                  <td className="p-3 capitalize">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;