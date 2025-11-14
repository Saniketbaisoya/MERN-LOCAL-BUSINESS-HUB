export async function checkAuthStatus(){
    try {
            const res = await fetch('/api/check',{
            method : 'GET',
            credentials : 'include', // important send-cookies
            headers : {
                "Content-Type" : "application/json"
            }

            });
            if(!res.ok) return false;
            const data = await res.json();
            return !!data.authenticated;
        
    } catch (error) {
        console.error("Auth check failed:", error);
        return false;
    }
}