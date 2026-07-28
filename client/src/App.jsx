import { Route, Routes } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customers from './pages/Customers.jsx';
import Policies from './pages/Policies.jsx';
import Premiums from './pages/Premiums.jsx';
import Claims from './pages/Claims.jsx';
import Documents from './pages/Documents.jsx';
import Reports from './pages/Reports.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/premiums" element={<Premiums />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/reports" element={<Reports />} />
        </Routes>
    );
}

export default App;
