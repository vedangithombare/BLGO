import axios from 'axios'

const baseURL = "http://localhost:8080";
//http://localhost:8080/register
const authUrl = {
    "register": `${baseURL}/register`,
    "login": `${baseURL}/login`,
}


//register
export const registerUser = async (userData) => {
    console.log(`name: ${userData.userName},email: ${userData.email}, password: ${userData.password}`);
    try {
        const response = await axios.post(authUrl.register, userData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        throw error;
    }
}

//login 
export const loginUser = async (userData) => {

    try {
        const response = await axios.post(authUrl.login, userData,{withCredentials:true});
        //returning user email after successfull login
        console.log(response);
        return response;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }


}


