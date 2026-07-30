import { useState, useEffect } from 'react';
import api from '../api.js';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [file, setFile] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('customerId', customerId);
      formData.append('file', file);

      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCustomerId('');
      setFile(null);
      fetchDocuments();
      alert('Document uploaded successfully!');
    } catch (error) {
      console.log(error);
      alert('Failed to upload document');
    }
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/documents/${id}/download`, '_blank');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Document Management</h1>

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
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-white text-slate-800 font-semibold p-3 rounded-lg hover:bg-gray-200 md:col-span-2"
        >
          Upload Document
        </button>
      </form>

      <div className="max-w-4xl mx-auto overflow-x-auto">
        <table className="w-full text-left text-white bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">File Name</th>
              <th className="p-3">Uploaded</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.id} className="border-t border-slate-600">
                <td className="p-3">{d.customer.name}</td>
                <td className="p-3">{d.fileName}</td>
                <td className="p-3">{new Date(d.uploadedAt).toLocaleDateString()}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleDownload(d.id)}
                    className="text-blue-400 hover:underline"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
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

export default Documents;