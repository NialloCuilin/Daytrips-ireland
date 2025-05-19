import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { FaMapMarkerAlt } from 'react-icons/fa';
import dunluce from '../assets/Images/dunluce.jpg';
import galway from '../assets/Images/galway_shopStreet.JPG';
import darkhedges from '../assets/Images/darkhedges.jpeg';
import gortmore from '../assets/Images/gortmore_view2.jpg';
import skellig_micheal from '../assets/Images/skellig_micheal.jpeg';
import secretwaterfall from '../assets/Images/secretwaterfall.jpg';
import cavesofkesh2 from '../assets/Images/caves_kesh2.jpg'
import fivefingerstrand3 from '../assets/Images/five_finger_strand3.jpg';
import rathlin_lighthouse from '../assets/Images/rathlin_light_house.jpg';
import slieveleague3 from '../assets/Images/slieveleague3.jpg';
import castleward from '../assets/Images/castle_ward_maze.jpg';
import tollymore  from '../assets/Images/tollymorre.jpg';
import sperringiant from '../assets/Images/sperrin_giant3.jpg';
import example from '../assets/Images/example_daytrip.jpg';
import example2 from '../assets/Images/example2.jpg';
import example3 from '../assets/Images/example_reviews.jpg';
import cliff_of_moher3 from '../assets/Images/cliffs_of_moher3.jpg';
import dun_aongas from '../assets/Images/dun_aongas.jpg';
import { FaCompass, FaDraftingCompass, FaEdit } from "react-icons/fa";

const heroSlides = [
    { image: rathlin_lighthouse, location: 'Rathlin Island, Co. Antrim' },
    { image: galway, location: 'Shop Street, Co. Galway' }, 
    { image: secretwaterfall, location: 'Secret Waterfall, Co. Donegal' },
    { image: darkhedges, location: 'The Dark Hedges, Co. Antrim' },
    { image: slieveleague3, location: 'Slieve League, Co. Donegal ' },
    { image: castleward, location: 'Castle Wellan, Co. Down' },
    { image: fivefingerstrand3, location: 'Five Finger Strand, Co. Donegal' },
    { image: dunluce, location: 'Dunluce Castle, Co. Antrim' },
    { image: gortmore, location: 'Gortmore View, Co. Derry' },
    { image: cavesofkesh2, location: 'Caves of Kesh, Co. Sligo' },
    { image: skellig_micheal, location: 'Skellig Michael, Co. Cork' },
    { image: tollymore, location: 'Tollymore, Co. Down' },
    { image: sperringiant, location: 'Mullaghcarn, Co. Tyrone' },
    { image: dun_aongas, location: 'Dún Aonghasa, Co. Galway' },

  ];

const benefits = [
   {
    image: cliff_of_moher3,
    title: (
      <span className="flex items-center justify-center gap-2 mb-4">
        <FaCompass className="text-green-900 text-3xl mr-4" />
        Find Hidden Gems at your Doorstep
      </span>
    )
  },
  { image: example2, 
    title:(
      <span className="flex items-center justify-center gap-2 mb-4">
        <FaDraftingCompass className="text-green-900 text-3xl mr-4" />
        Track and share your Adventures
      </span>
    ) },
  { image: example, 
    title:(
      <span className="flex items-center justify-center gap-2 mb-4">
        <FaEdit className="text-green-900 text-3xl mr-4" />
        Create and share your Custom Daytrips
      </span>
    ) },
    { image: example3, 
    title:(
      <span className="flex items-center justify-center gap-2 mb-4">
        <FaEdit className="text-green-900 text-3xl mr-4" />
        Review, save and Export Daytrips!
      </span>
    ) }
];

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="w-full h-screen relative opacity-100 shadow-lg">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.location}
                  className="w-full h-full object-cover"
                />
                {/* Location Stamp */}
                <div className="absolute bottom-20 left-10 bg-black/50 text-white text-xl font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-30">
                  <FaMapMarkerAlt className="text-white" />
                  <span>{slide.location}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <h1
            className="text-white text-4xl md:text-6xl text-center px-4"
            style={{ fontFamily: "Tinos", fontWeight: 200  }}
          >
            Discover Ireland one Daytrip at a time
          </h1>
        </div>
      </div>
      {/* Benefits Section */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <div className="space-y-16">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-6"
            >
              <h2
                className="text-4xl text-green-900"
                style={{ fontFamily: "Tinos", fontWeight: 700 }}
              >
                {item.title}
              </h2>
              <img
                src={item.image}
                alt={item.title}
                className="w-full md:w-2/3 lg:w-1/2 h-auto rounded shadow"
              />
            </div>
          ))}
        </div>
      </section>
      {/* login/reg Section */}
      <section className="bg-white py-12 px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-900"
          style={{ fontFamily: "Tinos", fontWeight: 700 }}
        >
          Ready to Explore?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Login or Register to get started!
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <a
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-white border border-green-600 text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Register
          </a>
        </div>
      </section>

    </div>
  );
}

export default Home;