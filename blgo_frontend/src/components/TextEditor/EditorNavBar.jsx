import React from "react";
import "../../statics/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { editPost, writePost } from "../../api/postApi";

function EditorNavBar(props) {
  const navigate = useNavigate();

  //publising the post here
  const handlePublishArticle = async (event) => {
    event.preventDefault();
    try {
      console.log("props.getcurrentdata ", props.getCurrentArticle);
      console.log("Data being sent size:", 
        JSON.stringify(props.getCurrentArticle).length);
      const response = await writePost(props.getCurrentArticle);
      // console.log(response);
      console.log("Payload being sent:", props.getCurrentArticle);
      alert("Successfully published!");
      navigate("/api/profile/my-stories");
      props.resetEditorFun();
      return response;
    } catch (e) {
      console.log("props.getcurrentdata ", props.getCurrentArticle);
      alert(e.response?.data?.messages);
    }
  };


  const handleEditArticle = async (event) => {
    event.preventDefault();
    try {
      const postData = props.getCurrentArticle;
      const postId = props.postId; 
      const response = await editPost(postData, postId);
      console.log("which data is going into the backend:", postData);
      alert("Successfully updated post!!");
      navigate("/api/profile/my-stories")
      return response;
    } catch (error) {
      alert(error.response?.data?.messages);
    }
  };
  return (
    // bg-red-300
    <div className="flex px-6  pb-4 md:px-12 items-center  ">
      <Link to="/home">
        <div className=" flex flex-row  items-center md:gap-1">
          <span className="material-symbols-outlined" id="logo">
            keyboard_command_key
          </span>
          <span className=" hidden  md:contents md:text-2xl md:font-extrabold">
            BLGO
          </span>
        </div>
      </Link>

      <div className="flex w-full p-2 justify-center gap-5 items-center lg:px-10 lg:justify-end ">
        
        {/*                 
                <button className=" flex items-center rounded-xl px-2 hover:bg-[#ebecef] md:px-4 md:py-2 md:gap-1">
                    <span className="material-symbols-outlined">preview</span>Preview
                </button>
         */}

        {/* Need to change this button according to the url if it /edit or /write */}

        {props.isEditMode ? (
          <>
            <button
              className=" flex items-center rounded-xl px-2 hover:bg-[#ebecef] md:px-4 md:py-2 md:gap-1"
              onClick={handleEditArticle}
            >
              <span className="material-symbols-outlined">edit_note</span>Update
            </button>
          </>
        ) : (
          <>
            <button
              className=" flex items-center rounded-xl px-2 hover:bg-[#ebecef] md:px-4 md:py-2 md:gap-1"
              onClick={handlePublishArticle}
            >
              <span className="material-symbols-outlined">publish</span>Publish
            </button>
          </>
        )}

        <button
          className=" flex items-center px-3 py-2  bg-emerald-400 rounded-3xl hover:bg-white md:px-5 md:py-2 md:gap-2 "
          onClick={() => navigate("/api/profile")}
        >
          <span className="material-symbols-outlined">account_circle</span>
          Profile
        </button>
      </div>
    </div>
  );
}

export default EditorNavBar;
