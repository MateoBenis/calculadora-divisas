import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />

        {/* Ruta para el login de admin */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Ruta para el panel de admin */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Redirigir cualquier ruta desconocida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
