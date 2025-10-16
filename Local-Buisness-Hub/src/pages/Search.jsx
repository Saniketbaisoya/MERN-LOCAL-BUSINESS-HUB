import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      {/* Now abb yha seacrhterm or listings results ayege.... */}
      {/*  This div for the form of searchTerm*/}
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form className=' flex flex-col gap-8'>
            {/* Now isme bhi multiple divs hoge for Search Term, for type, for amenities, for sort and for seacrh button */}
            <div className=' flex items-center gap-2'>
                <label className=' whitespace-nowrap rounded-lg p-1.5 text-white bg-slate-500'>Seacrh Term:</label>
                <input 
                    type='text'
                    id='searchTerm'
                    placeholder='Search...'
                    className=' border rounded-lg p-3 w-full bg-slate-100'
                />
            </div>

            {/*  */}
            <div className=' flex gap-2 flex-wrap items-center'>
                <label className=' rounded-lg p-1.5 text-white bg-slate-500'>Type:</label>
                <div className=' flex gap-2'>
                    <input 
                        type='checkbox'
                        id='all'
                        className='w-5'
                    />
                    <span className=' font-semibold'>Rent & Sale</span>
                </div>
                <div className=' flex gap-2'>
                    <input 
                        type='checkbox'
                        id='rent'
                        className='w-5'
                    />
                    <span className=' font-semibold'>Rent</span>
                </div>
                <div className=' flex gap-2'>
                    <input 
                        type='checkbox'
                        id='sale'
                        className='w-5'
                    />
                    <span className=' font-semibold'>Sale</span>
                </div>
                <div className=' flex gap-2'>
                    <input 
                        type='checkbox'
                        id='offer'
                        className='w-5'
                    />
                    <span className=' font-semibold'>Offer</span>
                </div>
            </div>

            {/*  */}
            <div className=' flex gap-2 flex-wrap items-center'>
                <label className=' rounded-lg p-1.5 text-white bg-slate-500'>Amenities:</label>
                <div className=' flex gap-2'>
                    <input 
                        type='checkbox'
                        id='parking'
                        className='w-5'
                    />
                    <span className=' font-semibold'>Parking</span>
                </div>
                <div className=' flex gap-2'>
                    <input 
                        type='checkbox'
                        id='furnished'
                        className='w-5'
                    />
                    <span className=' font-semibold'>Furnished</span>
                </div>
            </div>

            {/*  */}
            <div className=' flex items-center gap-2'>
                <label className=' rounded-lg p-1.5 text-white bg-slate-500'>Sort:</label>
                <select
                    className=' border rounded-lg p-3 font-semibold'
                    id='sort_order'
                >
                    <option>Price high to low</option>
                    <option>Price low to high</option>
                    <option>Latest</option>
                    <option>Oldest</option>
                </select>
            </div>
            {/*  */}
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
