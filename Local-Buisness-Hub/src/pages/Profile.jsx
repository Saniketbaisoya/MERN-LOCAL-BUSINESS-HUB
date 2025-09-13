import { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { deleteInFailure, deleteInStart, deleteInSuccess, signOutFailure, signOutStart, signOutSuccess, updateInFailure, updateInStart, updateInSuccess } from '../redux/users/slice.js';
import { data, useNavigate } from 'react-router-dom';

export default function Profile() {
  
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch();
  const [update,setUpdate] = useState(false);
  const [signOut,setSignOut] = useState(false);
  const navigate = useNavigate();
  

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
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 font-semibold'>
        <input type='file' ref={fileRef} hidden accept='image/*'/>
        <img 
          onClick={()=> fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
          src={ formData.avatar || currentUser.data.avatar } 
          alt='profile'
        />
        <input 
          onChange={handleChange}
          type='text' 
          id='userName'  
          placeholder='username' 
          className=' text-slate-500 bg-transparent focus:outline-slate-700  focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
          defaultValue={currentUser?.data?.userName}
          />
        <input 
          onChange={handleChange}
          type='email' 
          id='email'  
          placeholder='email' 
          className=' text-slate-500 bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
          defaultValue={currentUser?.data?.email}
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
      </form>
      <div className='flex justify-between'>
        <span onClick={onDeleteHandle} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-1.4'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 p-1.4'>Sign Out</span>
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
