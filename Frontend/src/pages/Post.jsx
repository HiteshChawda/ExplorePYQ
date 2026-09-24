import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { getPosts } from "../pages/services/post.api";
import { useAuth } from "../context/AuthContext";
import "../styles/Post.css";

const Posts = () => {
    const { role } = useAuth();
    const isCreator = role === "creator";

    const [posts, setPosts] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        document.body.style.overflow = showCreate ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showCreate]);

    const fetchPosts = async () => {
        try {
            const response = await getPosts();
            setPosts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />

            <main className="posts-page">
                <div className="posts-layout">
                    <div className="posts-feed">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                fetchPosts={fetchPosts}
                            />
                        ))}
                    </div>

                    {isCreator && (
                        <div className="create-post">
                            <CreatePost fetchPosts={fetchPosts} />
                        </div>
                    )}
                </div>

                {isCreator && (
                    <button
                        className="post-fab"
                        type="button"
                        onClick={() => setShowCreate(true)}
                        aria-label="Open create post"
                    >
                        +
                    </button>
                )}

                {isCreator && showCreate && (
                    <div
                        className="post-modal-backdrop"
                        onClick={() => setShowCreate(false)}
                    >
                        <div
                            className="post-modal-card"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="post-modal-close"
                                type="button"
                                onClick={() => setShowCreate(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <CreatePost
                                fetchPosts={fetchPosts}
                                onPosted={() => setShowCreate(false)}
                            />
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
};

export default Posts;