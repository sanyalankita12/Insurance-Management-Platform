import { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/customers', {
        name,
        dob,
        phone,
        address,
        email,
      });
      setName('');
      setDob('');
      setPhone('');
      setAddress('');
      setEmail('');
      fetchCustomers();
    } catch (error) {
      console.log(error);
      alert('Failed to add customer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Customer Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-700 text-white placeholder-gray-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400 md:col-span-2"
        />
        <button
          type="submit"
          className="bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200 md:col-span-2"
        >
          Add Customer
        </button>
      </form>

      <div className="max-w-4xl mx-auto overflow-x-auto">
        <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">DOB</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Email</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-slate-600">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{new Date(c.dob).toLocaleDateString()}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.address}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(c.id)}
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
    </div>
  );
}

export default Customers;