import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [changes, setChanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [newCountry, setNewCountry] = useState({
    name: "",
    flag: "",
    currency: "",
    usd_price: 0,
  });
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://server-chi-lyart.vercel.app/api/getCountries")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleInputChange = (id, field, value) => {
    const updatedCountries = countries.map((country) =>
      country._id === id ? { ...country, [field]: value } : country
    );
    setCountries(updatedCountries);

    const existingChange = changes.find((change) => change._id === id);
    if (existingChange) {
      setChanges(
        changes.map((change) =>
          change._id === id ? { ...change, [field]: value } : change
        )
      );
    } else {
      setChanges([...changes, { _id: id, [field]: value }]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        "https://server-chi-lyart.vercel.app/api/updateCountries",
        changes
      );
      setSuccessMessage("Cambios guardados con éxito."); // Set success message
      setTimeout(() => {
        setSuccessMessage(""); // Clear message after 3 seconds
      }, 3000);
      setChanges([]); // Clear changes after saving
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDisableClick = (country) => {
    setCountryToDelete(country);
    setShowDisableModal(true);
  };

  const handleToggleCountry = async () => {
    if (!countryToDelete._id) {
      console.error("El ID del país es indefinido");
      return;
    }

    try {
      const action = countryToDelete.enabled ? "disable" : "enable";
      await axios.put(
        `https://server-chi-lyart.vercel.app/api/${action}Country/${countryToDelete._id}`
      );

      setCountries((prevCountries) =>
        prevCountries.map((c) =>
          c._id === countryToDelete._id ? { ...c, enabled: !c.enabled } : c
        )
      );

      setShowDisableModal(false);
    } catch (error) {
      console.error(`Error country:`, error);
    }
  };

  const handleAddCountry = async () => {
    try {
      const response = await axios.post(
        "https://server-chi-lyart.vercel.app/api/addCountry",
        newCountry
      );
      setCountries([...countries, response.data.country]);
      setShowModal(false);
      setNewCountry({ name: "", flag: "", currency: "", usd_price: 0 });
    } catch (error) {
      console.error("Error adding country:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={handleLogout}
              className="bg-red-500 rounded-md px-3 py-2 text-white font-medium hover:bg-red-400 duration-200 text-sm md:text-base"
            >
              Cerrar sesión
            </button>
            <button
              className="bg-blue-500 rounded-md px-3 py-2 text-white font-medium hover:bg-blue-400 duration-200 text-sm md:text-base"
              onClick={() => navigate("/")}
            >
              Ir al inicio
            </button>
          </div>
        </div>

        {successMessage && (
          <p className="text-green-600 font-bold text-center mb-4">
            {successMessage}
          </p>
        )}

        <div className="overflow-x-auto w-full max-h-[700px]">
          <table className="w-full bg-white shadow-md rounded-lg text-sm md:text-base">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-blue-700">
                  Nombre
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-blue-700">
                  Moneda
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-blue-700">
                  Precio USD
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-blue-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr
                  key={country._id}
                  className={`even:bg-blue-50 hover:bg-blue-100 transition-colors ${
                    !country.enabled ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <input
                      type="text"
                      value={country.name}
                      onChange={(e) =>
                        handleInputChange(country._id, "name", e.target.value)
                      }
                      disabled={!country.enabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <input
                      type="text"
                      value={country.currency}
                      onChange={(e) =>
                        handleInputChange(
                          country._id,
                          "currency",
                          e.target.value
                        )
                      }
                      disabled={!country.enabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <input
                      type="number"
                      value={country.usd_price}
                      onChange={(e) =>
                        handleInputChange(
                          country._id,
                          "usd_price",
                          e.target.value
                        )
                      }
                      disabled={!country.enabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                    <button
                      onClick={() => handleDisableClick(country)}
                      className="px-2 md:px-4 py-1 md:py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300 transition-colors text-xs md:text-sm"
                    >
                      {country.enabled ? "Desabilitar" : "Habilitar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row w-full h-auto gap-2 items-center justify-center mt-4">
          <button
            onClick={handleSaveChanges}
            disabled={changes.length === 0}
            className={`px-4 md:px-6 py-2 rounded-lg shadow transition-colors text-sm md:text-base ${
              changes.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-200 text-blue-800 hover:bg-blue-300"
            }`}
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 md:px-6 py-2 bg-green-200 text-green-800 rounded-lg shadow hover:bg-green-300 transition-colors text-sm md:text-base"
          >
            Agregar País
          </button>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white p-8 rounded-lg w-96 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Agregar Nuevo País
              </h2>

              <input
                type="text"
                placeholder="Nombre"
                value={newCountry.name}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, name: e.target.value })
                }
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              />

              <input
                type="text"
                placeholder="Bandera (URL)"
                value={newCountry.flag}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, flag: e.target.value })
                }
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              />

              <input
                type="text"
                placeholder="Moneda"
                value={newCountry.currency}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, currency: e.target.value })
                }
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              />

              <input
                type="number"
                placeholder="Precio USD"
                value={newCountry.usd_price}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, usd_price: e.target.value })
                }
                className="block w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              />

              <button
                onClick={handleAddCountry}
                className="w-full bg-blue-200 text-blue-800 px-4 py-2 rounded-lg shadow hover:bg-blue-300 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {showDisableModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
            onClick={() => setShowDisableModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>¿Estás seguro de eliminar este país?</h2>
              <p>{countryToDelete?.name}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleToggleCountry}
                  className="bg-red-300 text-black px-4 py-2 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
