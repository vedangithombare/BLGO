import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Sidebar({handleLogOut}) {
  const logOutUrl = "http://localhost:8080/logout";
  const navigate = useNavigate();

  //logout functionality
  const logOut = async () => {
    try {
      const response = await axios.post(logOutUrl, {}, {withCredentials: true});
      handleLogOut(); 
      navigate("/login");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert("Error logging out: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-col min-w-60 p-8 px-4">
      <ul className="flex flex-col h-full items-left p-4 gap-3 ">
        {/* My- stories */}
        <li className="flex flex-row items-center gap-2 p-2 px-4 rounded-xl hover:bg-[#f3f5f7]">
          <span className="material-symbols-outlined">library_books</span>
          <Link
            to="/api/profile/my-stories"
            className="flex items-center justify-center"
          >
            My Stories
          </Link>
        </li>
        {/* Liked posts */}
        <li className="flex flex-row items-center gap-2 p-2 px-4 rounded-xl hover:bg-[#f3f5f7]">
          <span className="material-symbols-outlined">favorite</span>
          <Link
            to="/profile/liked-posts"
            className="flex items-center justify-center "
          >
            Liked Posts
          </Link>
        </li>
        {/* Settings */}
        <li className="flex flex-row items-center gap-2 p-2 px-4 rounded-xl hover:bg-[#f3f5f7]">
          <span className="material-symbols-outlined">settings</span>
          <button className=" flex items-center justify-center">
            Settings
          </button>
        </li>
        {/* Logout */}
        <li className="flex flex-row items-center gap-2 p-2 px-4 rounded-xl hover:bg-[#f3f5f7] ">
          <span className="material-symbols-outlined">logout</span>
          <button 
          onClick={logOut}
          className="flex items-center justify-center ">Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
