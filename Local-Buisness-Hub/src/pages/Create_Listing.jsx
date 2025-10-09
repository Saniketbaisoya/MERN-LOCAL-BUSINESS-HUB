// Now kbhi bhi koi eventHandler jb register hota hai kisi bhi component/tag ke andr toh agr uss eventhandler ko call krke usme arguments pass krke usko register krte hai toh {()=> eventHandler()}
// Other wise if there is no parameter is passing then we can normally define the eventHandler into the tag/component {eventHandler}

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { app } from "../../firebase";

export default function Create_Listing() {
  const [files,setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading,setUploading] = useState(false);
  // Now formData yeah jo piece of state hai yeah basically voh sara data list ka store krega jo hmme backend pe proxy req lgate hue bejna hai....
  // Now abhi intially as we know the schema of listing all the imagesurls is store in imageUrls, initally jbb Promise ke upr jake sare urls ko fetch krke jbb hmm usko store krege setForm data ka use krke formData ke imageUrl mai
  // isliye hmne abhi form data mai phele imageUrl krke variable bnaya hai phele or iss variable ka name schema ke imageUrls ke name se match hona chahiye otherwise database smj ni payega ki kha store krna hai....
  const [formData,setFormData] = useState({
    imageUrls : []
  })
  console.log(files);
  console.log(formData);


  const handleImageUpload = (e)=> {
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for(let i = 0; i < files.length; i++){
        promises.push(storageImage(files[i]));
      }

      Promise.all(promises).then((urls)=>{
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls)
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((error)=> {
        setImageUploadError("Image upload failed (2mb max per image)");
      });
    }else{
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }

  };
  const storageImage = async (file)=> {
    return new Promise((resolve,reject)=> {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot)=> {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls : formData.imageUrls.filter((_,i)=> i != index)
    });
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Creating a Listing</h1>

      <form className='flex flex-col sm:flex-row gap-4'>
        {/* Now this below div is the left column of the form tag */}
        <div className='flex flex-col gap-4 flex-1'>
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

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "sale"
                className='w-5 cursor-pointer'
              />
              <span>Sell</span>
            </div>
            {/* Rent */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "Rent"
                className='w-5 cursor-pointer'
              />
              <span>Rent</span>
            </div>
            {/* Parking Spot */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "parking"
                className='w-5 cursor-pointer'
              />
              <span>Parking Spot</span>
            </div>
            {/* Furnished */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "furnished"
                className='w-5 cursor-pointer'
              />
              <span>Furnished</span>
            </div>
            {/* Offer */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "offer"
                className='w-5 cursor-pointer'
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Now abb numbers related ayegee again ek div, lekin rhege isi form ke andr.... */}
          <div className='flex flex-wrap gap-6'>
            {/*  */}
            
            <div className='flex items-center gap-3 font-semibold'>
              <input 
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                defaultValue='0'
                required
                className='p-3 border  border-gray-300 bg-slate-100 rounded-lg'

              />
              <p>Beds</p>
            </div>

            {/*  */}
            <div className='flex items-center gap-3 font-semibold'>
              <input 
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                defaultValue='0'
                required
                className='p-3 font-semibold border border-gray-300 bg-slate-100 rounded-lg'
              />
              <p>Baths</p>
            </div>

            {/*  */}
            <div className='flex items-center gap-2 font-semibold'>
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
            <div className='flex items-center gap-2 font-semibold'>
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
        {/* Now this will be the right column of the form tag */}

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal font-semibold text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
          {/* Now sbse phele koi bhi user jb file ko upload krega
            * Toh usse hmm kisi piece of state ke andr sbse phele store krege 
            * Then uss piece of state ka use krke hmm eventHandler jo button mai registered hoga uske andr use krege unn file ko backend mai send krne ke liye
           */}
            <input
              onChange={(e)=> setFiles(e.target.files)}
              className='p-3 border font-semibold border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageUpload}
              className='p-3 font-semibold text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
            {uploading ? "Uploading..." : "Upload"}
            </button>
            
          </div>
          <div className=" text-red-700  font-semibold text-center">{imageUploadError && imageUploadError}</div>
          {/* Now abb agr imageUrls ke andr images hai if the length is > 0 then we will list the images below the upload button
            * also we have a button of delete so that user can direclty delete the image
            * that is why abb hmm har ek imageUrls ke upr jakr using map sare url ko lekr usko phele list krege and hr ek ke corressponding show krege delete button ko 
           */}
          <p>
            {formData.imageUrls.length > 0 && 
              formData.imageUrls.map((urls,index)=> (
                <div key={urls} className='flex justify-between p-3 border items-center'>
                  <img 
                    src={urls} 
                    alt="listing image" 
                    className="w-20 h-20  object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    type="button" 
                    onClick={()=> handleRemoveImage(index)}
                    // className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-500 active:bg-slate-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Delete
                  </button>
                </div>
              ))
            }
          </p>
          <button className='p-3 font-semibold bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>Create Listing</button>
        </div> 
          
        
      </form>
    </main>
  )
}
