import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/HomePage/Main";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/SignUp";
import Write from "./components/TextEditor/Write";
import Profile from "./components/UserDashboard/Profile";
import MyStories from "./components/UserDashboard/MyStories";
import LikedPosts from "./components/UserDashboard/LikedPosts";
import Article from "./components/Article";
import ProtectedLayout from "./components/Authentication/ProtectedLayout";
import { useEffect, useState, createContext } from "react";


export const ArticleContext = createContext();

function App() {
  // Authentication states
  const [checkAuth, setCheckAuth] = useState(null);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [showName,setShowName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [articleContent,setArticleContent] = useState(null);

  const verifyAuthUrl = "http://localhost:8080/verify-auth";

  // Token verification effect - runs once when the component mounts
  useEffect(() => {

    const verifyToken = async () => {
      try {
        setIsLoading(true);
        console.log("Starting token verification...");

        const response = await axios.get(verifyAuthUrl,{withCredentials:true});

        console.log("Verification response status:", response.status);
        
        if (response.status === 200) {
          const data = response.data;
          console.log("Verification successful data:", data);
          setCheckAuth(200);
          setUserAuthenticated(true);
          setShowName(data.userName);
        } else {
          console.log("Verification failed with status:", response.status);
          const errorData = await response.text();
          console.log("Error details:", errorData);
          setCheckAuth(response.status);
          setUserAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication verification error:", error);
        setCheckAuth(null);
        setUserAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, []);

  // Secondary effect for when checkAuth changes (e.g., after login)
  useEffect(() => {
    if (checkAuth === 200) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
      console.log(checkAuth);
      console.log("Unauthorized access, redirecting to login");
    }
  }, [checkAuth]);


  // Resetting all the states
  const handleLogOut = () =>{

    setShowName("");
    setUserAuthenticated(false);
    setCheckAuth(null);
  }

  // Show a loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or replace with a loading spinner component
  }

  return (
    <ArticleContext.Provider value={{articleContent,setArticleContent}}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            userAuthenticated ? (
              <Navigate to="/api/home" />
            ) : (
              <Login setCheckAuth={setCheckAuth}  />
            )
          }
        />
        <Route
          path="/signup"
          element={userAuthenticated ? <Navigate to="/api/home" /> : <Signup />}
        />

        <Route
          path="/"
          element={<Navigate to={userAuthenticated ? "/api/home" : "/login"} />}
        />

        <Route
          element={<ProtectedLayout userAuthenticated={userAuthenticated} />}
        >
          <Route path="/api/home" element={<Main showName={showName} />} />
          {/* Publishing post or editing post */}
          <Route path="/api/write" element={<Write />} /> 
          <Route path="/api/edit/:postId" element = {<Write/>}/>
          
          <Route path="/api/profile" element={<Profile showName={showName} handleLogOut= {handleLogOut} />}>
            <Route path="my-stories" element={<MyStories />}></Route>
            <Route path="liked-posts" element={<LikedPosts />}></Route>
          </Route>
          <Route path="/api/article/:postId" element={<Article />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </ArticleContext.Provider>
  );
}

export default App;
