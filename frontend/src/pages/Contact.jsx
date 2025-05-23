import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser'; 
import puffin from '../assets/Images/puffin.jpg'; 
import celticknot from '../assets/Images/celtic-knot.jpg'; 
import { FaUserAlt, FaEnvelope, FaComments } from 'react-icons/fa'; 
import { toast } from 'react-toastify';

const Contact = () => {
  const form = useRef();
  const [emailError, setEmailError] = useState('');
  const sendEmail = (e) => {
    e.preventDefault();

  if (emailError) {
    toast.error("Please fix the email field before submitting.");
    return;
  }

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then((result) => {
      toast.success('Message sent!');
      form.current.reset();
    }).catch((error) => {
      toast.error('Failed to send message.');
      console.error(error.text);
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(valid ? '' : 'Please enter a valid email address.');
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left side: Puffin Image */}
      <div className="w-3/5 h-full">
        <img src={puffin} alt="Scenic view" className="w-full h-full object-cover" />
      </div>
      {/* Right side: Form */}
      <div className="w-2/5 h-full flex items-center justify-center bg-white px-8 py-16" style={{ backgroundImage: `url(${celticknot})` }}>
        <div className="w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6">
            <FaComments className="text-green-700 text-4xl" />
            <h1 className="text-3xl font-bold text-green-700">Contact Us</h1>
          </div>
          <p className="text-center text-gray-600 mb-8">
            Got feedback, a hidden gem to share, or want to collaborate? Drop us a message!
          </p>
          {/*Name Input */}
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
              <label htmlFor="name" className="block font-semibold text-left text-gray-700">Name</label>
              <div className="relative mt-1">
                <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="user_name"
                  id="name"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
            </div>
            {/*Email Input */}
            <div>
              <label htmlFor="email" className="block font-semibold text-left text-gray-700">Email</label>
              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="user_email"
                  id="email"
                  placeholder="you@example.com"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
            </div>
          {/*Mesage Input */}
            <div>
              <label htmlFor="message" className="block font-semibold text-left text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded pl-3 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              ></textarea>
            </div>
            {/*Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;