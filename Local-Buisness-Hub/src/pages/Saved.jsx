import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

        /**
         * Now, koi agr listings hmne delete krdi toh kyuki voh store ho rhi hai firebase mai uski id isliye uski id rhe jati hai
         * And then savedListings sbhi id's ke upr listings ki get request ko pass krta hai, then sbhi lsitings toh aajayegi lekin delete hui vali pr listing not found aajayega
         * Jiski vje se array mai inconsistency aajayegi and listing not found ke _id read nhi hooga
         * Toh isi problem ko solve krne ke liye hmne sbse jo bhi response ayega uspr filter lgaya and then unhi items/response ko include kiya jinme success parameter exist krta hai
         * Then unhi responses ko lekr hmm then usko validListings mai store krege and then usko pass krdege setSavedListings ke andr isse Listing not found vali sari listings hat jayegi and data consistent rhega in validListings mai...
         */
        const validListings = responses.filter(
          item => item?.success && item?.data?._id
        );

        setSavedListings(validListings);
        
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
  <div className="px-4 sm:px-6 lg:px-10 mt-6">
    {/* Heading */}
    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-600 mb-6">
      Your Saved Listings
    </h1>

    {/* Empty state */}
    {savedListings.length === 0 ? (
      <p className="text-slate-500 text-sm">
        No Saved Listings yet.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedListings.map((listing) => (
          <ListingItem
            key={listing.data._id}
            listings={listing.data}
          />
        ))}
      </div>
    )}
  </div>
);
}
