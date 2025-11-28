import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaSave } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { FiShare2 } from "react-icons/fi";

import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore';
import { db } from '../../firebase';
import useGatedAccess from '../utilsFrontend/useGatedAccess.js';

/**
 * Now when we import the files using .jsx then VS CODE is throws an red line error on importing
 * This will happen because VS CODE is basically by default enable for the js based importing rules 
 * And when we importing using .jsx, VS Code tries to validate imports using TypeScript rules even if your project is JS.
 * So this is a reason TypeScript is much better than javaScript because by default even VS-CODE is using the typeScript rules
 * So we need to manually create a jsconfig.js file or we can go eslint.config.js then we will add "importing/extensions" : "off",
 * Now .jsx files is importing....
 */

import GoogleMapComponent from '../components/GoogleMapComponent.jsx';
import LoginModel from '../components/LoginModel.jsx';

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
    const [isSaved,setIsSaved] = useState(false);
    // console.log(window.location.href); // yeah current document ke upr jo url hai unn sbko yeah access krega....

    // login model state for gated access
    const [loginOpen, setLoginOpen] = useState(false);
    const openLoginModel = useCallback(() => {
        setLoginOpen(true);
    }, []);
    const closeLoginModel = useCallback(() => {
        setLoginOpen(false);
    }, []);

    // use the gated access hook (uses backend cookie check + localStorage guest count)
    const {
        isAuthenticated,
        allowedToView,
        guestViewCount,
        requireAuthForAction,
        MAX_FREE_VIEWS,
    } = useGatedAccess(params.listingId, {openLoginModel});

    // button click -> showHide = true, but 
    const [showHide,setShowHide] = useState(false);


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
            }catch(error){
                setError(true);
                setLoading(false);
            };
        };
        
        fetchLising();
    },[params.listingId]) // fixing here a type "params.lisitingId" to this "params.listingId"

    const handleShare = async ()=> {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(()=> setCopied(false),2000);
    };

    useEffect(()=> {
        const checkIfSaved = async ()=> {
            if(!currentUser) return;
            const ref = doc(db, "users", currentUser.data._id, "savedListings", params.listingId);
            const docSnap = await getDoc(ref);
            setIsSaved(docSnap.exists());
        }
        checkIfSaved();

        return () => {};
    },[currentUser, params.listingId]);


    const handleSave = async ()=> {
        // requireAuthForAction will open login modal if guest; it runs the callback only when authenticated
        await requireAuthForAction(async () => {
            const ref = doc(
                db,
                "users",
                currentUser.data._id,
                "savedListings",
                params.listingId
            );
            try {
                if(isSaved){
                    await deleteDoc(ref);
                    setIsSaved(false);
                }else {
                    await setDoc(ref, {
                        listingId : params.listingId,
                        savedAt : new Date().toISOString()
                    });
                    setIsSaved(true);
                }
            } catch (error) {
                console.log("Error save listings", error);
            }
        });
    };

    // protecting contact owner as well
    const handleContactClick = async () => {
        await requireAuthForAction(()=> {
            setContact(true);
        });
    };
    
    // wait until auth check is completes (isAuthenticated === null while checking)
    if(isAuthenticated === null){
        return <p className=' text-center my-7 text-2xl'>Loading...</p>
    }

    // If guest exceeded free views, show message and modal (hook already opens modal)
    if(isAuthenticated !== null && !isAuthenticated && !allowedToView){
    return (
        <div className="w-full h-[80vh] flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-2xl font-semibold mb-2">
                Please sign in to continue
            </h2>

            <p className="text-gray-700 mb-6 max-w-md">
                You have viewed {guestViewCount} free listing
                {guestViewCount > 1 ? "s" : ""}.  
                Sign in to continue viewing more listings.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/signIn"
                    className="px-5 py-2 bg-slate-700 text-white font-medium rounded-md hover:opacity-85"
                >
                    Sign In
                </Link>

                <button
                    onClick={() => window.location.href = "/"}
                    className="px-5 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}


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
                                    <div className='flex flex-row-reverse gap-3'>
                                        {/* Now this is the button of share , in which user can share the listing by copy the link of listings.... */}
                                        <div className='flex justify-end p-2 '>
                                            <button 
                                                className=' flex items-center gap-1  p-1.5 text-sm rounded-lg bg-slate-300 uppercase hover:opacity-80 shadow-md hover:shadow-lg transition-shadow text-slate-700 '
                                                onClick={handleShare}
                                            >
                                                <FiShare2  size={20}/>
                                                <span className=' font-semibold'>Share</span>
                                            </button>
                                            {copied && (
                                                <div className='absolute top-12 right-3 bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow'>
                                                    Link copied !!
                                                </div>
                                            )}
                                        </div>

                                        {/* Here we have a save button.... */}
                                        <div className=' py-2'>
                                            
                                            <button 
                                                className='flex items-center gap-1  p-1.5 text-sm rounded-lg bg-slate-300 uppercase hover:opacity-80 shadow-md hover:shadow-lg transition-shadow text-slate-700'
                                                onClick={handleSave}
                                            >
                                                <FaSave size={20}/>
                                                <span className=' font-semibold'>{isSaved ? "Saved" : "Save"}</span>
                                            </button>
                                        </div>
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
                        <button onClick={()=> setShowHide(prev => !prev)}>
                            <span 
                            className=' block mx-auto mt-4 px-5 py-2.5 bg-slate-700 text-white font-semibold text-sm rounded-lg shadow-md hover:opacity-95 hover:shadow-lg active:scale-95 transition-all duration-200'>{showHide ? "Hide Map" : "Show Map"}</span>
                            {showHide ? <GoogleMapComponent  address={listing.address} requireAuthForAction={requireAuthForAction}/> : ""}
                            
                        </button>
                        

                        {/*  */}
                        {currentUser && currentUser.data._id != listing.useRef && !contact && (
                            <button
                                onClick={()=> setContact(true)}
                                className=' bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 hover:shadow-lg active:scale-95 transition-all duration-200 p-3 font-semibold'
                            >Contact Owner</button>
                        )}
                        <span className=' mt-5 '>{contact && <Contact listing={listing}/>}</span>
                        

                    </div>
                </div>
                
            )}
            <LoginModel open={loginOpen} onClose={closeLoginModel} />
        </main>
    )
}
