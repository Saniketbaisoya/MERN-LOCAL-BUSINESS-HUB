import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";


export default function Create_Listing() {
  const [files,setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading,setUploading] = useState(false);
  const {currentUser} = useSelector((state)=> state.user);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  // Now formData yeah jo piece of state hai yeah basically voh sara data list ka store krega jo hmme backend pe proxy req lgate hue bejna hai....
  // Now abhi intially as we know the schema of listing all the imagesurls is store in imageUrls, initally jbb Promise ke upr jake sare urls ko fetch krke jbb hmm usko store krege setForm data ka use krke formData ke imageUrl mai
  // isliye hmne abhi form data mai phele imageUrl krke variable bnaya hai phele or iss variable ka name schema ke imageUrls ke name se match hona chahiye otherwise database smj ni payega ki kha store krna hai....
  const [formData,setFormData] = useState({
    imageUrls : [],
    name : "",
    description : "",
    address : "",
    regularPrice : 0,
    discountedPrice : 0,
    bathrooms : 1,
    bedrooms : 1,
    furnished : false,
    parking : false,
    type : "rent",
    offer : false,
  })
  console.log(files);
  console.log(formData);

  useEffect(()=> {
    const fetctListings = async () => {
        const listingId = params.listingId;
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();
        if(data.success === false){
            console.log(data.messaage);
            return;
        }
        setFormData(data.data);
    };
    fetctListings();
  },[])


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

  /**
   * Now abb handleChange different different type ke variables ko target krke formData mai values set krega
   * for ex. jaise name, address, description are the text , then  bedrooms, bathrooms, discountedPrice, regularPrice are the numbers
   * Then sales, rent, offers, parking, furnished, are boolean
   */
  const handleChange = (e)=> { 
    if(e.target.id == 'sale' || e.target.id == 'rent'){
      setFormData({
        ...formData,
        type : e.target.id
      });
    };
    if(e.target.id == 'parking' || e.target.id == 'furnished' || e.target.id == 'offer'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    };
    if(e.target.type == 'number' || e.target.type == 'text' || e.target.type == 'textarea'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
    };
  };

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1){
        return setError('You must upload at least one image');
      }
        
      if (+formData.regularPrice < +formData.discountedPrice){
        return setError('Discount price must be lower than regular price');
      }
      setLoading(true);
      setError(false);
      const response = await fetch(`/api/listing/updateList/${params.listingId}`,{
      method : 'PATCH',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        ...formData,
        useRef : currentUser.data._id
      })
    });
    const data = await response.json();
    setLoading(false);
    if(data.success == false){
      setError(data.messaage);
    }
    console.log(data._id);
    navigate(`/listing/${data.data._id}`);
    }catch(error) {
      setError(error.messaage);
      setLoading(false);
    }
    
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
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
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder = "Description"
            className=' font-semibold border p-3 rounded-lg'
            id = "description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input 
            type='text'
            placeholder = "Address"
            className=' font-semibold border p-3 rounded-lg'
            id = "address"
            minLength = '10'
            maxLength = '60'
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Now abb check box related sb ek hi div mai ayega */}
          <div className='flex gap-6 flex-wrap'>
          {/* Sale */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "sale"
                className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.type == "sale"}
              />
              <span>Sell</span>
            </div>
            {/* Rent */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "rent"
                className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.type == "rent"}
              />
              <span>Rent</span>
            </div>
            {/* Parking Spot */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "parking"
                className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            {/* Furnished */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "furnished"
                className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            {/* Offer */}

            <div className='flex gap-2 font-semibold'>
              <input 
                type='checkbox'
                id = "offer"
                className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Now abb numbers related ayegee again ek div, lekin rhege isi form ke andr.... */}
          <div className='flex flex-wrap gap-6'>
            {/*  Beds */}
            
            <div className='flex items-center gap-3 font-semibold'>
              <input 
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                defaultValue='0'
                required
                className='p-3 border  border-gray-300 bg-slate-100 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}

              />
              <p>Beds</p>
            </div>

            {/* bathrooms */}
            <div className='flex items-center gap-3 font-semibold'>
              <input 
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                defaultValue='0'
                required
                className='p-3 font-semibold border border-gray-300 bg-slate-100 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

            {/* regularPrice */}
            <div className='flex items-center gap-2 font-semibold'>
              <input 
                type='number'
                id='regularPrice'
                min='100'
                max='10000000000'
                placeholder='Amount'
                required
                className='p-3 border border-gray-300 bg-slate-100 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                {formData.type=== 'rent' && (<span className=" text-sm">(₹ / month)</span>)}
              </div>
            </div>

            {/* discountedPrice */}
            {formData.offer && 
              <div className='flex items-center gap-2 font-semibold'>
                <input 
                  type='number'
                  id='discountedPrice'
                  min='100'
                  max='10000000000'
                  placeholder='Amount'
                  required
                  className='p-3 border border-gray-300 bg-slate-100 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  {formData.type === 'rent' && (<span className=" text-sm text-slate-500">(₹ / month)</span>)}
                  
                </div>

              </div>
            }
            

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
          <button disabled = {loading || uploading} className='p-3 font-semibold bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>{loading ? <p>Creating...</p>: 'Update List'}</button>
          {error ? <p className=" text-red-700 text-sm">{error}</p> : ""}
        </div> 
          
        
      </form>
    </main>
  )
}
