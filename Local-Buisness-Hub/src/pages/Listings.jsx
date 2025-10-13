import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
// Now Navigation ko maine swiper/modules se import toh krliya lekin swiper automatically use nhi kr payega
// isliye hmme usse alg se define krna hoga tb voh navigation ke <> bars dikhai dege...
SwiperCore.use([Navigation]);

export default function Listings() {
    const [listing,setListing] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const params = useParams();

    useEffect(()=> {
        const fetchLising = async ()=> {
            try {
            setLoading(true);
            const response = await fetch(`/api/listing/get/${params.listingId}`,{
                method : 'GET',
            });
            const data = await response.json();
            console.log(data.data);
            if(data.success == false){
                setError(true);
                setLoading(false);
                return;
            }
            setListing(data.data);
            setLoading(false);
            setError(false);
        }catch (error) {
            setError(true);
            setLoading(false);
        };
        }
        
        fetchLising();
    },[params.lisitingId])

  return (
    <main>
        {loading && <p className=' text-center my-7 text-2xl'>Loading...</p>}
        {error && (<p className=' text-center my-7 text-2xl'>Something went wrong</p>)} 
        {listing && !loading && !error && (
            <div>
                <Swiper navigation={true}>
                    {listing.imageUrls.map((url)=> (
                        <SwiperSlide key={url}>
                            <div
                                className='h-[550px]'
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        )}
    </main>
  )
}
