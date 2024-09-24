import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const CommentForm = ({ setComments, isLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState({
    name: "",
    comment: "",
  });
  const [error, setError] = useState("");
  const [nameCharsLeft, setNameCharsLeft] = useState(20);
  const [commentCharsLeft, setCommentCharsLeft] = useState(120);

  const handleNameChange = useCallback((e) => {
    const name = e.target.value;
    if (name.length <= 20) {
      setNewComment((prev) => ({ ...prev, name }));
      setNameCharsLeft(20 - name.length);
    }
  }, []);

  const handleCommentChange = useCallback((e) => {
    const comment = e.target.value;
    if (comment.length <= 120) {
      setNewComment((prev) => ({ ...prev, comment }));
      setCommentCharsLeft(120 - comment.length);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newComment.comment.trim() === "") {
      setError("El comentario no puede estar vacío.");
      return;
    }
    if (newComment.name.length > 20) {
      setError("El nombre no puede tener más de 20 caracteres.");
      return;
    }
    if (newComment.comment.length > 120) {
      setError("El comentario no puede tener más de 120 caracteres.");
      return;
    }

    const commentToSend = {
      name: newComment.name.trim() === "" ? "Anónimo" : newComment.name,
      comment: newComment.comment,
      isVisible: false, // Set isVisible to false by default
    };

    try {
      const response = await axios.post(
        "https://server-chi-lyart.vercel.app/api/createComment",
        commentToSend
      );
      setComments((prev) => [...prev, response.data.comment]);
      setNewComment({ name: "", comment: "" });
      setShowModal(false);
      setError(""); // Clear error on successful submission
      setNameCharsLeft(20); // Reset character count
      setCommentCharsLeft(120); // Reset character count
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre (Opcional)"
                value={newComment.name}
                onChange={handleNameChange}
                className="block w-full p-2 md:p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300 text-gray-700"
              />
              <p className="text-gray-500 text-sm">
                {nameCharsLeft} caracteres restantes
              </p>
              <textarea
                placeholder="Comentario"
                value={newComment.comment}
                onChange={handleCommentChange}
                className="block w-full p-2 md:p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300 text-gray-700 h-24 md:h-32 resize-none"
              ></textarea>
              <p className="text-gray-500 text-sm">
                {commentCharsLeft} caracteres restantes
              </p>
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
  isLoggedIn: PropTypes.bool.isRequired,
};

export default CommentForm;
