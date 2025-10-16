import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Search() {
    const navigate = useNavigate();
    const [listings,setListings] = useState([]);
    const [sideBarData,setSideBarData] = useState({
        searchTerm : '',
        type : 'all',
        parking : false,
        furnished : false,
        offer : false,
        sort : 'created_at',
        order : 'desc'

    });
    
    console.log(listings);


    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('seacrhTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl){
            setSideBarData({
                searchTerm : searchTermFromUrl || '',
                type : typeFromUrl || 'all',
                parking : parkingFromUrl === 'true' ? true : false,
                furnished : furnishedFromUrl === 'true' ? true : false,
                offer : offerFromUrl === 'true' ? true : false,
                sort : sortFromUrl || 'created_at',
                order : orderFromUrl || 'desc'

            });
        }

        const fetchListings = async () => {
            const searchQuery = urlParams.toString();
            const response = await fetch(`/api/listing/get${searchQuery}`,{
                method : 'GET'
            });
            const data = await response.json();
            if(data.success == false){
                console.log(data.message);
            }
            setListings(data.data);

        };
        fetchListings();
    },[location.search]);

    const handleChange = (e)=> {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSideBarData({...sideBarData, type : e.target.id})
        }
        if(e.target.id === 'searchTerm'){
            setSideBarData({...sideBarData, searchTerm : e.target.value})
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSideBarData({...sideBarData, [e.target.id]: e.target.checked || e.target.checked == 'true' ? true : false})
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSideBarData({...sideBarData, sort, order});
        }
    };

    const handleSubmit = (e)=> {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('type',sideBarData.type);
        urlParams.set('parking',sideBarData.parking);
        urlParams.set('furnished',sideBarData.furnished);
        urlParams.set('offer',sideBarData.offer);
        urlParams.set('sort',sideBarData.sort);
        urlParams.set('order',sideBarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/seacrh/${searchQuery}`);
    }

    return (
        <div className='flex flex-col md:flex-row'>
        {/* Now abb yha seacrhterm or listings results ayege.... */}
        {/*  This div for the form of searchTerm*/}
        <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className=' flex flex-col gap-8'>

                {/* Now isme bhi multiple divs hoge for Search Term, for type, for amenities, for sort and for seacrh button */}
                <div className=' flex items-center gap-2'>
                    <label className=' whitespace-nowrap rounded-lg p-1.5 text-white bg-slate-500'>Seacrh Term:</label>
                    <input 
                        type='text'
                        id='searchTerm'
                        placeholder='Search...'
                        className=' border rounded-lg p-3 w-full bg-slate-100'
                        onChange={handleChange}
                        value={sideBarData.searchTerm}
                    />
                </div>

                {/* Now here i have a div of type where rent&sale, rent, sale present.... */}
                <div className=' flex gap-2 flex-wrap items-center'>
                    <label className=' rounded-lg p-1.5 text-white bg-slate-500'>Type:</label>
                    <div className=' flex gap-2'>
                        <input 
                            type='checkbox'
                            id='all'
                            className='w-5'
                            onChange={handleChange}
                            checked={sideBarData.type === 'all'}
                            
                        />
                        <span className=' font-semibold'>Rent & Sale</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                            type='checkbox'
                            id='rent'
                            className='w-5'
                            onChange={handleChange}
                            checked={sideBarData.type === 'rent'}
                        />
                        <span className=' font-semibold'>Rent</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                            type='checkbox'
                            id='sale'
                            className='w-5'
                            onChange={handleChange}
                            checked={sideBarData.type === 'sale'}
                        />
                        <span className=' font-semibold'>Sale</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                            type='checkbox'
                            id='offer'
                            className='w-5'
                            onChange={handleChange}
                            checked={sideBarData.offer}
                        />
                        <span className=' font-semibold'>Offer</span>
                    </div>
                </div>

                {/* Now here i have a div of Amenities in which parkinga and furnished here.... */}
                <div className=' flex gap-2 flex-wrap items-center'>
                    <label className=' rounded-lg p-1.5 text-white bg-slate-500'>Amenities:</label>
                    <div className=' flex gap-2'>
                        <input 
                            type='checkbox'
                            id='parking'
                            className='w-5'
                            onChange={handleChange}
                            checked={sideBarData.parking}
                        />
                        <span className=' font-semibold'>Parking</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                            type='checkbox'
                            id='furnished'
                            className='w-5'
                            onChange={handleChange}
                            checked={sideBarData.furnished}
                        />
                        <span className=' font-semibold'>Furnished</span>
                    </div>
                </div>

                {/* Now here i have a sort option where use can list in order to highToLow, lowToHigh, latest, oldest.... */}
                <div className=' flex items-center gap-2'>
                    <label className=' rounded-lg p-1.5 text-white bg-slate-500'>Sort:</label>
                    <select
                        onChange={handleChange}
                        className=' border rounded-lg p-3 font-semibold'
                        id='sort_order'
                        defaultValue={'created_at_desc'}
                    >
                        <option>Price high to low</option>
                        <option>Price low to high</option>
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
                {/*  Here we have a seacrh button....*/}
                <button
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
                >
                    Search
                </button>
            </form>
        </div>
        {/* This div for the listings results */}
        <div>
            <h1 className=' text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        </div>
        </div>
    )
}
