  import { useState } from 'react'
  import { Routes, Route } from 'react-router-dom';
  import { LoadScript } from '@react-google-maps/api';
  import { Navigate } from 'react-router-dom';
  import React from 'react';
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
  import LocationFilter from './pages/explore/location';
  import CountyFilter from './pages/explore/county';
  import TagsFilter from './pages/explore/tags';
  import TopRated from './pages/explore/toprated';

  const GOOGLE_MAPS_API_KEY = 'AIzaSyA3yNr0eqeBW2rjE9LV5kkk7hnJgtVM4Sw';
  const user = JSON.parse(localStorage.getItem('userInfo')); 

  function App() {
    return (
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
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
            
            {/* Explore filter pages */}
            <Route path="/explore/location" element={<LocationFilter />} />
            <Route path="/explore/county" element={<CountyFilter />} />
            <Route path="/explore/tags" element={<TagsFilter />} />
            <Route path="/explore/toprated" element={<TopRated />} />
          </Routes>

          </main> 
          <Footer/> 
        </div>
      </LoadScript>
    );
  }

  export default App;
