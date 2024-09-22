import { useState, useEffect } from "react";
import axios from "axios";
import Calculadora from "./Calculadora";
import CommentForm from "./CommentForm";
import InfoPais from "./InfoPais";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempVisibleComments, setTempVisibleComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleCommentVisibility = (commentId) => {
    setTempVisibleComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const saveVisibleComments = async () => {
    try {
      const updates = comments.map((comment) => ({
        ...comment,
        isVisible: tempVisibleComments.includes(comment._id),
      }));

      await axios.put(
        "https://server-chi-lyart.vercel.app/api/updateCommentsVisibility",
        updates
      );
      setVisibleComments(tempVisibleComments);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating comment visibility:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        "https://server-chi-lyart.vercel.app/api/deleteComments",
        {
          data: { ids: [commentId] },
        }
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://server-chi-lyart.vercel.app/api/getCountries"
        );
        const countriesData = response.data.filter(
          (country) =>
            typeof country.usd_price === "number" &&
            !isNaN(country.usd_price) &&
            country.enabled === true
        );
        setData(countriesData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "https://server-chi-lyart.vercel.app/api/getComments"
        );
        setComments(response.data);
        const visibleComments = response.data
          .filter((comment) => comment.isVisible)
          .map((comment) => comment._id);
        setVisibleComments(visibleComments);
        setTempVisibleComments(visibleComments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
    fetchComments();
  }, []);

  if (!data.length & !comments.length) return <></>;

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-evenly w-full min-h-screen p-4">
        <div className="w-full md:w-auto mb-8 md:mb-0">
          <div>
            <div className="mb-5">
              <h1 className="font-bold text-3xl md:text-5xl max-w-[700px] text-balance text-blue-500">
                Conversor de divisas
              </h1>
              <p className="text-gray-500 text-sm md:text-md">
                Ten en cuenta que los precios pueden variar.
              </p>
            </div>
            <Calculadora data={data} />

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
                  <h3 className="font-bold mb-2 text-lg md:text-xl text-gray-800">
                    Seleccionar comentarios visibles:
                  </h3>
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={comment._id}
                        checked={tempVisibleComments.includes(comment._id)}
                        onChange={() => toggleCommentVisibility(comment._id)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={comment._id}
                        className="text-sm md:text-base text-gray-700"
                      >
                        <span className="text-gray-700 italic mb-2 text-sm md:text-base">
                          &quot;{comment.comment}&quot;
                        </span>{" "}
                        -{" "}
                        <span className="font-medium text-gray-700 text-sm md:text-base">
                          {comment.name}
                        </span>
                      </label>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="ml-2 bg-red-500 rounded-md px-3 py-2 text-white font-medium hover:bg-red-400 duration-200 text-sm md:text-base"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={saveVisibleComments}
                    className="mt-4 mr-4 bg-green-500 rounded-md px-3 py-2 text-white font-medium hover:bg-green-400 duration-200 text-sm md:text-base"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-2 bg-red-500 rounded-md px-3 py-2 text-white font-medium hover:bg-red-400 duration-200 text-sm md:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="my-8 bg-white shadow-md rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Comentarios de usuarios
              </h3>
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {comments
                  .filter((comment) => visibleComments.includes(comment._id))
                  .map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 rounded-md p-3 md:p-4"
                    >
                      <p className="text-gray-700 italic mb-2 text-sm md:text-base">
                        &quot;{comment.comment}&quot;
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        -{" "}
                        <span className="font-medium text-gray-700">
                          {comment.name}
                        </span>
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex flex-col md:flex-row justify-center gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className=" bg-blue-500 rounded-md px-3 py-2 text-white font-medium hover:bg-blue-400 duration-200 text-sm md:text-base"
                >
                  Administrar comentarios
                </button>
                <button
                  onClick={() => navigate("/admin")}
                  className=" bg-green-500 rounded-md px-3 py-2 text-white font-medium hover:bg-green-400 duration-200 text-sm md:text-base"
                >
                  Ir al panel de administración
                </button>
              </div>
            )}

            <CommentForm
              comments={comments}
              setComments={setComments}
              isLoggedIn={isAuthenticated}
            />
          </div>
        </div>
        <div className="shadow-lg p-4 md:p-6 rounded-lg bg-white w-full md:w-[80%] max-w-3xl">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-blue-500 text-center">
            Lista de Precios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {data.map((country) => (
              <div
                key={country._id}
                className="border-b border-gray-200 pb-3 md:pb-4 flex justify-center"
              >
                <InfoPais data={country} />
              </div>
            ))}
          </div>

          <span className="text-xs md:text-sm text-gray-400 block mt-4">
            El valor de cada moneda equivale a 1 USD
          </span>
        </div>
      </div>
    </>
  );
}

export default Home;
