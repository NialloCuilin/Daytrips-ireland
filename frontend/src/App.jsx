import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
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

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3yNr0eqeBW2rjE9LV5kkk7hnJgtVM4Sw'; 

function App() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <div className="flex flex-col min-h-screen">
        <Navbar/>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/daytrips" element={<Daytrips />}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/create-daytrip" element={<CreateDaytrip />} />
            <Route path="/daytrips/:id" element={<DaytripDetails />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </main> 
        <Footer/> 
      </div>
    </LoadScript>
  );
}

export default App;
