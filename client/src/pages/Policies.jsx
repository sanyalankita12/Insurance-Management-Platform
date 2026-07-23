import { useState, useEffect } from 'react';
import axios from 'axios';

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [premiumAmount, setPremiumAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [showTable, setShowTable] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/policies');
      setPolicies(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/policies', {
        customerId,
        policyType,
        policyNumber,
        premiumAmount,
        startDate,
        endDate,
        status,
      });
      setCustomerId('');
      setPolicyType('');
      setPolicyNumber('');
      setPremiumAmount('');
      setStartDate('');
      setEndDate('');
      setStatus('active');
      fetchPolicies();
      alert('Policy added successfully!');
    } catch (error) {
      console.log(error);
      alert('Failed to add policy');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/policies/${id}/cancel`);
      fetchPolicies();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/policies/${id}`);
      fetchPolicies();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Policy Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="number"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Policy Type"
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="number"
          placeholder="Premium Amount"
          value={premiumAmount}
          onChange={(e) => setPremiumAmount(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400 md:col-span-2"
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          type="submit"
          className="bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200 md:col-span-2"
        >
          Add Policy
        </button>
      </form>

      <div className="max-w-5xl mx-auto mb-4 text-center">
        <button
          onClick={() => setShowTable(!showTable)}
          className="bg-white text-slate-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200"
        >
          {showTable ? 'Hide Policies' : 'View Policies'}
        </button>
      </div>

      {showTable && (
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Type</th>
                <th className="p-3">Policy No.</th>
                <th className="p-3">Premium</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="border-t border-slate-600">
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedCustomer(p.customer)}
                      className="text-blue-400 hover:underline"
                    >
                      {p.customer.name}
                    </button>
                  </td>
                  <td className="p-3">{p.policyType}</td>
                  <td className="p-3">{p.policyNumber}</td>
                  <td className="p-3">{p.premiumAmount}</td>
                  <td className="p-3">{new Date(p.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(p.endDate).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{p.status}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleCancel(p.id)}
                      className="text-yellow-400 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Customer Details</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-gray-300 mb-2"><span className="font-semibold text-white">Name:</span> {selectedCustomer.name}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold text-white">DOB:</span> {new Date(selectedCustomer.dob).toLocaleDateString()}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold text-white">Phone:</span> {selectedCustomer.phone}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold text-white">Address:</span> {selectedCustomer.address}</p>
            <p className="text-gray-300"><span className="font-semibold text-white">Email:</span> {selectedCustomer.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Policies;