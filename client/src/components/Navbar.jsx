import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Navbar({ title }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 max-w-5xl mx-auto mb-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
      {title && <h1 className="text-white text-xl font-semibold">{title}</h1>}
    </div>
  );
}

export default Navbar;