import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { FiShare2 } from "react-icons/fi";
// Now Navigation ko maine swiper/modules se import toh krliya lekin swiper automatically use nhi kr payega
// isliye hmme usse alg se define krna hoga tb voh navigation ke <> bars dikhai dege...
SwiperCore.use([Navigation]);

export default function Listings() {
    const [listing,setListing] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const params = useParams();
    const {currentUser} = useSelector((state)=> state.user);
    const [contact, setContact] = useState(false);
    const [copied,setCopied] = useState(false);
    console.log(window.location.href);
    useEffect(()=> {
        const fetchLising = async ()=> {
            try {
            setLoading(true);
            const response = await fetch(`/api/listing/get/${params.listingId}`,{
                method : 'GET',
            });
            const data = await response.json();
            if(data.success == false){
                setError(true);
                setLoading(false);
                return;
            }
            setListing(data.data);
            setLoading(false);
            setError(false);
        }catch (error) {
            setError(true);
            setLoading(false);
        };
        }
        
        fetchLising();
    },[params.lisitingId])

    const handleShare = async ()=> {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(()=> setCopied(false),2000);
    };
  return (
    <main>
        {loading && <p className=' text-center my-7 text-2xl'>Loading...</p>}
        {error && (<p className=' text-center my-7 text-2xl'>Something went wrong</p>)} 
        {/*
            * Now agr listing mai data hai and loading is false and error is false then abb show krege puri listings ko in the listings page
        */}
        
        {listing && !loading && !error && (
            // Now sbse phele hmm show krege sari images ko and we need to move another image with slide 
            // so slide krege swiper ko import krege...
            <div>
                
                <Swiper navigation={true}>
                    {listing.imageUrls.map((url)=> (
                        <SwiperSlide key={url}>
                            <div
                                className='h-[550px]'
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            >
                                <div className='flex justify-end p-2 relative'>

                                    <button 
                                        className=' flex items-center gap-1  p-1.5 text-sm rounded-lg bg-slate-300 uppercase hover:opacity-80 shadow-md hover:shadow-lg transition-shadow text-blue-400 '
                                        onClick={handleShare}
                                    >
                                        <FiShare2  size={20}/>
                                        <span>Share</span>
                                    </button>
                                    {copied && (
                                        <div className='absolute top-12 right-3 bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow'>
                                            Link copied !!
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Now abb hmm baki listings ki details ko show krege.... */}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.name} -  ₹{' '}
                        {
                            listing.offer ? 
                            listing.discountedPrice.toLocaleString('en-US') : 
                            listing.regularPrice.toLocaleString('en-US')
                        }
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className='flex items-center mt-2 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className=' text-green-700'/>
                        {listing.address}
                    </p>
                    <div className='flex gap-4'>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                ₹{' '}{(+listing.regularPrice - +listing.discountedPrice).toLocaleString('en-US')} Discount
                            </p>
                        )}
                    </div>
                    <p className=' text-slate-800'>
                        <span className=' font-semibold text-black'>Description - {' '}</span>
                        {listing.description}
                    </p>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-lg'/>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg'/>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg'/>
                            {listing.parking ? 'Parking Spot' : 'No Parking'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg'/>
                            {listing.furnished ? 'Furnished' : 'Unfurnished'}
                        </li>
                    </ul>
                    {/*  */}
                    {currentUser && currentUser.data._id != listing.useRef && !contact && (
                        <button
                            onClick={()=> setContact(true)}
                            className=' bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                        >Contact Owner</button>
                    )}
                    <span className=' mt-5 '>{contact && <Contact listing={listing}/>}</span>
                    

                </div>
            </div>
            
        )}
    </main>
  )
}
