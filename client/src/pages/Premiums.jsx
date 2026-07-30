import { useState, useEffect } from 'react';
import api from '../api.js';

function Premiums() {
  const [premiums, setPremiums] = useState([]);
  const [policyId, setPolicyId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');

  const fetchPremiums = async () => {
    try {
      const res = await api.get('/premiums');
      setPremiums(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPremiums();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/premiums', { policyId, paymentDate, amount, paymentStatus });
      setPolicyId('');
      setPaymentDate('');
      setAmount('');
      setPaymentStatus('paid');
      fetchPremiums();
      alert('Premium payment recorded successfully!');
    } catch (error) {
      console.log(error);
      alert('Failed to record payment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/premiums/${id}`);
      fetchPremiums();
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date();

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Premium Tracking</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="number"
          placeholder="Policy ID"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button
          type="submit"
          className="bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200 md:col-span-2"
        >
          Record Payment
        </button>
      </form>

      <div className="max-w-5xl mx-auto overflow-x-auto">
        <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Policy No.</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {premiums.map((p) => {
              const isOverdue = new Date(p.paymentDate) < today && p.paymentStatus !== 'paid';
              return (
                <tr key={p.id} className="border-t border-slate-600">
                  <td className="p-3">{p.policy.customer.name}</td>
                  <td className="p-3">{p.policy.policyNumber}</td>
                  <td className="p-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3 capitalize">
                    <span className={isOverdue ? 'text-red-400 font-semibold' : ''}>
                      {isOverdue ? 'Overdue' : p.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Premiums;