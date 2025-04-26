import DaytripCard from "../components/DaytripCard";

function Daytrips() {
  const trips = [
    {
      image: "your-image-path.jpg",
      title: "Glenariff Waterfall Walk",
      description: "County Antrim • Hike • Scenic",
    },
    {
      image: "your-second-image.jpg",
      title: "Dunluce Castle Adventure",
      description: "County Antrim • History • Coastal",
    },
    // etc...
  ];

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-center">Find Your Next Adventure</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input 
          type="text"
          placeholder="Search by keyword, location, or activity..."
          className="w-full max-w-md p-3 border rounded shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <button className="px-4 py-2 bg-green-700 text-white rounded-full">Hiking</button>
        <button className="px-4 py-2 bg-green-700 text-white rounded-full">Beach</button>
        <button className="px-4 py-2 bg-green-700 text-white rounded-full">Castle</button>
        <button className="px-4 py-2 bg-green-700 text-white rounded-full">Waterfalls</button>
      </div>

      {/* Daytrip Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {trips.map((trip, index) => (
          <DaytripCard 
            key={index}
            image={trip.image}
            title={trip.title}
            description={trip.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Daytrips;
