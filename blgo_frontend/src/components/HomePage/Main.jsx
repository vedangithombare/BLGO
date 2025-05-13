import React, { useEffect, useState } from "react";
import "../../statics/styles.css";
import Highlight from "./Highlight.jsx";
import PopularPicks from "./PopularPicks";
import RecentBlogs from "./RecentBlogs.jsx";
import NavBar from "./NavBar.jsx";
import data from "../../statics/DummyData.json";
import { showAllPosts } from "../../api/postApi.js";
//main file maybe home file

function Main(props) {
  const jsondata = data;
  console.log("jsondata MAIN", jsondata);
  const [allPosts, setAllPosts] = useState([]);
  const [highlightPost, setHighlightPost] = useState(null);
  const [getPopularPicks,setPopularPicks] = useState([]);

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

  const removeHTMLTags = (htmlString) => {
    if (!htmlString) return "";
    // Remove opening and closing h1 tags
    let cleanString = htmlString
      .replace(/<h1[^>]*>/gi, "")
      .replace(/<\/h1>/gi, "");
    return cleanString;
  };

 
  const truncateData = (text, wordLimit) => {
    const words = text.split(" ");

    if (words.length <= wordLimit) {
      return `${text}`;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  };



  const getAllPosts = async () => {
    let posts = await showAllPosts();
    console.log("POSTS: ", posts);
    setAllPosts(posts);
    selectHighlightPost(posts);
    popularPicks(posts);
  };

  // Select a highlight post that changes every 12 hours
  const selectHighlightPost = (posts) => {
    if (!posts || posts.length === 0) return;

    // Check if we have a stored post and timestamp
    const storedHighlight = localStorage.getItem("highlightPost");
    const storedTimestamp = localStorage.getItem("highlightTimestamp");

    const currentTime = new Date().getTime();
    const twelveHoursMs = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    // If we have a stored post and less than 12 hours have passed, use it
    if (
      storedHighlight &&
      storedTimestamp &&
      currentTime - parseInt(storedTimestamp) < twelveHoursMs
    ) {
      setHighlightPost(JSON.parse(storedHighlight));
    } else {
      // Select a random post
      const randomIndex = Math.floor(Math.random() * posts.length);
      const selectedPost = posts[randomIndex];

      // Store the post and timestamp
      setHighlightPost(selectedPost);
      localStorage.setItem("highlightPost", JSON.stringify(selectedPost));
      localStorage.setItem("highlightTimestamp", currentTime.toString());
    }
  };

  const popularPicks = (posts) =>{
    if (posts && posts.length > 0) {
        // Get 3 random posts for popular picks
        const getRandomPosts = () => {
          const shuffled = [...posts].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, 3);
        };
        
        setPopularPicks(getRandomPosts());
      }

  }
  

  useEffect(() => {
    getAllPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex w-[99%] ">
        <NavBar showName={props.showName}/>
      </div>

      <div className="flex w-[99%] flex-1 h-full p-2 gap-8 flex-col md:p-8 lg:flex-row">
        <div className="flex flex-col flex-[3] gap-8 h-full">
          <Highlight highlightPost={highlightPost} truncateData={truncateData} removeHTMLTags={removeHTMLTags} formatDate={formatDate} />
          <RecentBlogs allPosts={allPosts} truncateData={truncateData} removeHTMLTags={removeHTMLTags} formatDate={formatDate}/>
        </div>
        <div className="flex flex-1">
          <PopularPicks getPopularPicks={getPopularPicks} truncateData={truncateData} />
        </div>
      </div>
    </>
  );
}

export default Main;
