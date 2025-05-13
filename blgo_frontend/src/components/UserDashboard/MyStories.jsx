import React, { useContext, useEffect, useState } from "react";
import { getPost, showPost } from "../../api/postApi";
import { useNavigate } from "react-router-dom";
import { ArticleContext } from "../../App";

function MyStories() {
  const [postData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setArticleContent } = useContext(ArticleContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const postResponse = await getPost();
        console.log(
          postResponse.map((post, index) => {
            console.log(post.postId);
            return index; // Return value for map function
          })
        );
        setPostData(postResponse);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
        console.log(error.response?.data?.status);
        return error.response?.data;
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleStoryClick = async (postId) => {
    try {
      //this will give the data which i have to pass on article
      const response = await showPost(postId);
      console.log("HandleStoryclick response", response);
      setArticleContent(response);
      navigate(`/api/article/${postId}`);
    } catch (error) {
      alert("Error in opening the article", error?.response?.message);
    }
  };

   //formatting date and text
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

const truncateData = (text, wordLimit) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) {
    return `${text}`;
  }
  return words.slice(0, wordLimit).join(" ") + "...";
};

console.log(isLoading);

  return (
    <div className="items-start">

    <div className="flex flex-col w-full flex-1 items-center justify-center">
      <div className="flex flex-wrap gap-8 items-left">
        {postData.length === 0 ? (
          <div>No post found, Write something!!!</div>
        ) : (
          postData.map((post, index) => (
            <div
              key={post.postId || index}
              className="flex flex-col w-1/4 md:min-w-72 cursor-pointer"
              onClick={() => handleStoryClick(post.postId)}
            >
              {/*img*/} 
              <div className="flex h-44 rounded-md">
                <img
                  className="object-cover max-h-full w-full rounded-2xl aspect-square"
                  src={
                    post.postCoverImg ||
                    "https://blog.tubikstudio.com/wp-content/uploads/2021/06/european-places-nature-illustration-8.jpg"
                  }
                  alt={post.postTitle}
                />
              </div>
              {/* text */}
              <div className="flex flex-col py-2 justify-center gap-1">
                <span className="font-normal text-xl"
                 dangerouslySetInnerHTML = {{ __html:truncateData(post.postTitle,5)}}/>
                <span className="text-sm text-gray-400"
                dangerouslySetInnerHTML={{__html:truncateData(post.postArticle,10)}}
                >
                </span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined" id="calendar">
                    calendar_month
                  </span>
                  <span className="font-[600] text-xs">
                    {formatDate(post.postPublishDate) || "No date"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
      </div>
    </div>
  );
}

export default MyStories;
