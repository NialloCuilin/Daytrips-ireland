function DaytripCard({ image, title, description }) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden hover:scale-105 transition">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        <div className="p-4">
          <h2 className="font-bold text-xl mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  }
  
  export default DaytripCard;