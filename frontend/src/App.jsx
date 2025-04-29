import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
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

function App() {
  return (
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
        </Routes>
      </main> 
      <Footer/>
    </div>
  );
}

export default App;
