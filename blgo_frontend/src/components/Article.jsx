import React, { useContext, useEffect, useState } from "react";
import Navbar from "./HomePage/NavBar";
import "../statics/styles.css";
import { ArticleContext } from "../App";
import { useParams } from "react-router-dom";
import { showPost, deletePost } from "../api/postApi";
import { useNavigate } from "react-router-dom";
// import data from '../statics/DummyData.json';

function Article() {
  // const jsondata = data[6];
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [articleDetails, setArticleDetails] = useState(null);
  const { articleContent } = useContext(ArticleContext);

  const navigate = useNavigate();
  const convertToArr = (str) => {
    if (!str) return [];
    return str.split(",");
  };

  // Formatting data
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date";

    // Get day as number (1-31)
    const day = date.getDate();

    // Get month name in uppercase (JAN, FEB, etc.)
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();

    // Get full year (2024, 2025, etc.)
    const year = date.getFullYear();

    // Return formatted date string
    return `${day} ${month} ${year}`;
  };

  const removeHTMLTags = (htmlString) => {
    if (!htmlString) return "";
    // Remove opening and closing h1 tags
    let cleanString = htmlString 
      .replace(/<h1[^>]*>/gi, "")
      .replace(/<\/h1>/gi, "");
    return cleanString;
  };

  useEffect(() => {
    if (articleContent) {
      setArticleDetails(articleContent);
    } else {
      fetchArticleData();
    }
    // removeHTMLTags(articleDetails.postArticle)

    console.log("ARTICLE FETCHED FRONTEND: ", articleDetails );
  }, []);

  const fetchArticleData = async () => {
    try {
      setIsLoading(true);
      const response = await showPost(postId);
      setArticleDetails(response);
    } catch (error) {
      console.error("Error fetching article:", error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading article...</div>;
  }

  if (!articleDetails) {
    return <div>Article not found</div>;
  }

  const handleDeletePost = async (postId) => {
    try {
      const response = await deletePost(postId);
      navigate("/api/profile/my-stories");
      alert(response.message || "Post deleted successfully!!");
    } catch (error) {
      console.log("error while deleting post", error);
    }
  };


  const handleEditPost = async(postId) => {
    try {
      navigate(`/api/edit/${postId}`);

    } catch (error) {
      alert(error.response?.data?.messages);

    }
  }

  return (
    <div className="flex flex-col flex-1 h-screen gap-4">
      <Navbar />
      <div className="flex flex-1 w-full md:items-center md:justify-center p-4">
        <div className="flex flex-col md:w-1/2 h-auto md:items-center gap-10">

          {/*Header*/}
          <div className="flex flex-col w-full md:h-[35%] p-4 gap-4">
            <h1 className="font-bold text-5xl">
              <div
                dangerouslySetInnerHTML={{ __html: articleDetails.postTitle }}
              />
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-normal text-lg text-black">
                {articleDetails.postAuthor} |
                <span className="text-sm text-gray-500">
                  {formatDate(articleDetails.postPublishDate)}
                </span>
              </span>
            </div>
            <div>

              <div className="flex flex-row justify-between">

                {/* Fav */}
                <span className="flex text-base gap-1">
                  <span className="material-symbols-outlined" id="articleHeart">
                    favorite
                  </span>
                  <span className="top-[-2px] relative">
                    {articleDetails.postLikeCount}
                  </span>
                </span>

                {/* Edit post */}
                {articleDetails.postOwner && (
                  <span className="flex justify-center items-center gap-5"
                  onClick={()=>handleEditPost(articleDetails.postId)}
                  >
                    <span className="material-symbols-outlined cursor-pointer">
                      edit_note
                    </span>

                    {/* Delete post */}
                    <span
                      className="material-symbols-outlined cursor-pointer"
                      onClick={() => handleDeletePost(articleDetails.postId)}
                    >
                      delete
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/*Image*/}
          <div className="flex h-[30rem] bg-red-300 w-full items-center justify-center">
            <img
              className="object-cover w-full h-full"
              src={
                articleDetails.postCoverImg ||
                "https://blog.tubikstudio.com/wp-content/uploads/2021/06/european-places-nature-illustration-8.jpg"
              }
              alt={removeHTMLTags(articleDetails.postTitle)}
            />
          </div>
          
          {/*Content*/}
          <div className="flex w-full text-lg h-auto p-4 px-4 items-center text-left">
            <div   className="article-body list-disc pl-6"
              dangerouslySetInnerHTML={{ __html: articleDetails.postArticle}}

            />
          </div>

          {/* Tags */}
          <div className="flex w-full gap-6 flex-wrap">
            {convertToArr(articleDetails.postTags).map((tag, index) => (
              <span
                key={index}
                className="flex text-black bg-[#e3e3e3] w-fit text-base border-[1px] px-6 py-[0.4rem] rounded-3xl"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
