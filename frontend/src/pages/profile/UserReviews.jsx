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
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FaStar className="text-black" />
        Ratings & User Reviews
      </h3>

      {reviews.map((r, i) => (
        <div key={i} className="border rounded-lg p-4 bg-yellow-50 shadow flex gap-4 items- start">
          {/* Left: Image and Author */}
          <div className="w-32 flex flex-col items-center">
           <div className="text-lg font-bold text-center text-green-600 mb-2">
            <Link to={`/daytrips/${r.daytripId}`}>
              {r.daytripTitle}
              </Link>
            </div>
            <Link to={`/daytrips/${r.daytripId}`}>
              <img
                src={r.daytripImage || '/default.jpg'}
                alt="Daytrip"
                className="rounded-lg w-28 h-20 object-cover mb-2"
              />
            </Link>
            Created by:
            <Link
              to={`/profile/${r.author?._id}`}
              className="text-sm font-semibold text-blue-700 hover:underline text-center"
            >
            {r.author?.firstName} {r.author?.lastName}
            </Link>
          </div>

          {/* Right: Review Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-gray-800">
                {r.title ? r.title : <p className="text-1xl text-black mb-2"> 
                  {r.user?.firstName} rated this daytrip : 
                </p>}
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
              <p className="text-black text-md italic bg-white p-3 rounded">
                {r.comment}
              </p>
            ) : (
              <p className="text-lg italic text-gray-700">No review provided.</p>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}

export default UserReviews;
