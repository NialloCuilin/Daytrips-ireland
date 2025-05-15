import { FaMapMarkedAlt, FaCompass, FaUsers } from 'react-icons/fa';
import thistle_of_moher from '../assets/Images/thistle_of_moher.jpg';
import see_ireland_first from '../assets/Images/see_ireland_first.jpg';
import binocs_me from '../assets/Images/binocs_me.jpg';
import { FaMountain} from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: "Tinos", fontWeight: 100 }}>
      {/* Hero */}
      <section className="relative w-full h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${thistle_of_moher})` }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center text-left text-white px-8 md:px-20">
          <div>
            <h1 className="text-4xl md: text-6xl font-extrabold mb-4">
            About Us
          </h1>
          </div>
          <p className="max-w-2xl text-2xl">
            Discover hidden gems across Ireland, plan spontaneous <br />adventures, and share your love for the island <br />— one daytrip at a time.
          </p>
        </div>
      </section>
      {/* Our Mission */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div className="flex justify-start">
          <img
            src={see_ireland_first}
            alt="See Ireland First Poster"
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
        {/* Text Block */}
        <div>
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-2 text-left" >
            <FaMountain />
            Our Mission
          </h2>
          <p className="text-gray-700 text-2xl leading-relaxed text-left">
            Here at DayTrips Ireland, we believe in transforming at-home attitudes toward local tourism,
            encouraging the exploration of our beautiful island. Whether you love a wee walk and a coffee,
            scenic hikes, ancient castles brimming with history, or stone circles full of folklore and magic —
            DayTrips Ireland has a trip for you. Make an adventure out of a free Sunday afternoon, or plan
            a full week of exploration during your next holiday. Share your adventures with friends, find
            inspiration from fellow travelers and connect with like-minded explorers!
          </p>
        </div>
      </section>
      {/* What We Offer */}
      <section className="bg-yellow-50 py-12 px-6  shadow-lg">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <FaMapMarkedAlt className="text-green-700 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-2xl mb-2">Tailored Adventures</h3>
            <p>Use filters to find trips by activity, distance, and location — no stress required.</p>
          </div>
          <div>
            <FaCompass className="text-green-700 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-2xl mb-2">Track & Share</h3>
            <p>Save your trips and explore what others are doing around the island.</p>
          </div>
          <div>
            <FaUsers className="text-green-700 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-2xl mb-2">Built for Locals</h3>
            <p>Support Local Businesses and our local tourism sectors!</p>
          </div>
        </div>
      </section>
      {/* Who I Am */}
      <section className="max-w-6xl mb-10 mt-10 mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center"> 
        <div className="flex justify-center">
          <img
            src={binocs_me}
            alt="Niall James Cullen"
            className="rounded-full shadow-lg object-cover w-64 h-64 "
          />
        </div>
        {/* Text Section */}
        <div> 
          <h1 className="text-5xl font-bold mb-2 text-left">Niall Cullen</h1>
          <h2 className="text-2xl font-semibold text-blue-900 mb-1 italic text-left">
            Computer Science Student at University of Ulster</h2>
          <p className="text-gray-700 leading-relaxed text-left text-lg">
           "I am a final year student at Ulster, I have a deep love for our beautiful island and all it has to offer.
           I wanted to turn my passion for travel and exploration into a project that could help others connect and 
           explore their locality, while supporting the local businesses all around us."
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;