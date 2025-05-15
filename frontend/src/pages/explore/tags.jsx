import { useEffect, useState } from 'react';
import axios from 'axios';
import DaytripCard from '../../components/DaytripCard';
import { generalTags } from '../../utils/tags';

function TagsFilter() {
  const [daytrips, setDaytrips] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/daytrips').then(res => setDaytrips(res.data));
  }, []);

  const toggleTag = (tagValue) => {
    setSelectedTags(prev =>
      prev.includes(tagValue) ? prev.filter(t => t !== tagValue) : [...prev, tagValue]
    );
  };

  const filtered = daytrips.filter(trip =>
    selectedTags.every(tag => trip.tags?.includes(tag))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6">Filter by Tags</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {generalTags.map(tag => (
          <button
            key={tag.value}
            className={`border px-4 py-2 rounded ${
              selectedTags.includes(tag.value) ? 'bg-green-300' : ''
            }`}
            onClick={() => toggleTag(tag.value)}
          >
            {tag.label}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(trip => (
          <DaytripCard key={trip._id} daytrip={trip} />
        ))}
      </div>
    </div>
  );
}

export default TagsFilter;
