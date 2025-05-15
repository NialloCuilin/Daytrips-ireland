import { useState } from "react";
import { FaStar } from "react-icons/fa";

function RatingModal({ isOpen, onClose, onSubmit, user, initialRating = 0 }) {
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState("");
    const [title, setTitle] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        {user && (
        <div className="flex flex flex-col items-center justify-center mb-4 text-center">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="User avatar"
                className="w-20 h-20 rounded-full object-cover"
            />
        </div>
      )}
        <h2 className="text-xl font-bold mb-1 italic">What did you think?</h2>
        <p className="text-sm mb-3 italic">Rate this Daytrip</p>
        {/* Stars */}
        <div className="flex gap-1 mb-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review Title"
            className="w-full border p-2 rounded mb-3"
        />

        {/* Optional comment */}
        <textarea
          rows={3}
          className="w-full border rounded p-2 text-sm mb-4"
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">    
          <button onClick={onClose} className="text-gray-500 hover:underline">
            Cancel
          </button>
          <button
            onClick={() => {
               onSubmit(rating, comment, title);
                onClose();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
            Submit
            </button>
        </div>
      </div>
    </div> 
  );
}

export default RatingModal;
