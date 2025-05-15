import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

function UserReviews({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUserId(parsed._id);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`/api/daytrips/reviews/user/${userId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, [userId]);

  const handleDeleteReview = async (reviewId) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await axios.delete(`/api/daytrips/reviews/${user._id}/${reviewId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Could not delete review.");
    }
  };

  if (reviews.length === 0) {
    return <p className="text-gray-500 italic">This user hasn't written any reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FaStar className="text-black" />
        Ratings & User Reviews
      </h3>

      {reviews.map((r, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 bg-yellow-50 shadow flex gap-4 items-start relative"
        >
          {/* Left: Daytrip info */}
          <div className="w-32 flex flex-col items-center">
            <div className="text-lg font-bold text-center text-green-600 mb-2">
              <Link to={`/daytrips/${r.daytripId}`}>{r.daytripTitle}</Link>
            </div>
            <Link to={`/daytrips/${r.daytripId}`}>
              <img
                src={r.daytripImage || "/default.jpg"}
                alt="Daytrip"
                className="rounded-lg w-28 h-20 object-cover mb-2"
              />
            </Link>
            <span className="text-xs text-gray-600">Created by:</span>
            <Link
              to={`/profile/${r.author?._id}`}
              className="text-sm font-semibold text-blue-700 hover:underline text-center"
            >
              {r.author?.firstName} {r.author?.lastName}
            </Link>
          </div>

          {/* Right: Review content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-gray-800">
                {r.title || `${r.user?.firstName} rated this daytrip:`}
              </h3>
              <span className="text-sm text-gray-500 italic">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-lg ${
                    star <= r.value ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {r.comment ? (
              <p className="text-black text-md italic bg-white p-3 rounded">{r.comment}</p>
            ) : (
              <p className="text-lg italic text-gray-700">No review provided.</p>
            )}

            {/* Delete button for current user's review */}
            {r.user?._id === currentUserId && (
              <button
                onClick={() => handleDeleteReview(r._id)}
                className="mt-3 inline-flex items-center text-sm text-red-600 hover:text-red-800 gap-1"
              >
                <FaTrash /> Delete Review
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserReviews;
