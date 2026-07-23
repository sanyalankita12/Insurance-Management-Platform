import { Route, Routes } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customers from './pages/Customers.jsx';
import Policies from './pages/Policies.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/policies" element={<Policies />} />
        </Routes>
    );
}

export default App;
