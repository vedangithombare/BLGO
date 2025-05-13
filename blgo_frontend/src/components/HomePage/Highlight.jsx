import React, { useContext } from "react";
import "../../statics/styles.css";
import { showPost } from "../../api/postApi";
import { ArticleContext } from "../../App";
import { useNavigate } from "react-router-dom";

function Highlight({
  highlightPost,
  truncateData,
  formatDate,
  removeHTMLTags,
}) {
  const { setArticleContent } = useContext(ArticleContext);
  const navigate = useNavigate();

  // Handle null highlightPost while data is loading
  if (!highlightPost) {
    return (
      <div className="flex w-full h-[560px] bg-gray-200 rounded-[1.5rem] justify-center items-center">
        Loading highlight post...
      </div>
    );
  }

  const convertToArr = (str) => {
    if (!str) return [];
    return str.split(",");
  };

  const handleArticleClick = async (postId) => {
    try {
      const response = await showPost(postId);
      setArticleContent(response);
      navigate(`/api/article/${postId}`);
    } catch (error) {
      alert(
        "Error in opening the article: " +
          (error?.response?.message || error.message)
      );
    }
  };

  return (
    <div>
      <div className="flex w-full flex-1 h-full bg-black rounded-[1.5rem] flex-col overflow-hidden md:flex-row md:h-[560px]">
        
        {/*Img*/}
        <div className="flex flex-[1] w-full">
          <img
            className="object-cover w-full"
            src={
              highlightPost.postCoverImg ||
              "https://blog.tubikstudio.com/wp-content/uploads/2021/06/european-places-nature-illustration-8.jpg"
            }
            alt={removeHTMLTags(highlightPost.postTitle)}
          />
        </div>

        {/*content*/}
        <div className="flex flex-col flex-1 justify-evenly p-6 gap-6 text-white rounded-r-[1.5rem]">

          {/*Tags*/}
          <div className="flex gap-4 flex-wrap">
            {convertToArr(highlightPost.postTags).map((tag, index) => {
              return (
                <span
                  key={index}
                  className="flex text-white border-white w-fit text-xs border-[1px] px-3 py-[0.3rem] rounded-[20px]"
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <div className="flex flex-col gap-8">

            {/*Heading*/}
            <div
              className="font-[600] text-5xl leading-[55px]"
              dangerouslySetInnerHTML={{
                __html: truncateData(highlightPost.postTitle, 10),
              }}
            >
              {/* {removeHTMLTags(highlightPost.postTitle)} */}
            </div>

            {/*Main Text*/}

            <div className="text-base items-center">
              <span
                dangerouslySetInnerHTML={{
                  __html: truncateData(highlightPost.postArticle, 10),
                }}
              />
              {/* {removeHTMLTags(highlightPost.postArticle)} */}
              <span
                className="font-bold text-lg shadow-xl shadow-white-500/50 cursor-pointer"
                onClick={() => handleArticleClick(highlightPost.postId)}
              >
                Read More
              </span>
            </div>

          </div>

          <div>
            {/*Date*/}
            <span className="text-sm font-[800]">
              {formatDate(highlightPost.postPublishDate)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Highlight;
