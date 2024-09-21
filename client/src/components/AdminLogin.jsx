import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/admin/login", {
        name,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/admin");
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
        setError("Credenciales inválidas.");
      } else {
        console.error("Error: ", error);
        setError("Error de conexión.");
      }
    }
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#f0f8ff] p-4">
      <form
        className="flex flex-col justify-center bg-white shadow-xl rounded-lg w-full max-w-[300px] p-6 gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="font-bold text-xl md:text-2xl text-blue-500 text-center mb-4">
          Login
        </h1>

        <input
          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 text-sm md:text-base"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
        />

        <input
          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 text-sm md:text-base"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />

        {error && (
          <p className="text-red-400 font-bold text-center text-sm md:text-base">
            {error}
          </p>
        )}

        <button
          className="w-full font-medium bg-blue-200 text-blue-800 px-4 py-2 rounded-lg shadow hover:bg-blue-300 transition-colors text-sm md:text-base"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
