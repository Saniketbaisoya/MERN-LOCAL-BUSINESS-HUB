import React from 'react'
import {Link} from 'react-router-dom'
/**
 * SignUp means login yani user iss component ke upr login krega.
 * With the given details (userName,email and password)
 * Then yeah data user enter krega client side pr,
 * Then yeah data phr backend ke through kri hui api userRouter vali expose 
 * Uske pass yeah data jayega....
 */
export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4 font-semibold '>
          <input type="text" placeholder='username'
            className='border p-3 rounded-lg shadow-2xl' id="username"
          />
          <input type="email" placeholder='email'
            className='border p-3 rounded-lg shadow-2xl' id="email"
          />
          <input type="password" placeholder='password'
            className='border p-3 rounded-lg shadow-2xl' id="password"
          />
          <button className='bg-slate-700 text-white p-3
          rounded-lg uppercase hover:bg-opacity-95 disabled:opacity-80 shadow-2xl' id="username"
          >Sign Up</button>
        </form>
        <div className='flex gap-1 mt-2'>
          <p>have an account?</p>
          <Link to="/signIn">
          <span className='text-blue-700 hover:underline'>Sign In</span>
          </Link>
        </div>
    </div>
  )
}
