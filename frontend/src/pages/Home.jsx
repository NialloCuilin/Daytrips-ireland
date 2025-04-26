import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { FaMapMarkerAlt } from 'react-icons/fa';
import cliffs_of_moher from '../assets/Images/cliffs_of_moher.jpeg';
import dunluce from '../assets/Images/dunluce.jpg';
import stock1 from '../assets/Images/stock1.jpeg';
import darkhedges from '../assets/Images/darkhedges.jpeg';
import stock2 from '../assets/Images/stock2.jpeg';
import skellig_micheal from '../assets/Images/skellig_micheal.jpeg';
import secretwaterfall from '../assets/Images/secretwaterfall.jpg';
import cavesofkesh2 from '../assets/Images/caves_kesh2.jpg'
import clonmanyWaterfall from '../assets/Images/clonmany_waterfall2.jpg';
import fivefingerstrand3 from '../assets/Images/five_finger_strand3.jpg';
import cliffs_of_moher3 from '../assets/Images/cliffs_of_moher3.jpg';
import banagher from '../assets/Images/Banagher.jpg';
import slieveleague3 from '../assets/Images/slieveleague3.jpg';
import rathlin2 from '../assets/Images/rathlin2.jpg';
import inch from '../assets/Images/inch.jpg';

const heroSlides = [
    { image: cliffs_of_moher3, location: 'Cliffs of Moher, Co. Clare' },
    { image: stock1, location: 'Mystic Forest' },
    { image: secretwaterfall, location: 'Secret Waterfall, Co. Donegal' },
    { image: slieveleague3, location: 'Slieve League, Co. Donegal ' },
    { image: fivefingerstrand3, location: 'Five Finger Strand, Co. Donegal' },
    { image: dunluce, location: 'Dunluce Castle, Co. Antrim' },
    { image: darkhedges, location: 'The Dark Hedges, Co. Antrim' },
    { image: stock2, location: 'Misty Mountains' },
    { image: cavesofkesh2, location: 'Caves of Kesh, Co. Sligo' },
    { image: skellig_micheal, location: 'Skellig Michael, Co. Cork' },
  ];

const benefits = [
  { image: rathlin2, title: 'Find Hidden Gems at your Doorstep' },
  { image: banagher, title: 'Track and share your Adventures' },
  { image: inch, title: 'Create and share your Custom Daytrips' },
];

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="w-full h-screen relative opacity-100">
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
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
            Discover Ireland one Daytrip at a time
          </h1>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-12 px-6 md:px-20 bg-gray-100">
        <div className="space-y-12">
            {benefits.map((item, index) => (
            <div
                key={index}
                className={`flex flex-col md:flex-row items-center md:justify-between gap-6 ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                }`}
            >
                <img
                src={item.image}
                alt={item.title}
                className="w-full md:w-1/2 h-64 object-cover rounded shadow"
                />
                <div className="text-xl font-semibold text-center md:text-left w-full md:w-1/2">
                {item.title}
                </div>
            </div>
            ))}
        </div>
        </section>
    </div>
  );
}

export default Home;
