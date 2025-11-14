import { useState } from 'react'
import {data, Link, useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import { signInFailure, signInStart, signInSuccess } from '../redux/users/slice.js';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
import { resetGuestViews } from '../utilsFrontend/gateAccess.js';
/**
 * SignUp means login yani user iss component ke upr login krega.
 * With the given details (userName,email and password)
 * Then yeah data user enter krega client side pr,
 * Then yeah data phr backend ke through kri hui api userRouter vali expose 
 * Uske pass yeah data jayega....
 */
export default function SignUp() {
  const [formData,setFormData] = useState({});
  
  // const [error,setError] = useState(null);
  // const[loading,setLoading] = useState(false); 
  const {error,loading} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mess = "";

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
      
    });
  };

  useEffect(()=>{
    console.log("Inside");
    if(error){
      const timer = setTimeout(() => {
        dispatch(signInFailure(mess)) // clear error after 2 seconds
      }, 2000);
      return () => clearTimeout(timer);
    }
  },[error])
  /**
   * Now this event handler is the function of the signIp button 
   * Means when we click to the button then this handleSubmit eventHandler should be executed 
   * Then this will track the whole action(which perform by the client on button component) and send to the backend authRouter api
   * Then the user will be created...
   * 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Now iss yha proxy ka use krke jo authRouter(backend) pr request raise kr rhe hai
      // isme proxy ka methond kya hoga usko alg se req ki jgh define krte hai
      // also yha req data ka type kaisa hoga voh bhi dege...
      dispatch(signInStart());
      const res = await fetch('/api/signin',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        // setLoading(false)
        // setError(data.message);
        /**
         * loading : false,
         * error = data.message
         */
        dispatch(signInFailure(data.message));
        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      navigate('/');
      resetGuestViews();
    } catch (error) {
      mess = error.message;
      // setLoading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 font-semibold '>
          <input type="email" placeholder='email'
            className='border p-3 rounded-lg shadow-2xl' id="email" onChange={handleChange}
          />
          <input type="password" placeholder='password'
            className='border p-3 rounded-lg shadow-2xl' id="password" onChange={handleChange}
          />
          <button disabled={loading} type='submit' className='bg-slate-700 text-white p-3
            rounded-lg uppercase hover:bg-opacity-95 disabled:opacity-80 shadow-2xl'
            >{loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-1.2'>
          <p className='font-semibold'> Dont have an account?</p>
          
          <Link to="/signUp">
          <span className='text-blue-700 hover:underline font-semibold hover:opacity-85'>Sign Up</span>
          </Link>
          {error && 
            <div className='p-3 max-w-lg mx-auto'>
            <p className="inline-block text-center  text-sm font-medium text-red-700 bg-red-100 border border-red-400 rounded-lg px-4 py-2 shadow-md animate-bounce">{error}</p>
            </div>
          }
        </div>
    </div>
  )
}
