import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const CommentForm = ({ comments, setComments, isLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState({
    name: "",
    comment: "",
  });
  const [error, setError] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault();

    // Validation
    if (newComment.comment.trim() === "") {
      setError("El comentario no puede estar vacío.");
      return;
    }

    const commentToSend = {
      name: newComment.name.trim() === "" ? "Anónimo" : newComment.name,
      comment: newComment.comment,
    };

    try {
      const response = await axios.post(
        "https://server-chi-lyart.vercel.app/api/createComment",
        commentToSend
      );
      setComments([...comments, response.data.comment]);
      setNewComment({ name: "", comment: "" });
      setShowModal(false);
      setError(""); // Clear error on successful submission
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Hubo un error al agregar el comentario. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      {!isLoggedIn && (
        <button
          className="bg-blue-500 rounded-md px-3 py-2 text-white font-medium hover:bg-blue-400 duration-200 text-sm md:text-base"
          onClick={() => setShowModal(true)}
        >
          Agregar review
        </button>
      )}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="shadow-lg p-4 md:p-6 rounded-lg bg-white w-full max-w-md mx-auto"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
              Agrega comentario
            </h2>
            <form onSubmit={handleAddComment} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre (Opcional)"
                value={newComment.name}
                onChange={(e) =>
                  setNewComment({ ...newComment, name: e.target.value })
                }
                className="block w-full p-2 md:p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300 text-gray-700"
              />
              <textarea
                placeholder="Comentario"
                value={newComment.comment}
                onChange={(e) =>
                  setNewComment({ ...newComment, comment: e.target.value })
                }
                className="block w-full p-2 md:p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300 text-gray-700 h-24 md:h-32 resize-none"
              ></textarea>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 text-sm md:text-base"
              >
                Post comment
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

CommentForm.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      comment: PropTypes.string.isRequired,
    })
  ).isRequired,
  setComments: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired, // Add prop type for isLoggedIn
};

export default CommentForm;
