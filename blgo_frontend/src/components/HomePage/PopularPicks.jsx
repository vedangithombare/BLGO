import React, { useContext } from "react";
import { showPost } from "../../api/postApi";
import { ArticleContext } from "../../App";
import { useNavigate } from "react-router-dom";

function PopularPicks({ getPopularPicks, truncateData }) {
  const { setArticleContent } = useContext(ArticleContext);
  const navigate = useNavigate();

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
    <div className="flex w-full flex-col p-4 ">
      <span className="font-bold text-2xl">Popular Picks</span>

      <div className="flex flex-col py-4 w-full h-[100%]">
        {getPopularPicks.map((post) => {
          return (
            <div
              className="flex flex-col w-full h-[8rem] justify-center "
              key={post.postId}
            >
              <div className=" flex flex-col gap-1">
                {/* Title */}
                <span
                  className="font-semibold text-[15px]"
                  dangerouslySetInnerHTML={{ __html: post.postTitle }}
                ></span>
                {/* Article */}
                <span
                  className="text-[12px]"
                  dangerouslySetInnerHTML={{ __html: truncateData(post.postArticle, 10),
                  }}
                ></span>
              </div>
              {/* Read more button */}
              <div
                className="flex flex-row items-center gap-3 cursor-pointer"
                onClick={() => handleArticleClick(post.postId)}
              >
                <hr className="flex flex-1" />
                <span>Read More</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PopularPicks;
