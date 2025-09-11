import React from 'react'
import { useRef } from 'react';
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4 font-semibold'>
        <input type='file' ref={fileRef} hidden accept='image/*'/>
        <img 
          onClick={()=> fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
          src={currentUser.data.avatar} 
          alt='profile'
        />
        <input 
          type='text' 
          id='userName'  
          placeholder='username' 
          className=' text-slate-500 bg-transparent focus:outline-slate-700  focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
          defaultValue={currentUser.data.userName}
          />
        <input 
          type='email' 
          id='email'  
          placeholder='email' 
          className=' text-slate-500 bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'
          defaultValue={currentUser.data.email}
        />
        <input type='password' id='password'  placeholder='password' className=' bg-transparent focus:outline-slate-700 focus:bg-slate-300 border p-3 rounded-lg shadow-2xl'/>
        <button type='submit' className='uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-95'>
          update
        </button>
      </form>
      <div className='flex justify-between'>
        <span className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 py-1.4'>Delete Account</span>
        <span className='text-red-600 font-semibold cursor-pointer hover:underline hover:opacity-90 p-1.4'>Sign Out</span>
      </div>
    </div>
    
  )
}
