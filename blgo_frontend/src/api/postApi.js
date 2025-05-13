import axios from "axios";

const baseURL = "http://localhost:8080";
const postUrl = {
  publishPost: `${baseURL}/publish`,
  getPost: `${baseURL}/api/profile/my-stories`,
  likedPost: `${baseURL}/profile/liked-post`,
};

// Publishing posts
export const writePost = async (postData) => {
  try {
    const response = await axios.post(postUrl.publishPost, postData, {
      withCredentials: true,
    });
    console.log("WRITE POST RESPONSE DATA", response.data);
    return response.status;
  } catch (error) {
    console.error(
      "Failed publishing post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch posts for the respective authenticated user
export const getPost = async () => {
  try {
    const response = await axios.get(postUrl.getPost, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "ERROR IN FETCHING POSTS:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch post with specific post id
export const showPost = async (postId) => {
  let articleUrl = `${baseURL}/api/article/${postId}`;
  try {
    const response = await axios.get(articleUrl, { withCredentials: true });
    console.log("SHOW ARTICLE RESPONSE: ", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "ERROR IN showing article:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// displaying all the posts
export const showAllPosts = async () => {
  let allPostsUrl = `${baseURL}/api/home`;

  const response = await axios.get(allPostsUrl, { withCredentials: true });

  return response.data;
};

// Edit posts
export const editPost = async (postData, postId) => {
  // sending edited text
  const editPostUrl = `${baseURL}/api/edit/${postId}`;

  try {
    //  here the postData will be in form of postDisplayDTO i.e everything will be seperate
    const response = await axios.put(editPostUrl, postData, {
      withCredentials: true,
    });
    console.log("Response from backend for editing post", response);
    return response.status;
  } catch (error) {
    console.error(
      "error in updating post :",
      error.response?.data || error.message
    );
  }
};

// Fetching liked posts
export const likedPost = async (postData) => {
  try {
    const response = await axios.get(postUrl.likedPost, postData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// deleting post
export const deletePost = async (postId) => {
  const deletePostUrl = `${baseURL}/api/article/${postId}`;

  try {
    const response = await axios.delete(deletePostUrl, {
      withCredentials: true,
    });
    console.log("Response after deleting posts", response);
    return response.data;
  } catch (error) {
    console.log("Error deleting post", error);
    alert(
      `Error deleting post: ${error.response?.data?.message || error.message}`
    );
  }
};
