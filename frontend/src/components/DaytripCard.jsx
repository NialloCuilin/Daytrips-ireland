import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function DaytripCard({ daytrip }) {
  if (!daytrip) return null;
  //render stars based on the average rating
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
  //format travel time in hours and minutes
  const formatTravelTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} min`;
    if (mins === 0) return `${hrs} hr`;
    return `${hrs} hr ${mins} min`;
  };

  return (
    <Link to={`/daytrips/${daytrip._id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:scale-105 transition cursor-pointer">
        <img src={daytrip.images[0]} alt={daytrip.title} className="h-48 w-full object-cover" />
        <div className="p-4">
          <h2 className="font-bold text-xl mb-2">{daytrip.title}</h2>
          <p className="text-gray-600 line-clamp-3">{daytrip.description}</p>
          {/* Duration */}
          {daytrip.travelTime !== undefined && (
            <p className="text-sm text-gray-500 mt-2">
              ⏱ Approx. {formatTravelTime(daytrip.travelTime)} travel time
            </p>
          )}
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
