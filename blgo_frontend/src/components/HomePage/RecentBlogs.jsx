import React, { useContext, useEffect, useState } from "react";
import { ArticleContext } from "../../App";
import { showPost } from "../../api/postApi";
import { useNavigate } from "react-router-dom";

function RecentBlogs({ allPosts, truncateData, formatDate, removeHTMLTags }) {
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const showInitialPosts = 9;
  const showMorePosts = 6;

  const { setArticleContent } = useContext(ArticleContext);
  const navigate = useNavigate();

  const loadMorePosts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleArticleClick = async (postId) => {
    try {
      const response = await showPost(postId);
      setArticleContent(response);
      navigate(`/api/article/${postId}`);
    } catch (error) {
      alert("Error in opening the article", error?.response?.message);
    }
  };

  useEffect(() => {
    // calculating the numbers to posts to show
    const totalPostsToShow =
      showInitialPosts + (currentPage - 1) * showMorePosts;

    // slicing the posts and making sure the minimum number of posts are displayed

    const postsToShow = allPosts.slice(
      0,
      Math.min(totalPostsToShow, allPosts.length)
    );
    // setting the posts into the visiblePosts
    setVisiblePosts(postsToShow);
  }, [allPosts, currentPage]);

  // this is to check if we have to show the load More button or not
  // if its false then the button will get hidden because all the posts are already shown
  const hasMorePosts = visiblePosts.length < allPosts.length;

  return (
    <div className="flex flex-1 w-full flex-col gap-4">
      <span className="font-bold text-4xl ">Recent Posts</span>
      <div className="flex flex-wrap gap-4">
        {/* Showing the visible posts */}
        {visiblePosts.map((post, index) => {
          return (
            <div
              className="flex  flex-col w-1/4 md:min-w-72 cursor-pointer"
              key={post.postId || index}
              onClick={() => handleArticleClick(post.postId)}
            >
              {/*Cover img*/}
              <div className="flex h-44 rounded-md">
                <img
                  className="object-cover max-h-full w-full rounded-2xl aspect-square"
                  src={
                    post.postCoverImg ||
                    "https://blog.tubikstudio.com/wp-content/uploads/2021/06/european-places-nature-illustration-8.jpg"
                  }
                  alt={removeHTMLTags(post.postTitle)}
                />
              </div>
              {/* Title */}
              <div className="flex flex-col py-2 justify-center gap-1 ">
                <span
                  className=" font-normal text-xl"
                  dangerouslySetInnerHTML={{ __html:truncateData(post.postTitle,5) }}
                ></span>
                {/* Content */}
                <span
                  className="text-sm text-gray-400"
                  dangerouslySetInnerHTML={{
                    __html: truncateData(post.postArticle, 10),
                  }}
                >
                </span>
                {/* Author name and date */}
                <div className="flex flex-row ">
                  <span className="font-bold text-[0.8rem]">
                    {post.postAuthor} | {formatDate(post.postPublishDate)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
      </div>

      {hasMorePosts && (
        <div className="flex justify-center">
          <button
            className="bg-black text-white p-3 px-6 rounded-[14px]"
            onClick={loadMorePosts}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentBlogs;
