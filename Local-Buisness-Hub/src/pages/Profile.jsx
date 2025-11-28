// import { useState, useRef, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useNavigate } from 'react-router-dom'
// import { app } from '../../firebase.js'
// import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'

// // --- UPDATED UI APPLIED BELOW ---
// export default function Profile() {
//   const {currentUser, loading, error} = useSelector((state) => state.user);
//   const fileRef = useRef(null);
//   const [formData,setFormData] = useState({});
//   const dispatch = useDispatch();
//   const [update,setUpdate] = useState(false);
//   const [signOut,setSignOut] = useState(false);
//   const navigate = useNavigate();
//   const [file,setFile] = useState(undefined);
//   const [filePer,setFilePer] = useState(0);
//   const [fileUploadError,setFileUploadError] = useState(false);
//   const [showListingErrors,setshowListingErrors] = useState(null);
//   const [userListings, setuserListings] = useState(null);

//   useEffect(()=>{
//     if(file){
//       handleFileUpload(file);
//     }
//   },[file]);

//   const handleFileUpload = (file) => {
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + file.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setFilePer(Math.round(progress));
//       },
//       (error) => {
//         setFileUploadError(true);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//           setFormData({ ...formData, avatar: downloadURL })
//         );
//       }
//     );
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value
//     })
//   };

//   useEffect(()=>{
//     if(update){
//       const timer = setTimeout(() => setUpdate(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   },[update]);

//   useEffect(()=>{
//     if(signOut){
//       const timer = setTimeout(() => setSignOut(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   },[signOut]);

//   const handleSubmit = async (e)=>{
//     e.preventDefault();
//     try {
//       setUpdate(true);
//       // dispatch update start
//       const res = await fetch(`/api/user/update/${currentUser.data._id}`,{
//         method : 'PATCH',
//         headers : { "Content-Type" : "application/json" },
//         body : JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if(data.success === false){
//         // dispatch failure
//         return;
//       }
//       // dispatch success
//     }catch (error) {
//       // dispatch failure
//     }
//   };

//   const onDeleteHandle = async ()=>{
//     try {
//       // dispatch deleteStart
//       const res = await fetch(`/api/user/delete/${currentUser.data._id}`,{ method : "DELETE" });
//       const data = await res.json();
//       if(data.success==false){ return; }
//       // dispatch delete success
//     } catch (error) {}
//   }

//   const handleSignOut = async () => {
//     try {
//       setSignOut(true);
//       // dispatch signout start
//       const res = await fetch('/api/signout');
//       const data = await res.json();
//       if(data.success === false){
//         // dispatch fail
//         return;
//       }
//       // dispatch signout success
//     } catch (error) {}
//   }

//   const handleShowListings = async (e)=> {
//     e.preventDefault();
//     try {
//       const response = await fetch(`/api/user/listings/${currentUser.data._id}`,{ method : 'GET', headers : { 'Content-Type' : 'application/json' } });
//       const data = await response.json();
//       if(data.success==false){ setshowListingErrors(data.message); }
//       setuserListings(data.data);
//     }catch (error) { setshowListingErrors(error.message); }
//   }

//   const handleRemoveList = async (listingId)=> {
//     try {
//       const response = await fetch(`/api/listing/delete/${listingId}`,{ method : 'DELETE' });
//       const data = await response.json();
//       if(data.success === false){ return; }
//       setuserListings((prev)=> prev.filter((listing)=> listing._id !== listingId));
//     }catch (error) {}
//   };

//   return (
//     <div // UPDATED: Tailwind color & UI adjustments applied below (slate‑based theme)
// className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* header */}
//         <div className="flex flex-col items-center text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">Your Profile</h1>
//           <p className="mt-2 text-sm text-gray-500">Manage your account, listings and preferences</p>
//         </div>

//         {/* card */}
//         <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col md:flex-row md:items-center md:gap-8">
//               {/* avatar & quick actions */}
//               <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-1/3">
//                 <div
//                   onClick={()=> fileRef.current.click()}
//                   className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer ring-2 ring-offset-2 ring-slate-100 shadow-md"
//                 >
//                   <img
//                     src={formData?.avatar || currentUser?.data?.avatar}
//                     alt="avatar"
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-0 right-0 bg-white/90 p-1 rounded-full shadow-sm">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3l-4 4m0 0L8 3m4 4V1" />
//                     </svg>
//                   </div>
//                 </div>

//                 <input ref={fileRef} type="file" accept="image/*" onChange={(e)=> setFile(e.target.files[0])} className="hidden" />

//                 <div className="mt-4 text-center md:text-left">
//                   <p className="text-lg font-semibold text-slate-800">{currentUser?.data?.userName}</p>
//                   <p className="text-sm text-gray-500">{currentUser?.data?.email}</p>
//                 </div>

//                 <div className="mt-4 flex gap-3">
//                   <button onClick={handleSignOut} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-md text-sm font-semibold hover:bg-red-100">Sign Out</button>
//                   <button onClick={onDeleteHandle} className="px-3 py-1.5 bg-white text-red-600 border border-red-100 rounded-md text-sm font-semibold hover:bg-red-50">Delete</button>
//                 </div>
//               </div>

//               {/* form */}
//               <div className="mt-6 md:mt-0 w-full md:w-2/3">
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//                   <div>
//                     <label className="sr-only">Username</label>
//                     <input id="userName" defaultValue={currentUser?.data?.userName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-slate-300 outline-none" placeholder="Username" />
//                   </div>
//                   <div>
//                     <label className="sr-only">Email</label>
//                     <input id="email" defaultValue={currentUser?.data?.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-slate-300 outline-none" placeholder="Email" />
//                   </div>
//                   <div>
//                     <label className="sr-only">Password</label>
//                     <input id="password" type="password" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-slate-300 outline-none" placeholder="New password (optional)" />
//                   </div>

//                   <div className="flex gap-3 mt-1">
//                     <button type="submit" disabled={loading} className="flex-1 bg-slate-800 text-white py-3 rounded-lg font-semibold hover:opacity-95 transition">{loading ? 'Updating...' : 'Update Profile'}</button>
//                     <Link to={'/createlist'} className="flex-1 inline-flex items-center justify-center border border-green-600 bg-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-95">Create Listing</Link>
//                   </div>

//                   {/* upload progress */}
//                   {filePer > 0 && filePer < 100 && (
//                     <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//                       <div className="h-2 bg-green-500" style={{ width: `${filePer}%` }} />
//                     </div>
//                   )}

//                   {fileUploadError && <p className="text-sm text-red-600">Image Upload Error (max 2MB)</p>}

//                 </form>
//               </div>
//             </div>

//             {/* success / signout banners */}
//             <div className="mt-6">
//               {signOut && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-md">Logout successful</div>}
//               {update && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-md mt-2">Profile updated successfully</div>}
//               {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
//             </div>

//           </div>

//           {/* user listings block */}
//           <div className="border-t border-gray-100 p-6 bg-gray-50">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-slate-800">Your Listings</h3>
//               <div className="flex gap-3">
//                 <button onClick={handleShowListings} className="text-sm text-green-700 font-semibold hover:underline">Show Listings</button>
//                 <Link to={'/saved'} className="text-sm text-green-700 font-semibold hover:underline">Saved</Link>
//               </div>
//             </div>

//             {userListings && userListings.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {userListings.map((l) => (
//                   <div key={l._id} className="w-full bg-white rounded-lg border border-gray-100 p-4 flex items-start gap-4 overflow-hidden" /* UPDATED: full-width card, items-start, overflow-hidden */>
//                     <Link to={`/listing/${l._id}`} className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
//                       <img src={l.imageUrls[0]} alt="cover" className="w-full h-full object-cover" />
//                     </Link>
//                     <div className="flex-1">
//                       <Link to={`/listing/${l._id}`} className="text-slate-800 font-semibold hover:underline block truncate max-w-[40ch]">{l.name}</Link>
//                       <p className="text-sm text-slate-500 mt-1">{l.type === 'rent' ? `Rent • ₹${l.regularPrice}` : `Sale • ₹${l.regularPrice}`}</p>
//                     </div>
//                     <div className="flex flex-col gap-2">
//                       <button onClick={()=> handleRemoveList(l._id)} className="text-sm text-red-600 hover:underline">Delete</button>
//                       <Link to={`/update-list/${l._id}`} className="text-sm text-green-700 hover:underline">Edit</Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-sm text-gray-500">No listings found. Create your first listing to show up here.</div>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   )
// // --- END OF UPDATED UI ---
// }


// OLD PROFILE PAGE UI //
// import { useState } from 'react'
// import { useRef } from 'react';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
// import { deleteInFailure, deleteInStart, deleteInSuccess, signOutFailure, signOutStart, signOutSuccess, updateInFailure, updateInStart, updateInSuccess } from '../redux/users/slice.js';
// import { data, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { app } from '../../firebase.js';
// import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'

// export default function Profile() {
//   const {currentUser, loading, error} = useSelector((state) => state.user);
//   const fileRef = useRef(null);
//   const [formData,setFormData] = useState({});
//   const dispatch = useDispatch();
//   const [update,setUpdate] = useState(false);
//   const [signOut,setSignOut] = useState(false);
//   const navigate = useNavigate();
//   const [file,setFile] = useState(undefined);
//   const [filePer,setFilePer] = useState(0);
//   const [fileUploadError,setFileUploadError] = useState(false);
//   const [showListingErrors,setshowListingErrors] = useState(null);
//   const [userListings, setuserListings] = useState(null);

//   useEffect(()=>{
//     if(file){
//       handleFileUpload(file);
//     }
//   },[file]);

//   const handleFileUpload = (file) => {
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + file.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log(progress);
//         setFilePer(Math.round(progress));
//       },
//       (error) => {
//         setFileUploadError(true);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//           setFormData({ ...formData, avatar: downloadURL })
//         );
//       }
//     );
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value
//     })
//   };
//   useEffect(()=>{
//     if(update){
//       const timer = setTimeout(() => {
//         setUpdate(false);
//       }, 3000); // disappears after 3 seconds
//       return () => clearTimeout(timer);
//     }
//   },[update]);

//   useEffect(()=>{
//     if(signOut){
//       const timer = setTimeout(() => {
//         setSignOut(false);
//       }, 3000); // disappears after 3 seconds
//       return () => clearTimeout(timer);
//     }
//   },[signOut]);


//   const handleSubmit = async (e)=>{
//     e.preventDefault();
//     try {
//       setUpdate(true);
//       dispatch(updateInStart());
//       const res = await fetch(`/api/user/update/${currentUser.data._id}`,{
//         method : 'PATCH',
//         headers : {
//           "Content-Type" : "application/json",
//         },
//         body : JSON.stringify(formData),
//       });
//       const data = await res.json();
      
//       if(data.success === false){
//         dispatch(updateInFailure(data.message));
//         return;
//       }
//       dispatch(updateInSuccess(data));
//     }catch (error) {
//       dispatch(updateInFailure(error.message));
//     }
//   };

//   const onDeleteHandle = async ()=>{
//     try {
//       dispatch(deleteInStart());
//       const res = await fetch(`/api/user/delete/${currentUser.data._id}`,{
//         method : "DELETE"
//       });
//       const data = await res.json();
//       if(data.success==false){
//         dispatch(deleteInFailure(data.message));
//         return;
//       }
//       dispatch(deleteInSuccess());
//     } catch (error) {
//       dispatch(deleteInFailure(error.message));
//     }
//   }

//   const handleSignOut = async () => {
//     try {
//       setSignOut(true);
//       dispatch(signOutStart());
//       const res = await fetch('/api/signout');
//       const data = await res.json();
//       console.log(data);
//       if(data.success === false){
//         dispatch(signOutFailure(data.message));
//         return;
//       }
//       dispatch(signOutSuccess(data));
      
//     } catch (error) {
//       console.log(error);
//       dispatch(signOutFailure(data.message));
//     }
//   }

//   const handleShowListings = async (e)=> {
//     e.preventDefault();
//     try {
//       const response = await fetch(`/api/user/listings/${currentUser.data._id}`,{
//         method : 'GET',
//         headers : {
//           'Content-Type' : 'application/json'
//         },
//       });
//       const data = await response.json();
//       if(data.success==false){
//         setshowListingErrors(data.message);
//       }
//       console.log(data.data);
//       setuserListings(data.data);
//     }catch (error) {
//       setshowListingErrors(error.message);
//     }
//   }

//   const handleRemoveList = async (listingId)=> {
//     try {
//       const response = await fetch(`/api/listing/delete/${listingId}`,{
//         method : 'DELETE',
//       });
//       const data = await response.json();
//       if(data.success === false){
//         console.log(data.message);
//         return;
//       }
//       setuserListings((prev)=> prev.filter((listing)=> listing._id !== listingId));
//     }catch (error) {
//       console.log(error.message);
//     }
//   };
//   // firebase storage rules apply kiye gye hain....
//   // allow read;
//   // allow write : if 
//   // request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*')
//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl font-semibold text-center my-7'>
//         Profile
//       </h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4 font-semibold'>
//         <input 
//           onChange={(e)=> setFile(e.target.files[0]) } 
//           type='file' 
//           ref={fileRef} 
//           hidden
//           accept='image/*'
//         />
//         <img 
//           onClick={()=> fileRef.current.click()}
//           className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
//           src={ formData?.avatar || currentUser.data.avatar } 
//           alt='profile'
//         />
//         {/* Now abb yha pr filePer ko show krege */}
//         <p className=' font-semibold self-center'>
//           {fileUploadError ? (
//           <span className='text-red-700'>Image Upload Error(image must be less than 2 mb)</span>
//           ) : filePer > 0 && filePer < 100 ? (
//             <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>
//           ) : filePer === 100 ? (
//             <span className=' text-green-700'>Image successfully uploaded!!</span>
//           ) : (
//             ''
//           )}
//         </p>
//         <input 
//           onChange={handleChange}
//           type='text' 
//           id='userName'  
//           placeholder='username' 
//           className=' text-slate-500 bg-transparent focus:outline-slate-700  focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
//           defaultValue={currentUser.data.userName}
//           />
//         <input 
//           onChange={handleChange}
//           type='email' 
//           id='email'  
//           placeholder='email' 
//           className=' text-slate-500 bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
//           defaultValue={currentUser.data.email}
//         />
//         <input
//           onChange={handleChange}
//           type='password' 
//           id='password'  
//           placeholder='password' 
//           className=' bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
//         />
//         <button type='submit' disabled={loading} className='uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-95'>
//           {loading ? 'Loading...' : 'Update'}
//         </button>
//         <Link 
//           to={'/createlist'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-9'>
//           Create Listing
//         </Link>
//       </form>
//       <div className='flex justify-between'>
//         <span onClick={onDeleteHandle} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-3.5'>Delete Account</span>
//         <span onClick={handleSignOut} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-3.5'>Sign Out</span>
//       </div>
//       <p className='text-red-700  border-red-200 mt-5'>{error ? error : ''}</p>

//       <p className={`${signOut ?  "bg-green-50 border border-green-400 text-green-700 uppercase text-center px-5 py-3 rounded-xl shadow-md text-base font-semibold " : ""}`}> 
//         {signOut ? "Logout successFully !!" : ""}
//       </p>

//       <p className={`${update ? "bg-green-50 border border-green-400 text-green-700 uppercase text-center px-5 py-3 rounded-xl shadow-md text-base font-semibold ": ""}`}>
//         {update ? "SuccessFully Updated the data" : ""}
//       </p>

//       {/* Now abb yha se hmm voh sari lists ko list krege jo login user ke through bnai gyi hai....*/}
//         <div className='flex justify-between mt-5'>
//           <button
//           onClick={handleShowListings}
//           className='text-green-700 font-semibold hover:underline'
//         >
//           Show Listings
//         </button>
//         <Link 
//           to={`/saved`}
//           className='text-green-700 font-semibold hover:underline py-2'   
//         >
//           <button className=' hover:underline '>Saved Listings</button>
//         </Link>
//         </div>
//       {userListings && userListings.length > 0 && (
//         <div className='flex flex-col gap-4'>
//           <h1 className=' text-2xl text-center mt-7  font-semibold'>Your Listings</h1>

//           {userListings.map((listings)=> (
//             <div 
//               key={listings._id}
//               className='border rounded-lg p-3 flex justify-between items-center gap-4'
//             >
//               <Link to={`/listing/${listings._id}`}>
//                 <img 
//                   src={listings.imageUrls[0]} 
//                   alt='listing-cover'
//                   className="w-20 h-20  object-cover  border border-gray-200 hover:scale-105 transition-transform duration-300"
//                 />
//               </Link>
//               <Link 
//                 className='text-slate-700 font-semibold  hover:underline truncate flex-1'
//                 to={`/listing/${listings._id}`}
//               >
//                 <p >{listings.name}</p>
//               </Link>

//               <div className='flex flex-col item-center'>
//                 <button
//                   className='text-red-700 uppercase hover:opacity-75 hover:underline'
//                   onClick={()=> handleRemoveList(listings._id)}
//                 >
//                 Delete
//                 </button>
//                 <Link to={`/update-list/${listings._id}`}>
//                   <button className='text-green-700 uppercase hover:opacity-75 hover:underline'>Edit</button>
//                 </Link>
//               </div>
//             </div>
//           ))}

//         </div>
        
//       )}
//     </div>
    
//   )
// }

import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { app } from '../../firebase.js'
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import { deleteInFailure, deleteInStart, deleteInSuccess, signOutFailure, signOutStart, signOutSuccess, updateInFailure, updateInStart, updateInSuccess } from '../redux/users/slice.js'

// --- UPDATED UI APPLIED BELOW ---
export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch();
  const [update,setUpdate] = useState(false);
  const [signOut,setSignOut] = useState(false);
  const navigate = useNavigate();
  const [file,setFile] = useState(undefined);
  const [filePer,setFilePer] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [showListingErrors,setshowListingErrors] = useState(null);
  const [userListings, setuserListings] = useState(null);

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  };

  useEffect(()=>{
    if(update){
      const timer = setTimeout(() => setUpdate(false), 3000);
      return () => clearTimeout(timer);
    }
  },[update]);

  useEffect(()=>{
    if(signOut){
      const timer = setTimeout(() => setSignOut(false), 3000);
      return () => clearTimeout(timer);
    }
  },[signOut]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setUpdate(true);
      dispatch(updateInStart());
      const res = await fetch(`/api/user/update/${currentUser.data._id}`,{
        method : 'PATCH',
        headers : { 
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateInFailure(data.message));
        return;
      }
      dispatch(updateInSuccess(data));

    }catch (error) {
      dispatch(updateInFailure(data.message));
    }
  };

  const onDeleteHandle = async ()=>{
    try {
      dispatch(deleteInStart());
      const res = await fetch(`/api/user/delete/${currentUser.data._id}`,{ 
        method : "DELETE",
      });
      const data = await res.json();
      if(data.success==false){
        dispatch(deleteInFailure(data.message));
        return; 
      }
      dispatch(deleteInSuccess());
    } catch (error) {
      dispatch(deleteInFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      setSignOut(true);
      dispatch(signOutStart());
      // dispatch signout start
      const res = await fetch('/api/signout');
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(signOutFailure(error.message));
    }
  }

  const handleShowListings = async (e)=> {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user/listings/${currentUser.data._id}`,{ 
        method : 'GET',
        headers : { 
          'Content-Type' : 'application/json' 
        },
      });
      const data = await response.json();
      if(data.success==false){ 
        setshowListingErrors(data.message); 
      }
      setuserListings(data.data);
    }catch (error) { 
      setshowListingErrors(error.message); 
    }
  }

  const handleRemoveList = async (listingId)=> {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`,{ 
        method : 'DELETE',
      });
      const data = await response.json();
      if(data.success === false){
        console.log(data.message);
        return; 
      }
      setuserListings((prev)=> prev.filter((listing)=> listing._id !== listingId));
    }catch (error) {
      console.log(error.message);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"> {/* UPDATED: page padding & bg */}
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Your Profile</h1> {/* UPDATED */}
        <p className="mt-2 text-sm text-slate-500">Manage your account, listings and preferences</p> {/* UPDATED */}
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden"> {/* UPDATED: card look */}
        <div className="p-6 md:p-8">
          {/* FORM: keep same form node as you had (avatar + inputs inside form) */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"> {/* UPDATED: make grid layout but same element order */}
            <input 
              onChange={(e)=> setFile(e.target.files[0]) } 
              type='file' 
              ref={fileRef} 
              hidden
              accept='image/*'
            />

            {/* Avatar - stays inside form (order preserved) */}
            <img 
              onClick={()=> fileRef.current.click()}
              className="rounded-full h-28 w-28 object-cover cursor-pointer self-center md:self-start justify-self-center md:justify-self-start ring-4 ring-slate-50 shadow-lg order-1 md:order-1"  /* UPDATED: larger avatar with ring + shadow; placed left on md screens */
              src={ formData?.avatar || currentUser.data.avatar } 
              alt='profile'
            />

            {/* Upload status (keeps near avatar) */}
            <p className="font-medium self-center text-sm text-slate-600 order-2 md:order-2"> {/* UPDATED */}
              {fileUploadError ? (
                <span className='text-red-700'>Image Upload Error (image must be less than 2 MB)</span>
              ) : filePer > 0 && filePer < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>
              ) : filePer === 100 ? (
                <span className='text-emerald-700'>Image uploaded successfully!</span>
              ) : (
                ''
              )}
            </p>

            {/* Username input (right column, spans 2 cols on md) */}
            <div className="md:col-span-2 order-3 md:order-3 w-full"> {/* UPDATED: ensure inputs live in right column */}
              <input 
                onChange={handleChange}
                type='text' 
                id='userName'  
                placeholder='username' 
                className='w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-300 outline-none'  /* UPDATED: roomy input, slate style */
                defaultValue={currentUser.data.userName}
              />
            </div>

            {/* Email input */}
            <div className="md:col-span-2 order-4 md:order-4 w-full"> {/* UPDATED */}
              <input 
                onChange={handleChange}
                type='email' 
                id='email'  
                placeholder='email' 
                className='w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-300 outline-none'  /* UPDATED */
                defaultValue={currentUser.data.email}
              />
            </div>

            {/* Password input */}
            <div className="md:col-span-2 order-5 md:order-5 w-full"> {/* UPDATED */}
              <input
                onChange={handleChange}
                type='password' 
                id='password'  
                placeholder='New password (optional)' 
                className='w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-300 outline-none'  /* UPDATED */
              />
            </div>

            {/* Action buttons: Update + Create Listing in same form (right column) */}
            <div className="md:col-span-2 order-6 md:order-6 w-full flex gap-4 mt-1"> {/* UPDATED: buttons in right column */}
              <button type='submit' disabled={loading} className='flex-1 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:opacity-95 transition active:scale-95'>
                {loading ? 'Loading...' : 'Update Profile'}
              </button>

              <Link to={'/createlist'} className='flex-1 inline-flex items-center justify-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition'>
                Create Listing
              </Link>
            </div>
          </form>

          {/* Signout / Delete row remains outside form but uses same handlers */}
          <div className="flex justify-between items-center mt-6"> {/* UPDATED: spacing, same position as your old code */}
            <span onClick={onDeleteHandle} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-2'>Delete Account</span>
            <span onClick={handleSignOut} className='text-slate-700 font-semibold cursor-pointer hover:underline hover:opacity-90 py-2'>Sign Out</span>
          </div>

          {/* messages */}
          <p className='text-red-700 mt-4'>{error ? error : ''}</p>

          <p className={`${signOut ?  "bg-emerald-50 border border-emerald-100 text-emerald-700 text-center px-5 py-3 rounded-xl shadow-sm text-sm font-semibold mt-4" : ""}`}> 
            {signOut ? "Logout successfully!" : ""}
          </p>

          <p className={`${update ? "bg-emerald-50 border border-emerald-100 text-emerald-700 text-center px-5 py-3 rounded-xl shadow-sm text-sm font-semibold mt-4": ""}`}>
            {update ? "Successfully updated your profile" : ""}
          </p>
        </div>

        {/* user listings block — unchanged structure but styled */}
        <div className="border-t border-slate-100 p-6 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Your Listings</h3>
            <div className="flex gap-3">
              <button onClick={handleShowListings} className="text-sm text-green-700 font-semibold hover:underline">Show Listings</button>
              <Link to={'/saved'} className="text-sm text-green-700 font-semibold hover:underline">Saved</Link>
            </div>
          </div>

          {userListings && userListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userListings.map((l) => (
                /* --- single listing card (replace only className values here) --- */
                <div
                  key={l._id}
                  className="w-full bg-white rounded-lg border border-slate-100 p-4 flex items-start gap-6 overflow-hidden relative"
                >
                  <Link to={`/listing/${l._id}`} className="w-28 h-28 rounded-md overflow-hidden flex-shrink-0">
                    <img src={l.imageUrls[0]} alt="cover" className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 pr-16">
                    <Link to={`/listing/${l._1d}`} className="block">
                      <p className="text-lg text-slate-800 font-semibold leading-tight truncate">{l.name}</p>
                    </Link>
                  </div>

                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-end gap-3">
                    <button onClick={()=> handleRemoveList(l._id)} className="text-red-600 uppercase font-semibold text-sm hover:underline">Delete</button>
                    <Link to={`/update-list/${l._id}`}>
                      <button className="text-green-700 uppercase font-semibold text-sm hover:underline">Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">No listings found. Create your first listing to show up here.</div>
          )}
        </div>
      </div>
    </div>
  </div>
)

// --- END OF UPDATED UI ---
}

