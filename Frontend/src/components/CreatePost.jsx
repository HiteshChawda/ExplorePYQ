import React, { useState } from "react";
import { createPost } from "../pages/services/post.api";

const CreatePost = ({ fetchPosts }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("content", content);

      for (let i = 0; i < files.length; i++) {
        formData.append("media", files[i]);
      }

      const response = await createPost(formData);

      alert(response.message);

      fetchPosts();

      setContent("");
      setFiles([]);
      setIsOpen(false);
    } catch (error) {
      console.log("Create Post Error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>Create Post (max 10mb)</h2>
        <span className={`toggle-icon ${isOpen ? "open" : ""}`}>▾</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`create-post-form ${isOpen ? "open" : ""}`}
      >
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(e.target.files)}
        />

        <button>Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;