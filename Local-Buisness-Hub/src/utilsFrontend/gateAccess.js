const VIEW_KEY = "viewed_listings";
export const MAX_FREE_VIEWS = 1;

export function getViewedList(){
    try {
        return JSON.parse(localStorage.getItem(VIEW_KEY) || "[]");
    } catch (error) {
        return [];
    }
}

export function addViewedListing(listingId){
    const arr = getViewedList();
    if(!arr.includes(listingId)){
        arr.push(listingId);
        localStorage.setItem(VIEW_KEY, JSON.stringify(arr));
    }
    return arr;
}

export function canViewAsGuest(listingId){
    const arr = getViewedList();
    console.log(arr.length);
    // if user is already viewed, allow
    if(arr.includes(listingId)) return true;
    // if count < MAX_FREE_VIEWS allows and increament
    if(arr.length < MAX_FREE_VIEWS){
        addViewedListing(listingId);
        return true;
    }
    return false;

}

export function resetGuestViews(){
    localStorage.removeItem(VIEW_KEY);
}