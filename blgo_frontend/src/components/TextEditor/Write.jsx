import React, { useCallback, useEffect, useState } from "react";
import "../../statics/styles.css";
import EditorNavBar from "./EditorNavBar";
import TextEditor from "./TextEditor";
import {showPost } from "../../api/postApi";
import { useParams, useLocation } from "react-router-dom";

function Write() {
  const [getCurrentArticle, setCurrentArticle] = useState({});
  const [resetEditor, setResetEditor] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postToEdit, setPostToEdit] = useState({});

  const { postId } = useParams();
  const location = useLocation();

  // reseting the editor 
  const resetEditorFun = useCallback(() => {
    setResetEditor(true);
    setTimeout(() => setResetEditor(false), 100);
  }, []);

  // this function is getting the currentArticle object from the texteditor.jsx file
  const handleCurrentArticle = useCallback((currentArticle) => {
    setCurrentArticle(currentArticle);
    // console.log("getCurrentArticle", getCurrentArticle);
  }, []);

  //handing the editing posts
  useEffect(() => {
    const handleEditPost = async () => {
      if (postId) {
        try {
          // showing the current data in the editor so that the user can edit the data
          const response = await showPost(postId);
          console.log("handleeditpost: postarticle ",response.postArticle);
          setPostToEdit(response);
          setCurrentArticle({
            article: response.postArticle,
            title: response.postTitle,
            tags: response.postTags,
            coverImg: response.postCoverImg,
            postId: response.postId,
          });
        } catch (error) {
          console.log("Failed to fetch the data", error);
          alert("Failed to fetch the data");
        }
      }
    };

    if (location.pathname.includes("/api/edit/") && postId) {
      setIsEditMode(true);
      handleEditPost();

    } else {
      setIsEditMode(false);
      setPostToEdit(null);
    }
    
  }, [location.pathname, postId]);

  return (
    <div className="flex flex-col p-2 w-full h-screen">
      {/*or else getting the onlick function here and passing the data here only*/}
      <EditorNavBar
        getCurrentArticle={getCurrentArticle}
        resetEditorFun={resetEditorFun}
        isEditMode={isEditMode}
        postId = {postId}
      />
      {/* getting data,coverimg,tags from textEditor and passing it to editor navbar*/}
      <TextEditor
        handleCurrentArticle={handleCurrentArticle}
        resetEditor={resetEditor}
        initialData = {postToEdit}
        isEditMode = {isEditMode}
      />
    </div>
  );
}

export default Write;
