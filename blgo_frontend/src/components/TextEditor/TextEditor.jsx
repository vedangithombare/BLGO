import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "../../statics/styles.css";
import App from "./App.jsx";

function TextEditor({
  handleCurrentArticle,
  resetEditor,
  initialData,
  isEditMode,
}) {
  /* TODO : 
    CHECK WHICH MODE IS ON (WHICH BUTTON IS CLICKED) IS IT EDIT BUTTON OR WRTIE BUTTON IF
    IT IS EDIT BUTTON SHOW THE SAME VIEW BUT INSTEAD OF PUBLISH BUTTON SHOW UPDATE BUTTON 
    AND IF ITS WRITE BUTTON THEN SHOW NORMAL VIEW 
    WE HAVE TO TAKE THE CONTENT SET THE CONTENT IN THE PREVIOUS FORM AND THEN UPLOAD IT ON THE VIEW

    edit button click will come from article.jsx
    and write button click will come from navbar which is handled in handlePublishArticle

    when clicked on article.jsx edit button 
---> it will go to /api/edit(ie basically to write.jsx but here it should check where the request is coming from if its from /edit then the button should be update post )
---> we have to take all the data from the article.jsx and upload in the state of edit function ig so that we can put the data in the ckeditor text editor (have to do it with ref)
---> after putting the data in the text editor and also like the image and tags (idk what to do of them i mean it will be stored in the dabase so they are not going anywhere unless and until i changed it)
---> write a update function where the data is again going back in the database but on the same postid (here also check whats the userId of the person who is editing)
    */
  const [urlInput, setUrlInput] = useState(""); // taking url input
  const [coverImg, setCoverImg] = useState(""); // setting and getting the urls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const [saveTags, setSaveTags] = useState("");
  const [getTag, setTag] = useState("");

  const [getEditorData, setEditorData] = useState("");

  const [initialEditorData, setInitialEditorData] = useState("");

  const handleEditorData = (data) => {
    setEditorData(data);
    // console.log("GET EDITOR DATA : PARENT CLASS",getEditorData);
  };

  //UPDATE FUNCTIONALITY
  // setting the data into editor for editor mode
  useEffect(() => {
    if (isEditMode && initialData) {
      //set the editor data
      console.log("InitialData",initialData)
      const title = initialData.postTitle;
      const article = initialData.postArticle;
      const combineData = title+article;
      console.log("combine data",combineData);
      setInitialEditorData(combineData);

      if (initialData.coverImg) {
        setCoverImg(initialData.postCoverImg);
      }

      if (initialData.tags) {
        setSaveTags(initialData.postTags);
        setTag(initialData.postTags);
      }
    }
  }, [isEditMode, initialData]);

  // ***URL Upload***
  // getting image from device
  // trigger the click
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };
  const getCoverImgByDevice = (event) => {
    const file = event.target.files[0];
    if (file) {
      let coverUrl = URL.createObjectURL(file);
      setCoverImg(coverUrl);
    }
  };
  // getting images from url
  const getCoverImgByURL = () => {
    if (!urlInput) {
      return "enter valid URL";
    }
    setCoverImg(urlInput);
    setUrlInput("");
    setIsModalOpen(false);
  };

  // *** Add tags ***

  const handleAddTags = () => {
    let inputTags = getTag;
    if (!inputTags.trim()) return;
    //here we are getting the tags as a string
    // console.log("Input tags by user :", inputTags);
    //getting tags array
    //this is what will go in the article object
    let tagsArr = inputTags.split(",");
    setSaveTags(tagsArr.toString());
    setTag("");
    setIsTagModalOpen(false);
  };

  const handleTagModalOpen = () => {
    setIsTagModalOpen(true);
    setIsModalOpen(false);
  };
  const handleUrlModelOpen = () => {
    setIsTagModalOpen(false);
  };

  useEffect(() => {
    // console.log("COVER IMAGE URL :", coverImg);
    // console.log("tagsArr here im converting the tags string into tags array:", saveTags);
    // console.log("Editor data:",getEditorData);

    // gathering all the data in one place
    let currentArticle = {
      data: getEditorData,
      coverImg: coverImg,
      tags: saveTags,
    };

     // Log the size of the full article object
     console.log("Full article size:", JSON.stringify(currentArticle).length);

    if (isEditMode && initialData) {
      currentArticle.postId = initialData.postId;
    }

    console.log("Checking the current data", currentArticle);

    handleCurrentArticle(currentArticle);
  }, [coverImg, saveTags, getEditorData, isEditMode, initialData]);

  return (
    <div className="flex flex-col h-full gap-[57px] px-4 lg:py-[2px] lg:px-10">
      {/* Add cover and tag */}
      <div className="flex min-h-20 gap-4 lg:px-2">
        <div className="flex items-center gap-2">
          <Menu as="div" className="relative">
            <MenuButton
              className="flex items-center justify-center gap-1"
              onClick={handleUrlModelOpen}
            >
              <span className="material-symbols-outlined">
                add_photo_alternate
              </span>
              Add cover image
              <span className="material-symbols-outlined" id="downArrow">
                keyboard_arrow_down
              </span>
            </MenuButton>
            <MenuItems className="absolute z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <div
                      className={`block w-full px-4 py-2 text-sm text-left cursor-pointer ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={triggerFileInput}
                    >
                      Upload from device
                    </div>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`block w-full px-4 py-2 text-sm text-left ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Upload the URL
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">tag</span>
          <button onClick={handleTagModalOpen}>Add Tags</button>
        </div>
      </div>

      {/* File input */}
      <input
        id="fileInput"
        type="file"
        onChange={getCoverImgByDevice}
        className="hidden"
      />

      {/* URL Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Enter Image URL</h2>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 bg-gray-300 rounded align-middle cursor-pointer hover:bg-gray-400 "
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2  bg-zinc-950 rounded text-white align-middle cursor-pointer  hover:bg-black"
                onClick={getCoverImgByURL}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Add Tags*/}
      {isTagModalOpen && (
        <div className=" fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <input
              type="text"
              id="addTagsId"
              value={getTag}
              onChange={(e) => {
                setTag(e.target.value);
              }}
              className=" w-full p-2  rounded mb-4  outline-none"
              placeholder="Enter 4 tags seperated with comma (,)"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 bg-gray-300 rounded align-middle cursor-pointer hover:bg-gray-400   "
                onClick={() => setIsTagModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2  bg-zinc-950 rounded text-white align-middle cursor-pointer  hover:bg-black"
                onClick={handleAddTags}
              >
                Add Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex flex-1 h-[99%] flex-wrap flex-col">
        <App
         handleEditorData={handleEditorData}
         resetEditor={resetEditor} 
         initialData = {initialEditorData}
        />
      </div>
    </div>
  );
}

export default TextEditor;
