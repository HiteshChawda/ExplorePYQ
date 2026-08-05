import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { getPosts } from "../pages/services/post.api";
import "../styles/Post.css";

const Posts = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {

        fetchPosts();

    }, []);

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
                                // currentUser={currentUser}
                            />

                        ))}

                    </div>

                    <div className="create-post">

                        <CreatePost fetchPosts={fetchPosts} />

                    </div>

                </div>

            </main>

            <Footer />

        </>

    );

};

export default Posts;