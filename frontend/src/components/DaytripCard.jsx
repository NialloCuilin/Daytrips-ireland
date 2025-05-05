import { Link } from 'react-router-dom';

function DaytripCard({ daytrip }) {

  if (!daytrip) return null; // Avoid rendering if data is missing
  return (
    <Link to={`/daytrips/${daytrip._id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:scale-105 transition cursor-pointer">
        <img src={daytrip.images[0]} alt={daytrip.title} className="h-48 w-full object-cover" />
        <div className="p-4">
          <h2 className="font-bold text-xl mb-2">{daytrip.title}</h2>
          <p className="text-gray-600 line-clamp-3">{daytrip.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default DaytripCard;
