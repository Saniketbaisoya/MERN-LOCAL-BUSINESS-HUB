import {React} from 'react'

export default function Create_Listing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Creating a Listing</h1>

      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flez-1'>
          <input 
            type='text'
            placeholder = "Name"
            className=' font-semibold border p-3 rounded-lg'
            id = "name"
            minLength = '10'
            maxLength = '60'
            required
          />
          <textarea 
            type='text'
            placeholder = "Description"
            className=' font-semibold border p-3 rounded-lg'
            id = "description"
            required
          />
          <input 
            type='text'
            placeholder = "Address"
            className=' font-semibold border p-3 rounded-lg'
            id = "address"
            minLength = '10'
            maxLength = '60'
            required
          />

          {/* Now abb check box related sb ek hi div mai ayega */}
          <div className='flex gap-6 flex-wrap'>
          {/* Sell */}

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id = "sale"
                className='w-5 cursor-pointer'
              />
              <span>Sell</span>
            </div>
            {/* Rent */}

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id = "Rent"
                className='w-5 cursor-pointer'
              />
              <span>Rent</span>
            </div>
            {/* Parking Spot */}

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id = "parking"
                className='w-5 cursor-pointer'
              />
              <span>Parking Spot</span>
            </div>
            {/* Furnished */}

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id = "furnished"
                className='w-5 cursor-pointer'
              />
              <span>Furnished</span>
            </div>
            {/* Offer */}

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id = "offer"
                className='w-5 cursor-pointer'
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Now abb numbers related ayegee again ek div lekin rhege isi form ke andr.... */}
          <div className='flex flex-wrap gap-6'>
            {/*  */}
            
            <div className='flex items-center gap-3'>
              <input 
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                defaultValue='0'
                required
                className='p-3 border border-gray-300 bg-slate-100 rounded-lg'

              />
              <p>Beds</p>
            </div>

            {/*  */}
            <div className='flex items-center gap-3'>
              <input 
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                defaultValue='0'
                required
                className='p-3 border border-gray-300 bg-slate-100 rounded-lg'
              />
              <p>Baths</p>
            </div>

            {/*  */}
            <div className='flex items-center gap-2'>
              <input 
                type='number'
                id='regularPrice'
                min='100'
                max='10000000000'
                placeholder='Amount'
                required
                className='p-3 border border-gray-300 bg-slate-100 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span>(₹ / month)</span>
              </div>
            </div>

            {/*  */}
            <div className='flex items-center gap-2'>
              <input 
                type='number'
                id='discountPrice'
                min='100'
                max='10000000000'
                placeholder='Amount'
                required
                className='p-3 border border-gray-300 bg-slate-100 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span>(₹ / month)</span>
              </div>

            </div>

          </div>
        </div>
        {/*  */}

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              className='p-3  text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
            Upload
            </button>
          </div>
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>Create Listing</button>
        </div>   
        
      </form>
    </main>
  )
}
