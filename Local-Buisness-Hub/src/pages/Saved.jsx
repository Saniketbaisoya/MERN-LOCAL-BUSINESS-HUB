import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../firebase';
import ListingItem from '../components/ListingItem';

export default function Saved() {
  
  const {currentUser} = useSelector((state)=> state.user);
  console.log(currentUser);
  // now iss hook function ko array based property isliye bnaya
  // kyuki yeah store krega voh sari listings ko jo saved hui thi user ke through
  // and also voh sari listings fetch hogi proxy req se listingId ka use krke jo firestore database
  // mai store hui thi....
  const [savedListings,setSavedListings] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=> {
    const fetchSavedListings = async () => {
      if(!currentUser) return;
      try {
        const ref = collection(db, "users", currentUser.data._id, "savedListings");
        const snapShot = await getDocs(ref);

        const ids = snapShot.docs.map(doc => doc.data().listingId);

        const responses = await Promise.all(
          ids.map(id => fetch(`api/listing/get/${id}`).then(res => res.json()))
        );

        setSavedListings(responses);
        
      } catch (error) {
        console.log("Error Loading Saved Listings",error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedListings();
  }, [currentUser]);
  console.log(savedListings);

  if(loading) {
    return <p className='font-semibold text-center my-7'>Loading Saved Listings...</p>
  }

  return (
    <div className=' flex mt-4'>
      <h1 className='text-3xl font-semibold text-slate-600 my-7 ml-10 '>Your Saved Listings :</h1>

      {savedListings.length === 0 ? (
        <p>No Saved Listings yet.</p>
      ) : (
        <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-10'>
          {savedListings.map(listing => (
            <ListingItem   listings={listing.data} key={listing.data._id}/>
          ))}
        </div>
      )}
    </div>
  )
}
