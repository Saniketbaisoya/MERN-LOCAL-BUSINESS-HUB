import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [owner,setOwner] = useState(null);
    const [error,setError] = useState(false);
    const [message,setMessage] = useState(null);
    const onChange = (e)=> {
        setMessage(e.target.value);
    }

    useEffect(()=> {
        const fetchOwner = async () => {
            try {
                const response = await fetch(`/api/user/${listing.useRef}`,{
                    method : 'GET'
                });
                const data = await response.json();
                if(data.success === false){
                    console.log(data.message);
                    setError(true);
                    return;
                }
                setOwner(data.data);

            } catch (error) {
                console.log(error);
                setError(true);
            }
        };
        fetchOwner();
    },[listing.useRef])
  return (
    <>
      {owner && (
        <div className='flex flex-col gap-2'>
            <p className=' bg-red-800 text-white p-3 rounded-lg text-center'>
                Contact <span className=' font-semibold'>{owner.userName}</span>{' '}for{' '}
                <span className=' font-semibold'>{listing.name.toLowerCase()}</span>
            </p>
            <textarea
                name='message'
                id='message'
                placeholder='Enter your message here....'
                rows='2'
                value={message}
                onChange={onChange}
                className=' w-full border p-3 rounded-lg'
            ></textarea>

            <Link 
                to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}
                className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
                Send Message
            </Link>
        </div>
      )}
    </>
  )
}
