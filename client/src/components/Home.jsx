import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Calculadora from "./Calculadora";
import CommentForm from "./CommentForm";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempVisibleComments, setTempVisibleComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleCommentVisibility = useCallback((commentId) => {
    setTempVisibleComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  }, []);

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

  const handleDeleteComment = useCallback(async (commentId) => {
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

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

  if (!data.length & !comments.length)
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

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-evenly w-full min-h-screen p-4">
        {/* contact info */}
        <div className="w-full md:w-auto mb-8 md:mb-0">
          <div className="flex flex-row justify-center md:justify-start items-center gap-5 mb-5 md:mb-10">
            <div>
              <div className="flex items-center mb-2">
                <div className="mr-2">
                  <svg
                    viewBox="0 0 256 256"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    fill="#000000"
                    width={30}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path
                          d="M128,0 C57.307,0 0,57.307 0,128 L0,128 C0,198.693 57.307,256 128,256 L128,256 C198.693,256 256,198.693 256,128 L256,128 C256,57.307 198.693,0 128,0 L128,0 Z"
                          fill="#40B3E0"
                        >
                          {" "}
                        </path>{" "}
                        <path
                          d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308"
                          fill="#FFFFFF"
                        >
                          {" "}
                        </path>{" "}
                        <path
                          d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475"
                          fill="#D2E5F1"
                        >
                          {" "}
                        </path>{" "}
                        <path
                          d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624"
                          fill="#B5CFE4"
                        >
                          {" "}
                        </path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </div>
                <span className="text-blue-700 font-bold text-md md:text-xl">
                  @cambiomimb
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div>
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width={35}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                        fill="#BFC8D0"
                      ></path>{" "}
                      <path
                        d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
                        fill="url(#paint0_linear_87_7264)"
                      ></path>{" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
                        fill="white"
                      ></path>{" "}
                      <path
                        d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
                        fill="white"
                      ></path>{" "}
                      <defs>
                        {" "}
                        <linearGradient
                          id="paint0_linear_87_7264"
                          x1="26.5"
                          y1="7"
                          x2="4"
                          y2="28"
                          gradientUnits="userSpaceOnUse"
                        >
                          {" "}
                          <stop stopColor="#5BD066"></stop>{" "}
                          <stop offset="1" stopColor="#27B43E"></stop>{" "}
                        </linearGradient>{" "}
                      </defs>{" "}
                    </g>
                  </svg>
                </div>
                <span className="text-green-700 font-bold text-md md:text-xl">
                  +52 1 984 236 5051
                </span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-700">
              Open 24/7
            </div>
          </div>
          <div>
            <div className="mb-5">
              <h1 className="font-bold text-3xl md:text-5xl max-w-[700px] text-balance text-blue-500">
                Conversor de divisas
              </h1>
              <p className="text-gray-500 text-sm md:text-md">
                Ten en cuenta que los precios pueden variar.
              </p>
            </div>
            <Calculadora data={data} isAuthenticated={isAuthenticated} />

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white shadow-md rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-full overflow-y-auto">
                  <h3 className="font-bold mb-2 text-lg md:text-xl text-gray-800">
                    Seleccionar comentarios visibles:
                  </h3>
                  <div className="max-h-[500px] overflow-y-auto">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex items-center mb-2 max-w-full	"
                      >
                        <input
                          type="checkbox"
                          id={comment._id}
                          checked={tempVisibleComments.includes(comment._id)}
                          onChange={() => toggleCommentVisibility(comment._id)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={comment._id}
                          className="text-sm md:text-base text-gray-700 flex-1 overflow-hidden"
                        >
                          <span className="text-gray-700 italic mb-2 text-sm md:text-base break-words overflow-hidden block">
                            &quot;{comment.comment}&quot;
                          </span>
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
                  </div>
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

            <div className="my-8 bg-white shadow-md rounded-lg p-4 md:p-6 max-w-3xl">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Comentarios de usuarios
              </h3>
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {comments
                  .filter((comment) => visibleComments.includes(comment._id))
                  .map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 rounded-md p-3 md:p-4 max-w-full"
                    >
                      <p className="text-gray-700 italic mb-2 text-sm md:text-base break-words">
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
              setComments={setComments}
              isLoggedIn={isAuthenticated}
            />
          </div>
        </div>
        <div className="shadow-lg p-4 md:p-6 rounded-lg bg-white w-full md:w-[80%] max-w-3xl">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-blue-500 text-center">
            Equivalencias en Dolares
          </h2>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[700px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 hidden md:table">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-3 text-center">
                    Pais
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Moneda
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((country) => (
                    <tr
                      key={country._id}
                      className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="flex justify-center font-bold">
                          {country.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center md:justify-start font-bold">
                          <img
                            src={`data:image/png;base64,${country.flag}`}
                            alt={`${country.name} flag`}
                            className="w-6 h-4 mr-2"
                          />
                          {country.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center font-bold">
                          {country.usd_price}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="md:hidden">
              {data
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => (
                  <div
                    key={country._id}
                    className="bg-white border-b border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700">
                        {country.name}
                      </span>
                      <span className="text-gray-500">{country.usd_price}</span>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={`data:image/png;base64,${country.flag}`}
                        alt={`${country.name} flag`}
                        className="w-6 h-4 mr-2"
                      />
                      <span className="text-gray-500">{country.currency}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
