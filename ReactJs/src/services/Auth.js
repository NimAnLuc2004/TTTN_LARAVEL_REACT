const getAuthToken = () => {
    try {
        return JSON.parse(localStorage.getItem("token")); 
    } catch (e) {
        return localStorage.getItem("token"); 
    }
};
export { getAuthToken };