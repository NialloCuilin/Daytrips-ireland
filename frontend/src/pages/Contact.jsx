import React from 'react';
import gortmore_view from '../assets/Images/gortmore_view.jpg';
import sperrin_giant from '../assets/Images/sperrin_giant2.jpg';

const Contact = () => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat py-16 px-4"style={{ backgroundImage: `url(${sperrin_giant})`}}>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8 text-left">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Got feedback, a hidden gem to share, or want to collaborate? Drop us a message!
        </p>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-semibold text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;