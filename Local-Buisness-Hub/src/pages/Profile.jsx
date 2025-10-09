import { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { deleteInFailure, deleteInStart, deleteInSuccess, signOutFailure, signOutStart, signOutSuccess, updateInFailure, updateInStart, updateInSuccess } from '../redux/users/slice.js';
import { data, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { app } from '../../firebase.js';
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'

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
  
  console.log(filePer);
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
        console.log(progress);
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
      const timer = setTimeout(() => {
        setUpdate(false);
      }, 3000); // disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  },[update]);

  useEffect(()=>{
    if(signOut){
      const timer = setTimeout(() => {
        setSignOut(false);
      }, 3000); // disappears after 3 seconds
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
      dispatch(updateInFailure(error.message));
    }
  };

  const onDeleteHandle = async ()=>{
    try {
      dispatch(deleteInStart());
      const res = await fetch(`/api/user/delete/${currentUser.data._id}`,{
        method : "DELETE"
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
      const res = await fetch('/api/signout');
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      currentUser = null;
    } catch (error) {
      console.log(error);
      dispatch(signOutFailure(data.message));
    }
  }

  // firebase storage rules apply kiye gye hain....
  // allow read;
  // allow write : if 
  // request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*')
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 font-semibold'>
        <input 
          onChange={(e)=> setFile(e.target.files[0]) } 
          type='file' 
          ref={fileRef} 
          hidden 
          accept='image/*'
        />
        <img 
          onClick={()=> fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
          src={ formData?.avatar || currentUser.data.avatar } 
          alt='profile'
        />
        {/* Now abb yha pr filePer ko show krege */}
        <p className=' font-semibold self-center'>
          {fileUploadError ? (
          <span className='text-red-700'>Image Upload Error(image must be less than 2 mb)</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>
          ) : filePer === 100 ? (
            <span className=' text-green-700'>Image successfully uploaded!!</span>
          ) : (
            ''
          )}
        </p>
        <input 
          onChange={handleChange}
          type='text' 
          id='userName'  
          placeholder='username' 
          className=' text-slate-500 bg-transparent focus:outline-slate-700  focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
          defaultValue={currentUser.data.userName}
          />
        <input 
          onChange={handleChange}
          type='email' 
          id='email'  
          placeholder='email' 
          className=' text-slate-500 bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
          defaultValue={currentUser.data.email}
        />
        <input
          onChange={handleChange}
          type='password' 
          id='password'  
          placeholder='password' 
          className=' bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
        />
        <button type='submit' disabled={loading} className='uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-95'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link 
          to={'/createlist'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-9'>
        Create Listing
        </Link>
      </form>
      <div className='flex justify-between'>
        <span onClick={onDeleteHandle} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-3.5'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-3.5'>Sign Out</span>
      </div>
      <p className='text-red-700  border-red-200 mt-5'>{error ? error : ''}</p>

      <p className={`${signOut ?  "bg-green-50 border border-green-400 text-green-700 uppercase text-center px-5 py-3 rounded-xl shadow-md text-base font-semibold " : ""}`}> 
        {signOut ? "Logout successFully !!" : ""}
      </p>

      <p className={`${update ? "bg-green-50 border border-green-400 text-green-700 uppercase text-center px-5 py-3 rounded-xl shadow-md text-base font-semibold ": ""}`}>
        {update ? "SuccessFully Updated the data" : ""}
      </p>
    </div>
    
  )
}
