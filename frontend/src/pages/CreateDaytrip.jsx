import { useState, useRef } from 'react';
import axios from 'axios';
import { Autocomplete } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaMapMarkedAlt,FaMarker, FaTags, FaMapSigns, FaHiking, } from 'react-icons/fa';
import Select from 'react-select'
import { components } from 'react-select';
import { useDropzone } from 'react-dropzone';
import { IoMdStopwatch } from "react-icons/io";
import { Loader } from "@googlemaps/js-api-loader";

function CreateDaytrip({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    countyTags: '',
    travelType: 'Car',
  });
  const [images, setImages] = useState([]);
  const onDrop = async (acceptedFiles) => {
    const uploadedUrls = [];
  
    for (let file of acceptedFiles) {
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
  
    setImages(prev => [...prev, ...uploadedUrls]);
    setImagePreviews(prev => [...prev, ...uploadedUrls]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [locationInputs, setLocationInputs] = useState([
    { id: Date.now(), ref: null, description: '', timeSpent: '30' } // default to 30 mins
  ]);
  const countyTags = [ 
    {value: 'Antrim', label: 'Antrim'},{value: 'Armagh', label: 'Armagh'},{value: 'Carlow', label: 'Carlow'},
    {value: 'Cavan', label: 'Cavan'},{value: 'Clare', label: 'Clare'},{value: 'Cork', label: 'Cork'},
    {value: 'Derry', label: 'Derry'},{value: 'Donegal', label: 'Donegal'},{value: 'Down', label: 'Down'},
    {value: 'Dublin', label: 'Dublin'},{value: 'Fermanagh', label: 'Fermanagh'}, {value: 'Galway', label: 'Galway'}, 
    {value: 'Kerry', label: 'Kerry'}, {value: 'Kildare', label: 'Kildare'}, {value: 'Kilkenny', label: 'Kilkenny'},
    {value: 'Laois', label: 'Laois'},{value: 'Leitrim', label: 'Leitrim'},{value: 'Limerick', label: 'Limerick'},
    {value: 'Longford', label: 'Longford'},{value: 'Louth', label: 'Louth'},{value: 'Mayo', label: 'Mayo'},
    {value: 'Meath', label: 'Meath'},{value: 'Monaghan', label: 'Monaghan'},{value: 'Offaly', label: 'Offaly'},
    {value: 'Roscommon', label: 'Roscommon'},{value: 'Sligo', label: 'Sligo'},{value: 'Tipperary', label: 'Tipperary'},
    {value: 'Tyrone', label: 'Tyrone'},{value: 'Waterford', label: 'Waterford'},{value: 'Westmeath', label: 'Westmeath'},
    {value: 'Wexford', label: 'Wexford'},{value: 'Wicklow', label: 'Wicklow'},
  ];
  const generalTags =[
    {value: 'Beach', label: 'Beach'},{value: 'Forest', label: 'Forest'},{value: 'River', label: 'River'},
    {value: 'Mountain', label: 'Mountain'},{value: 'Bog', label: 'Bog'},{value: 'Lough', label: 'Lough'},
    {value: 'Cave', label: 'Cave'},{value: 'Cliffs', label: 'Cliffs'},{value: 'Waterfall', label: 'Waterfall'},
    {value: 'Glen', label: 'Glen'},{value: 'Island', label: 'Island'},{value: 'Park', label: 'Park'},
    {value: 'Village', label: 'Village'},{value: 'Town', label: 'Town'},{value: 'City', label: 'City'},
    {value: 'Castle', label: 'Castle'},{value: 'Fort', label: 'Fort'},{value: 'Ancient', label: 'Ancient'},
    {value: 'Bar', label: 'Bar'},{value: 'Restaurant', label: 'Restaurant'},{value: 'Cafe', label: 'Cafe'},
    {value: 'Museum', label: 'Museum'},{value: 'Zoo', label: 'Zoo'},{value: 'Aquarium', label: 'Aquarium'},
    {value: 'Lighthouse', label: 'Lighthouse'},{value: 'Birdwatching', label: 'Birdwatching'},{value: 'Hike', label: 'Hike'},
    {value: 'Walk', label: 'Walk'},{value: 'Cycle', label: 'Cycle'},{value: 'Viewpoint', label: 'Viewpoint'} ,
    {value: 'Ice-Cream', label: 'Ice-Cream'}, {value: 'Historic', label: 'Historic'},{value: 'Landmark', label: 'Landmark'},
    {value: 'National Park', label: 'National Park'}, {value: 'Urban', label: 'Urban'}
  ];
  const travelTypes = [ 
    {value: 'Car', label: 'Car'},{value: 'Bus', label: 'Bus'},{value: 'Train', label: 'Train'},
    {value: 'Bike', label: 'Bike'},{value: 'Walk', label: 'Walk'},{value: 'Ferry', label: 'Ferry'}  
  ]
  const CountiesPlaceholder = (props) => {
    return (
      <components.Placeholder {...props}>
        <span className="flex items-center gap-2 text-gray-500">
          <FaMapSigns/>
          {props.children}
        </span>
      </components.Placeholder>
    );
  };
  const tagsPlaceholder = (props) => {
    return (
      <components.Placeholder {...props}>
        <span className="flex items-center gap-2 text-gray-500">
        < FaTags/>
          {props.children}
        </span>
      </components.Placeholder>
    );
  };
  const durationPlaceholder = (props) => {
    return (
      <components.Placeholder {...props}>
        <span className="flex items-center gap-2 text-gray-500">
        <IoMdStopwatch />
          {props.children}
        </span>
      </components.Placeholder>
    );
  };
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
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [selectedTravelType, setSelectedTravelType] = useState([]);
  const removeLocationInput = (index) => {
    setLocationInputs((prev) => prev.filter((_, i) => i !== index));
    setSelectedPlaces((prev) => prev.filter((_, i) => i !== index));
  };
  const calculateTripDuration = async () => {
    const apiKey = 'AIzaSyA3yNr0eqeBW2rjE9LV5kkk7hnJgtVM4Sw';
    const loader = new Loader({
      apiKey,
      libraries: ['places']
    });
  
    await loader.load();
    const { google } = window;
  
    const coords = selectedPlaces.map(p => new google.maps.LatLng(p.lat, p.lng));
    const totalVisitMinutes = locationInputs.reduce((sum, l) => sum + Number(l.timeSpent || 0), 0);


  
    if (coords.length < 2) {
      return totalVisitMinutes;
    }
  
    return new Promise((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();
      let totalTravelSeconds = 0;
  
      const promises = [];
  
      for (let i = 0; i < coords.length - 1; i++) {
        promises.push(new Promise((res, rej) => {
          service.getDistanceMatrix(
            {
              origins: [coords[i]],
              destinations: [coords[i + 1]],
              travelMode: google.maps.TravelMode.DRIVING, // Or WALKING, etc.
            },
            (response, status) => {
              if (status !== "OK") return rej(status);
              const element = response.rows[0].elements[0];
              if (element.status === "OK") {
                res(element.duration.value); // in seconds
              } else {
                res(0);
              }
            }
          );
        }));
      }
  
      Promise.all(promises).then(durations => {
        totalTravelSeconds = durations.reduce((sum, s) => sum + s, 0);
        const totalMinutes = Math.round(totalTravelSeconds / 60) + totalVisitMinutes;
        resolve(totalMinutes);
      }).catch(reject);
    });
  };
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDescriptionChange = (index, value) => {
    setLocationInputs((prev) => {
      const updated = [...prev];
      updated[index].description = value;
      return updated;
    });
  };
  const handleTimeSpentChange = (index, value) => {
    setLocationInputs((prev) => {
      const updated = [...prev];
      updated[index].timeSpent = value;
      return updated;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    console.log("SUBMITTING:", {
      description: form.description,
      travelType: form.travelType,
    });
    const totalDuration = await calculateTripDuration();
   try {
    await axios.post('http://localhost:5000/api/daytrips/create', {
      title: form.title,
      description: form.description,
      travelType: selectedTravelType.map(type => type.value),
      locations: selectedPlaces.map((place, idx) => ({
        name: place.name,
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        description: locationInputs[idx]?.description || '',
        timeSpent: parseInt(locationInputs[idx]?.timeSpent) || 0
        })),
      tags: selectedTags.map(tag => tag.value),
      countyTags: selectedCounties.map(county => county.value),
      duration: `${totalDuration} minutes`,
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
    setLocationInputs([
      ...locationInputs,
      { id: Date.now(), ref: null, description: '', timeSpent: '30' } // ✅ DEFAULT HERE
    ]);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
       <div className="bg-yellow-50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
         {/* Close button INSIDE the form container */}
      <button
        className="absolute top-1 right-3 text-black hover:text-red-500 text-3xl"
        onClick={onClose}
        type="button"
      >
        &times;
      </button>
      {/* Form title and icon */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <FaHiking className="text-4xl text-black-700" />
        <h2 className="text-2xl font-bold">Create a Daytrip</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title input */}
        <div className="relative">
          <FaMapMarkedAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full pl-10 p-2 border rounded"
          />
        </div>
        {/* Description input */}
        <div className="relative">
          <FaMarker className="absolute top-4 left-3 text-black" />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full pl-10 pt-3 pb-2 pr-3 border rounded"
          />
        </div>
        {/* Location inputs with Autocomplete */}  
        {locationInputs.map((input, idx) => (
          <div key={input.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 z-50" />
                <Autocomplete 
                  onLoad={(autocomplete) => {
                    locationInputs[idx].ref = autocomplete;
                  }}
                  onPlaceChanged={() => handlePlaceChanged(idx)}
                >
                  <input
                    type="text"
                    placeholder={`Location ${idx + 1}`}
                    className="w-full pl-10 pr-8 p-2 border rounded"
                  />
                </Autocomplete>

                {locationInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLocationInput(idx)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 text-xl"
                    title="Remove location"
                  >
                    &times;
                  </button>
                )}
              </div>
              
            </div>

            <div className="flex items-center gap-3">
              <label className="text-3x-l text-gray-600 whitespace-nowrap">
                Duration of Stay at Location (minutes):
              </label>
              <input
                type="number"
                min="0"
                value={input.timeSpent}
                onChange={(e) => handleTimeSpentChange(idx, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
            </div>

            <div>
              <textarea
                placeholder="Description for this location... Any advice or tips?"
                value={input.description}
                onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        ))}

        {/* Button to add more location inputs */}
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
         {/* Image Upload */}
         <div {...getRootProps()} className="w-full border-2 border-dashed bg-white border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-green-600 font-medium">Drop the images here...</p>
            ) : (
              <p className="text-gray-500">Drag & drop images here, or click to browse</p>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {imagePreviews.map((url, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img src={url} alt="preview" className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                    setImages(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-1 text-xs"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        <div className="max-w-md mx-auto space-y-4">
          {/* Subheading */}
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">Daytrip Details</h3>
          {/* Multi select for counties */}
          <Select
            id="counties"
            isMulti
            options={countyTags}
            value={selectedCounties}
            components={{ Placeholder: CountiesPlaceholder }}
            onChange={setSelectedCounties}
            styles={countyStyles}
            placeholder="Daytrip Counties..."
          />
          {/* Multi select for tags */}
          <Select
            id="tags"
            isMulti 
            options={generalTags}
            value={selectedTags}
            components={{ Placeholder: tagsPlaceholder }}
            onChange={setSelectedTags}
            styles={generalStyles}
            placeholder="Daytrip Tags..."
          />
          {/* Select for travel type */}
          <Select
            id="travelType"
            isMulti
            options={travelTypes}
            value={selectedTravelType}
            onChange={setSelectedTravelType}
            placeholder="Travel Type..."
          />
          
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