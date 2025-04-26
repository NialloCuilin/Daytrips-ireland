import React from 'react';
import { FaMapMarkedAlt, FaCompass, FaUsers } from 'react-icons/fa';
import thistle_of_moher from '../assets/Images/thistle_of_moher.jpg';
import see_ireland_first from '../assets/Images/see_ireland_first.jpg';
import binocs_me from '../assets/Images/binocs_me.jpg';

const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header / Hero */}
      <section className="relative w-full h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${thistle_of_moher})` }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center text-left text-white px-8 md:px-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About Us
          </h1>
          <p className="max-w-2xl text-lg">
            Discover hidden gems across Ireland, plan spontaneous adventures, and share your love for the island — one daytrip at a time.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center"> 
        {/* Image Section */}
        <div className="flex justify-left">
          <img
            src={see_ireland_first}
            alt="See Ireland First Poster"
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
      {/* Text Section */}
        <div> 
          <h2 className="text-3xl font-bold mb-4 text-left">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-left">
            Here at DayTrips Ireland, we believe in transforming at-home attitudes toward local tourism, encouraging the exploration of our beautiful island.
            Whether you love a wee walk and a coffee, scenic hikes, ancient castles brimming with history, or stone circles full of folklore and magic — DayTrips Ireland has a trip for you.
            Make an adventure out of a free Sunday afternoon, or plan a full week of exploration during your next holiday.
            Share your adventures with friends, find inspiration from fellow travelers, connect with like-minded explorers, and earn badges to celebrate your journey across Ireland!
          </p>
        </div>
      </section>    

      {/* What We Offer */}
      <section className="bg-yellow-100 py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <FaMapMarkedAlt className="text-green-700 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Tailored Adventures</h3>
            <p>Use filters to find trips by activity, distance, and location — no stress required.</p>
          </div>
          <div>
            <FaCompass className="text-green-700 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Track & Share</h3>
            <p>Save your trips, earn badges, and explore what others are doing around the island.</p>
          </div>
          <div>
            <FaUsers className="text-green-700 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Built for Locals</h3>
            <p>We’re proudly Irish-made, focusing on what’s doable in a day — not for tourists, for you.</p>
          </div>
        </div>
      </section>

      {/* Who I Am */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center"> 
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={binocs_me}
            alt="Niall James Cullen"
            className="rounded-full shadow-lg object-cover w-64 h-64 " // 👈 changes here
          />
        </div>
  
        {/* Text Section */}
        <div> 
          <h1 className="text-5xl font-bold mb-2 text-left">Niall Cullen</h1>
          <h2 className="text-2xl font-semibold mb-1 text-left">Computer Science Student at University of Ulster</h2>
          <p className="text-gray-700 leading-relaxed text-left">
            Passionate about building user-centered digital experiences, blending creativity with technology.
            I love exploring Ireland's landscapes just as much as I enjoy exploring new ideas in software development!
          </p>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="mb-6 text-gray-700">Have feedback, want to collaborate, or just say hello?</p>
        <a
          href="/contact"
          className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800 transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;