import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  const [offerListings,setOfferListings] = useState([]);
  const [rentListings,setRentListings] = useState([]);
  const [saleListings,setSaleListings] = useState([]);
  console.log("offer :",offerListings);
  console.log("rent :",rentListings);
  console.log("sale :",saleListings);

  useEffect(()=> {
    const fetchOfferListings = async ()=> {
      try {
        const response = await fetch(`/api/listing/get?offer=true&limit=4`,{
          method : 'GET'
        })
        const data = await response.json();
        setOfferListings(data.data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async ()=> {
      try {
        const response = await fetch(`/api/listing/get?type=rent&limit=4`,{
          method : 'GET'
        });
        const data = await response.json();
        setRentListings(data.data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async ()=> {
      try {
        const response = await fetch(`/api/listing/get?type=sale&limit=4`,{
          method : 'GET'
        });
        const data = await response.json();
        setSaleListings(data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();

  },[]);
  return (
    <div>

      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className=' text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className=' text-slate-500 hover:opacity-95'>Perfect</span>
          <br />
          place with ease....
        </h1>
        <div className=' text-gray-400 text-xs sm:text-sm font-extralight'>
          <span className=' text-slate-700 font-semibold'>Buisness Hub</span> is the best place to find your perfect place to live in your local area.
          <br />
          We have a wide range of properties for you to choose from for rent and sale.
        </div>
        <Link 
          to={`/search`}
          className=' text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings && 
          offerListings.length > 0 &&
          offerListings.map((listing)=> (
            <SwiperSlide>
              <div
                style={{
                  background :  `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize : 'cover',
                }}
                className='h-[550px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      {/* showing 4 of each type of listings of offer, rent and sale */}
      <div className=' mt-4'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className=' my-3 ml-10'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline ' to={`/search?offer=true`}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-6 ml-10'>
              {offerListings.map((listing)=>(
                <ListingItem listings={listing} key={listing._id}/>
              ))}
            </div>
          </div>
          
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className=' my-7 ml-10 '>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rents</h2>
              <Link className='text-sm text-blue-800 hover:underline ' to={`/search?type=rent`}>Show more places for Rents</Link>
            </div>
            <div className='flex flex-wrap gap-6 ml-10'>
              {rentListings.map((listing)=>(
                <ListingItem listings={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className=' my-7 ml-10 '>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sales -</h2>
              <Link className='text-sm text-blue-800 hover:underline ' to={`/search?type=sale`}>Show more places for Sales</Link>
            </div>
            <div className='flex flex-wrap gap-6 ml-10'>
              {saleListings.map((listing)=>(
                <ListingItem listings={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="mt-16 bg-slate-100 py-12 px-6 rounded-2xl shadow-inner">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Connect With Me
        </h2>

        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-slate-600">
            Have questions or want to collaborate? Feel free to reach out!
          </p>

        
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-slate-700 text-base">
            <p>
              📧 <span className="font-semibold">Email:</span>{" "}
              <Link href="mailto:sanibaisoya001@gmail.com" className="text-blue-600 hover:underline">
                sanibaisoya001@gmail.com
              </Link>
            </p>
            <p>
              📞 <span className="font-semibold">Phone:</span>{" "}
              <Link href="tel:+918377886895" className="text-blue-600 hover:underline">
                +91 83778 86895
              </Link>
            </p>
          </div>

            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mt-4 text-2xl text-slate-700">
              <Link
                to={`https://www.linkedin.com/in/saniket13/`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700"
              >
                <i className="fab fa-linkedin"></i>
              </Link>
              <Link
                to={`https://github.com/Saniketbaisoya`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                <i className="fab fa-github"></i>
              </Link>
              <Link
                to={`https://www.instagram.com/saniket_baisoya/`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600"
              >
                <i className="fab fa-instagram"></i>
              </Link>
            </div>
        </div>
      </div>

    </div>
  );
};
