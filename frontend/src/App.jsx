  import { Routes, Route, Meta } from 'react-router-dom';
  import { LoadScript } from '@react-google-maps/api';
  import { Navigate } from 'react-router-dom';
  import './App.css'
  import Home from './pages/Home';
  import About from './pages/About';
  import Daytrips from './pages/Daytrips';
  import Login from './pages/Login';
  import Signup from './pages/Signup';
  import Contact from './pages/Contact';
  import Profile from './pages/Profile';
  import Navbar from './components/Navbar';
  import Footer from './components/Footer';
  import CreateDaytrip from './pages/CreateDaytrip';
  import DaytripDetails from './components/DaytripDetails';
  import Feed from './components/Feed';
  import LocationFilter from './pages/explore/location';
  import CountyFilter from './pages/explore/county';
  import TagsFilter from './pages/explore/tags';
  import TopRated from './pages/explore/toprated';
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  const user = JSON.parse(localStorage.getItem('userInfo')); 

  function App() {
    return (
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <div className="flex flex-col min-h-screen">
          <Navbar/>
          <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/daytrips" element={<Daytrips />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Navigate to={`/profile/${user?._id}`} />} />
            <Route path="/create-daytrip" element={<CreateDaytrip />} />
            <Route path="/daytrips/:id" element={<DaytripDetails />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/explore/location" element={<LocationFilter />} />
            <Route path="/explore/county" element={<CountyFilter />} />
            <Route path="/explore/tags" element={<TagsFilter />} />
            <Route path="/explore/toprated" element={<TopRated />} />
          </Routes>
          </main> 
          <Footer/>
          <ToastContainer position="bottom-right" autoClose={3000} /> 
        </div>
      </LoadScript>
    );
  }

  export default App;
