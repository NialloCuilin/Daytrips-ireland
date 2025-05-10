import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function DaytripCard({ daytrip }) {
  if (!daytrip) return null;

  const renderStars = () => {
    const rating = daytrip.averageRating || 0;
    return [1, 2, 3, 4, 5].map((star) => {
      if (star <= Math.floor(rating)) {
        return <FaStar key={star} className="text-sm text-yellow-400" />;
      } else if (star - rating < 1) {
        return <FaStarHalfAlt key={star} className="text-sm text-yellow-400" />;
      } else {
        return <FaStar key={star} className="text-sm text-gray-300" />;
      }
    });
  };

  return (
    <Link to={`/daytrips/${daytrip._id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:scale-105 transition cursor-pointer">
        <img src={daytrip.images[0]} alt={daytrip.title} className="h-48 w-full object-cover" />
        <div className="p-4">
          <h2 className="font-bold text-xl mb-2">{daytrip.title}</h2>
          <p className="text-gray-600 line-clamp-3">{daytrip.description}</p>
        </div>
        <div className="flex items-center gap-1 justify-center mb-4">
          {renderStars()}
          <span className="text-sm text-gray-600 ml-1">
            ({daytrip.ratings?.length || 0} rating{daytrip.ratings?.length === 1 ? '' : 's'})
          </span>
        </div>
      </div>
    </Link>
  );
}

export default DaytripCard;
