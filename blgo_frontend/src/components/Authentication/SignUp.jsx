import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import "../../statics/styles.css";
import {registerUser} from "../../api/authApi";

function SignUp() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = {userName,email,password}
            const response = await registerUser(userData);
            console.log("signup response",response);
            alert("Successfully registered! redirecting to login");
            setTimeout(() => navigate('/login'), 2000);
        } catch (e) {
            alert(e.response?.data?.message);}

    }


    return (
        <div>
            <div className="flex flex-center items-center w-[75rem] h-[40rem] absolute left-0 ">
                <div className="object-cover w-full h-full ">
                </div>
            </div>
            {/*<div className="absolute inset-0 bg-black opacity-50"></div>*/}
            <div
                className="relative z-10 mx-auto my-10 w-[30rem] max-w-[90%] flex flex-col bg-white/90 rounded-[12px] shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Glad to have you here!</h2>
                        <p className="text-gray-500 mt-2">Join the community of writers and thinkers!</p>
                    </div>
                    <div className="text-center mt-4 font-bold">Sign Up</div>
                    {/*form*/}
                    <form onSubmit={onSubmit} className="flex flex-col mt-6 gap-4">
                        {/*email*/}
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-[10px] outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter your Name"
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-[10px] outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {/*password*/}
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-[10px] outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            required
                        />
                        <div className="flex flex-col text-xs text-gray-500 px-4 ">
                            <span className="font-bold">Password should contain:</span>
                            <ul className="list-disc ">
                                <li>A lowercase character</li>
                                <li>An uppercase character</li>
                                <li>A number</li>
                                <li>Minimum 8 characters</li>
                            </ul>
                        </div>
                        <button
                            className="bg-blue-600 text-white py-2 rounded-[12px] hover:bg-blue-700 transition-all"
                            type="submit"
                        >Sign Up
                        </button>
                    </form>

                    <div className="text-center my-4 ">
                        <div className="flex items-center gap-3">
                            <hr className="flex flex-1"/>
                            <span className="text-gray-500">OR</span>
                            <hr className="flex flex-1"/>
                        </div>
                        {/*Google Sign Up*/}
                        <div className="flex items-center justify-center">
                            {/*onClick={onGoogleSignIn}*/}
                            <button
                                className="flex items-center justify-center gap-2 bg-gray-100 p-3 mt-3 rounded-[10px]
                                text-gray-700 hover:bg-gray-200 transition-all">
                                <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                                     alt="Google Icon" className="w-5 h-5"/>
                                Sign Up with Google
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-500">
                            Already have an account?
                            <a href="/login"
                               className="text-blue-500 hover:underline">Log in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
