import { useCallback, useEffect, useState } from "react";
import { canViewAsGuest, getViewedList, MAX_FREE_VIEWS } from "./gateAccess";
import { checkAuthStatus } from "./auth";

export default function useGatedAccess(listingId, { openLoginModel : openLoginModal } = {}){
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [allowedToView, setAllowedToView] = useState(true);
    const [guestViewCount, setGuestViewCount] = useState(()=> getViewedList().length);

    // load authentication status once....
    useEffect(()=> {
        let mounted = true;
        (async ()=> {
            const auth = await checkAuthStatus();
            if(!mounted) return;
            setIsAuthenticated(auth);

        })();
        return () => {mounted = false};
    },[]);

    // run when listing loads
    useEffect(()=> {
        if(isAuthenticated === null) return;
        if(isAuthenticated){
            setAllowedToView(true);
            return;
        }
        // guest path
        const ok = canViewAsGuest(listingId);
        setAllowedToView(ok);
        if(!ok && typeof openLoginModal === "function"){
            openLoginModal();
        }
    },[isAuthenticated, listingId, openLoginModal]);

    //helper to protect any button/action;
    const requireAuthForAction = useCallback(async (action) => {
        // reCheck auth quickly
        const auth = await checkAuthStatus();
        if(auth){
            return action();
        }
        // if guest, open login and return false
        if( typeof openLoginModal === "function") openLoginModal();
        return false;
    },[openLoginModal]);

    return {
        isAuthenticated,
        allowedToView,
        guestViewCount,
        requireAuthForAction,
        MAX_FREE_VIEWS
    };

}