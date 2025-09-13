import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { app } from '../../firebase.js';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/users/slice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /**
   * Now function async hoga kyuki hme google ke response ka bhi wait krna hai tb console aage le ayege jb google response bejega....
   * Now button ke type ko submit krdiya taki jb iss button pr click ho toh data submit ho jaye automatically 
   * Now onClick ko register isliye kiya hai kyuki jaise hi button pr click krege toh submit nature hai button and then voh eventHandler ko trigger krega
   * Then hmm inside the eventHandler, define krege signInpop screen ko joki google hme ek function ki form mai provide krayega
   * Then popUp Screen show and then jb user apni email ko select krega toh uss point of time pr hme google se ek response recieve hoga
   * And uss response mai hoga data jisme kuch imp data ko lekr hmm usko bejege backend code pr and then if the email is already exist then we will send the token and sending to frontend a message like in signIn case
   * But if the email is not exist then the user is created corressponding to the email....
   */
  const onChangeGoogleHandle = async ()=> {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      // taki google ke response ke liye hmm ruke...
      const response = await signInWithPopup(auth,provider);

      const res = await fetch('/api/googleAuth',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({name : response.user.displayName, email : response.user.email, avatar : response.user.photoURL}),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate('/');

      if(data.success == false){
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <button  type='button' onClick={onChangeGoogleHandle}
      className='flex items-center  justify-center gap-2 w-full sm:w-auto p-3  border border-gray-300 rounded-lg shadow-sm bg-red-700 text-white  hover:opacity-85 transition-all duration-200 uppercase'>
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Continue With Google
    </button>
  )
}
