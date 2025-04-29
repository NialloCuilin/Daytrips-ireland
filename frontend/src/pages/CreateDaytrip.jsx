import { useState } from 'react';
import axios from 'axios';

function CreateDaytrip({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    locations: '',
    tags: '',
    countyTags: '',
    travelType: 'Car',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dqrpclqri/image/upload', formData);
        uploadedUrls.push(res.data.secure_url);
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    setImages(uploadedUrls);
    setImagePreviews(uploadedUrls); // for preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    try {
      await axios.post('http://localhost:5000/api/daytrips/create', {
        title: form.title,
        locations: form.locations.split(',').map((loc) => loc.trim()),
        tags: form.tags.split(',').map((tag) => tag.trim()),
        countyTags: form.countyTags.split(',').map((tag) => tag.trim()),
        travelType: form.travelType,
        images,
        author: user._id,
      });

      alert('Daytrip created successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to create daytrip.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create a Daytrip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="locations"
          placeholder="Locations (comma-separated)"
          value={form.locations}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="countyTags"
          placeholder="Counties (comma-separated)"
          value={form.countyTags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="travelType"
          value={form.travelType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Car</option>
          <option>Bus</option>
          <option>Train</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
        />

        <div className="flex flex-wrap gap-4 mt-4">
          {imagePreviews.map((url, idx) => (
            <img key={idx} src={url} alt="preview" className="w-24 h-24 object-cover rounded" />
          ))}
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit Daytrip
        </button>
      </form>
    </div>
  );
}

export default CreateDaytrip;
