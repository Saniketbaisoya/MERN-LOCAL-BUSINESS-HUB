import React from 'react'
import { Link } from 'react-router-dom';

export default function LoginModel({open, onClose}) {
    if(!open) return null;
    return(
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
            <div className=' bg-white p-6 rounded-lg w-[90%] max-w-md'>
                <h3 className=' text-xl font-bold'>Please sign in to continue</h3>
                <p className=' mt-2 text-sm'>You have reached the free listing limit.</p>

                <div className=' mt-4 flex gap-3'>
                    <Link 
                        className=' flex-1 btn-primary'
                        to='/signIn'
                    >Login</Link>
                    <button 
                        onClick={onClose}
                        className=' btn-ghost'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
