import { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [changes, setChanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [newCountry, setNewCountry] = useState({
    name: "",
    flag: "",
    currency: "",
    usd_price: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");

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
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://server-chi-lyart.vercel.app/api/getCountries"
        );
        const sortedCountries = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleInputChange = useCallback((id, field, value) => {
    setCountries((prevCountries) =>
      prevCountries.map((country) =>
        country._id === id ? { ...country, [field]: value } : country
      )
    );

    setChanges((prevChanges) => {
      const existingChange = prevChanges.find((change) => change._id === id);
      if (existingChange) {
        return prevChanges.map((change) =>
          change._id === id ? { ...change, [field]: value } : change
        );
      } else {
        return [...prevChanges, { _id: id, [field]: value }];
      }
    });
  }, []);

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        "https://server-chi-lyart.vercel.app/api/updateCountries",
        changes
      );
      setSuccessMessage("Cambios guardados con éxito.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setChanges([]);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDisableClick = useCallback((country) => {
    setCountryToDelete(country);
    setShowDisableModal(true);
  }, []);

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
      const updatedCountries = [...countries, response.data.country].sort(
        (a, b) => a.name.localeCompare(b.name)
      );
      setCountries(updatedCountries);
      setShowModal(false);
      setNewCountry({ name: "", flag: "", currency: "", usd_price: 0 });
    } catch (error) {
      console.error("Error adding country:", error);
    }
  };

  const handleDeleteClick = useCallback((country) => {
    setCountryToDelete(country);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteCountry = async () => {
    if (!countryToDelete._id) {
      console.error("El ID del país es indefinido");
      return;
    }

    try {
      await axios.delete(
        `https://server-chi-lyart.vercel.app/api/deleteCountry/${countryToDelete._id}`
      );
      setCountries((prevCountries) =>
        prevCountries.filter((c) => c._id !== countryToDelete._id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error(`Error deleting country:`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleFileChange = useCallback(
    (id, file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Extract base64 part
        handleInputChange(id, "flag", base64String);
      };
      reader.readAsDataURL(file);
    },
    [handleInputChange]
  );

  const handleNewCountryFileChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Extract base64 part
      setNewCountry((prev) => ({ ...prev, flag: base64String }));
    };
    reader.readAsDataURL(file);
  };

  if (isAuthenticated === null || countries.length === 0) {
    return (
      <>
        <div className="flex justify-center items-center h-screen gap-2">
          <div role="status" className="flex flex-row items-center gap-2">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span>Loading...</span>
          </div>
        </div>
      </>
    );
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
                  Bandera
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
                      value={country.name || ""}
                      onChange={(e) =>
                        handleInputChange(country._id, "name", e.target.value)
                      }
                      disabled={!country.enabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 flex flex-row items-center justify-center gap-2">
                    {country.flag && (
                      <img
                        src={`data:image/png;base64,${country.flag}`}
                        alt="flag"
                        className="w-6 h-4 object-cover"
                      />
                    )}
                    <label className="w-full px-3 py-2 border bg-blue-600 hover:bg-blue-500 duration-200 text-white font-medium border-gray-300 rounded-lg focus:ring focus:ring-blue-200 cursor-pointer">
                      Cambiar
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) =>
                          handleFileChange(country._id, e.target.files[0])
                        }
                        disabled={!country.enabled}
                        className="hidden"
                      />
                    </label>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <input
                      type="text"
                      value={country.currency || ""}
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
                      value={country.usd_price || 0}
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
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center flex flex-row">
                    <button
                      onClick={() => handleDisableClick(country)}
                      className="px-2 md:px-4 py-1 md:py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300 transition-colors text-xs md:text-sm"
                    >
                      {country.enabled ? "Desabilitar" : "Habilitar"}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(country)} // New delete button
                      className="px-2 md:px-4 py-1 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm ml-2"
                    >
                      Eliminar
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
                className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              />

              <div
                className={`flex mb-2 ${
                  newCountry.flag &&
                  "items-center justify-end gap-2 flex-row-reverse"
                }`}
              >
                <label className=" px-4 py-2 border bg-blue-600 hover:bg-blue-500 duration-200 text-white font-medium border-gray-300 rounded-lg focus:ring focus:ring-blue-200 cursor-pointer">
                  Seleccionar
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={(e) =>
                      handleNewCountryFileChange(e.target.files[0])
                    }
                    className="hidden"
                  />
                </label>
                {newCountry.flag && (
                  <img
                    src={`data:image/png;base64,${newCountry.flag}`}
                    alt="flag"
                    className="w-16 h-10 object-cover"
                  />
                )}
              </div>

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
              <h2>¿Estás seguro de deshabilitar este país?</h2>
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

        {showDeleteModal && ( // New delete modal
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>¿Estás seguro de eliminar este país?</h2>
              <p>{countryToDelete?.name}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleDeleteCountry}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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
