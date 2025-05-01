import { useState, useRef } from 'react';
import axios from 'axios';
import { Autocomplete } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Select from 'react-select'

function CreateDaytrip({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    countyTags: '',
    travelType: 'Car',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [locationInputs, setLocationInputs] = useState([{ id: Date.now(), ref: null }]);
  const countyTags = [ 
    {value: 'Antrim', label: 'Antrim'},
    {value: 'Armagh', label: 'Armagh'},
    {value: 'Carlow', label: 'Carlow'},
    {value: 'Cavan', label: 'Cavan'},
    {value: 'Clare', label: 'Clare'},
    {value: 'Cork', label: 'Cork'},
    {value: 'Derry', label: 'Derry'},
    {value: 'Donegal', label: 'Donegal'},
    {value: 'Down', label: 'Down'},
    {value: 'Dublin', label: 'Dublin'},
    {value: 'Fermanagh', label: 'Fermanagh'}, 
    {value: 'Galway', label: 'Galway'}, 
    {value: 'Kerry', label: 'Kerry'}, 
    {value: 'Kildare', label: 'Kildare'}, 
    {value: 'Kilkenny', label: 'Kilkenny'},
    {value: 'Laois', label: 'Laois'},
    {value: 'Leitrim', label: 'Leitrim'},
    {value: 'Limerick', label: 'Limerick'},
    {value: 'Longford', label: 'Longford'},
    {value: 'Louth', label: 'Louth'},
    {value: 'Mayo', label: 'Mayo'},
    {value: 'Meath', label: 'Meath'},
    {value: 'Monaghan', label: 'Monaghan'},
    {value: 'Offaly', label: 'Offaly'},
    {value: 'Roscommon', label: 'Roscommon'},
    {value: 'Sligo', label: 'Sligo'},
    {value: 'Tipperary', label: 'Tipperary'},
    {value: 'Tyrone', label: 'Tyrone'},
    {value: 'Waterford', label: 'Waterford'},
    {value: 'Westmeath', label: 'Westmeath'},
    {value: 'Wexford', label: 'Wexford'},
    {value: 'Wicklow', label: 'Wicklow'},
  ];
  const generalTags =[
    {value: 'Beach', label: 'Beach'},
    {value: 'Forest', label: 'Forest'},
    {value: 'River', label: 'River'},
    {value: 'Mountain', label: 'Mountain'},
    {value: 'Bog', label: 'Bog'},
    {value: 'Lough', label: 'Lough'},
    {value: 'Cave', label: 'Cave'},
    {value: 'Cliff', label: 'Cliff'},
    {value: 'Waterfall', label: 'Waterfall'},
    {value: 'Glen', label: 'Glen'},
    {value: 'Island', label: 'Island'},
    {value: 'Park', label: 'Park'},
    {value: 'Village', label: 'Village'},
    {value: 'Town', label: 'Town'},
    {value: 'City', label: 'City'},
    {value: 'Castle', label: 'Castle'},
    {value: 'Fort', label: 'Fort'},
    {value: 'Ancient', label: 'Ancient'},
    {value: 'Bar', label: 'Bar'},
    {value: 'Reastaurant', label: 'Reastaurant'},
    {value: 'Cafe', label: 'Cafe'},
    {value: 'Meuseum', label: 'Meuseum'},
    {value: 'Zoo', label: 'Zoo'},
    {value: 'Acquarium', label: 'Acquarium'},
    {value: 'Lighthouse', label: 'Lighthouse'},
    {value: 'Birdwatching', label: 'Birdwatching'},
    {value: 'Hike', label: 'Hike'},
    {value: 'Walk', label: 'Walk'},
    {value: 'Cycle', label: 'Cycle'},
    {value: 'Sightseeing', label: 'Sightseeing'} ,
    {value: 'Coffee', label: 'Coffee'},
    {value: 'Pint', label: 'Pint'},
    {value: 'Ice-Cream', label: 'Ice-Cream'},
    {value: 'Breakfast', label: 'Breakfast'},
    {value: 'Lunch', label: 'Lunch'},
    {value: 'Dinner', label: 'Dinner'},
  ];

  const countyStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#e0f7fa',
      borderRadius: '12px',
      padding: '2px 6px',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#00796b',
      fontWeight: 'bold',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#00796b',
      ':hover': {
        backgroundColor: '#b2dfdb',
        color: '#004d40',
      },
    }),
  };

  const generalStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#bcebff',
      borderRadius: '12px',
      padding: '2px 6px',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '0042ff',
      fontWeight: 'bold',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#00796b',
      ':hover': {
        backgroundColor: '#b2dfdb',
        color: '#004d40',
      },
    }),
  };

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);

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
    setImagePreviews(uploadedUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    try {
      await axios.post('http://localhost:5000/api/daytrips/create', {
        title: form.title,
        description: form.description,
        locations: selectedPlaces.map((place) => place.address),
        tags: selectedTags,
        countyTags: selectedCounties,
        images,
        author: user._id,
      });

      alert('Daytrip created successfully!');
      if (onClose) onClose(); // Close modal if applicable
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to create daytrip.');
    }
  };

  const handlePlaceChanged = (index) => {
    const input = locationInputs[index];
    const place = input.ref?.getPlace();
    if (!place) return;

    const location = {
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    const updatedPlaces = [...selectedPlaces];
    updatedPlaces[index] = location;
    setSelectedPlaces(updatedPlaces);
  };

  const addLocationInput = () => {
    setLocationInputs([...locationInputs, { id: Date.now(), ref: null }]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
       <div className="bg-yellow-50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
         {/* Close button INSIDE the form container */}
      <button
        className="absolute top-0 right-1 text-black hover:text-red-500 text-3xl"
        onClick={onClose}
        type="button"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center">Create a Daytrip</h2>
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
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />  

        {locationInputs.map((input, idx) => (
          <div key={input.id} className="relative mb-2">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 z-50" />
            
            <Autocomplete
              onLoad={(autocomplete) => { 
                locationInputs[idx].ref = autocomplete;
              }}
              onPlaceChanged={() => handlePlaceChanged(idx)}
            >
              {/* Only input inside Autocomplete */}
              <input
                type="text"
                placeholder={`Location ${idx + 1}`}
                className="w-full pl-10 p-2 border rounded relative z-20"
              />
            </Autocomplete> 
          </div>
        ))}

        <button
          type="button"
          onClick={addLocationInput}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-green-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Location
        </button>

        {/* Multi select for counties */}
        <div className="flex items-center gap-2">
        <label htmlFor="counties">Select Counties:</label>
        <Select
          id="counties"
          isMulti
          options={countyTags}
          value={selectedCounties}
          onChange={setSelectedCounties}
          styles={countyStyles}
          placeholder="Choose counties..."
        />
        </div>  

        {/* Multi select for tags */}
        <div className="flex items-center gap-2"> 
        <label htmlFor="counties">Select Daytrip Tags:</label>
        <Select
          id="counties"
          isMulti
          options={generalTags}
          value={selectedTags}
          onChange={setSelectedTags}
          styles={generalStyles}
          placeholder="Choose tags..."
        />
        </div>  

        <div className="flex items-center gap-2">
          <span className="text-black font-medium">Please choose a travel method:</span>
          <select
            name="travelType"
            value={form.travelType}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option>Car</option>
            <option>Bus</option>
            <option>Train</option>
            <option>Bike</option>
          </select>
        </div>

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

        <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit Daytrip
        </button>
      </form>
      </div>  
    </div>
  );
}

export default CreateDaytrip;
