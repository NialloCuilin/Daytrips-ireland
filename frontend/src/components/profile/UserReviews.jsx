import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

function UserReviews({ userId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`/api/daytrips/reviews/user/${userId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Failed to fetch reviews:", err));
  }, [userId]);

  if (reviews.length === 0) {
    return <p className="text-gray-500 italic">This user hasn't written any reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((r, i) => (
        <div key={i} className="border rounded-lg p-4 bg-white shadow">
          <div className="flex justify-between items-start mb-1">
            <Link to={`/daytrips/${r.daytripId}`} className="font-bold text-lg hover:underline">
              {r.title || '(No title)'}
            </Link>
            <span className="text-sm text-gray-500 italic">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-green-600 hover:underline text-left mb-1">
            <Link to={`/daytrips/${r.daytripId}`}>{r.daytripTitle}</Link>
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar
                key={star}
                className={`text-sm ${star <= r.value ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>

          {r.comment && (
            <p className="text-gray-700 text-sm italic bg-gray-100 p-2 rounded">{r.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserReviews;
