import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
/**
 * SignUp means login yani user iss component ke upr login krega.
 * With the given details (userName,email and password)
 * Then yeah data user enter krega client side pr,
 * Then yeah data phr backend ke through kri hui api userRouter vali expose 
 * Uske pass yeah data jayega....
 */
export default function SignUp() {
  const [formData,setFormData] = useState({});
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const[loading,setLoading] = useState(false);


  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
      
    });
  };
  console.log(formData);

  /**
   * Now this event handler is the function of the signUp button 
   * Means when we click to the button then this handleSubmit eventHandler should be executed 
   * Then this will track the whole action(which perform by the client on button component) and send to the backend userRouter api
   * Then the user will be created...
   * 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Now iss yha proxy ka use krke jo authRouter(backend) pr request raise kr rhe hai
      // isme proxy ka methond kya hoga usko alg se req ki jgh define krte hai
      // also yha req data ka type kaisa hoga voh bhi dege...
      setLoading(true);
      const res = await fetch('/api/',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success == false){
        setLoading(false)
        setError(data.message);
      }
      navigate('/signIn');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 font-semibold '>
          <input type="text" placeholder='username'
            className='border p-3 rounded-lg shadow-2xl' id="userName" onChange={handleChange}
          />
          <input type="email" placeholder='email'
            className='border p-3 rounded-lg shadow-2xl' id="email" onChange={handleChange}
          />
          <input type="password" placeholder='password'
            className='border p-3 rounded-lg shadow-2xl' id="password" onChange={handleChange}
          />
          <button disabled={loading} type='submit' className='bg-slate-700 text-white p-3
          rounded-lg uppercase hover:bg-opacity-95 disabled:opacity-80 shadow-2xl'
          >{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
        <div className='flex gap-1 mt-2'>
          <p className='font-semibold'> Already have an account?</p>
          <Link to="/signIn">
          <span className='text-blue-700 hover:underline font-semibold hover:opacity-85'>Sign In</span>
          </Link>
        </div>
    </div>
  )
}
