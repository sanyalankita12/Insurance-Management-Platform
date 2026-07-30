import { useState, useEffect } from 'react';
import api from '../api.js';

function Claims() {
  const [claims, setClaims] = useState([]);
  const [policyId, setPolicyId] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [reason, setReason] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClaims = async () => {
    try {
      const res = await api.get(`/claims?search=${search}&page=${page}&limit=5`);
      setClaims(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [search, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/claims', { policyId, claimAmount, reason });
      setPolicyId('');
      setClaimAmount('');
      setReason('');
      fetchClaims();
      alert('Claim submitted successfully!');
    } catch (error) {
      console.log(error);
      alert('Failed to submit claim');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/claims/${id}/status`, { status });
      fetchClaims();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/claims/${id}`);
      fetchClaims();
    } catch (error) {
      console.log(error);
    }
  };

  const statusColor = {
    pending: 'text-yellow-400',
    approved: 'text-green-400',
    rejected: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Claim Management</h1>

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
          type="number"
          placeholder="Claim Amount"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <textarea
          placeholder="Reason for claim"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400 md:col-span-2"
          rows={3}
        />
        <button
          type="submit"
          className="bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200 md:col-span-2"
        >
          Submit Claim
        </button>
      </form>

      <div className="max-w-5xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search by status (pending/approved/rejected)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
      </div>

      <div className="max-w-5xl mx-auto overflow-x-auto">
        <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Policy No.</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Submitted</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="border-t border-slate-600">
                <td className="p-3">{c.policy.customer.name}</td>
                <td className="p-3">{c.policy.policyNumber}</td>
                <td className="p-3">{c.claimAmount}</td>
                <td className="p-3">{c.reason}</td>
                <td className="p-3">{new Date(c.submissionDate).toLocaleDateString()}</td>
                <td className={`p-3 capitalize font-semibold ${statusColor[c.status]}`}>
                  {c.status}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleStatusChange(c.id, 'approved')}
                    className="text-green-400 hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(c.id, 'rejected')}
                    className="text-red-400 hover:underline"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-gray-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-5xl mx-auto flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-white flex items-center">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Claims;