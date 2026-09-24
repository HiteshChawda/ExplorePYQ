
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPosts, deletePost } from "./services/post.api";
import { getPyqs, deletePyq } from "./services/pyq.api";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { user, role, loading } = useAuth();

  const [myPosts, setMyPosts] = useState([]);
  const [myPyqs, setMyPyqs] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const postsRes = await getPosts();
      const pyqsRes = await getPyqs();

      setMyPosts(
        postsRes.data.filter(
          (p) => p.owner._id === user?._id
        )
      );

      setMyPyqs(
        pyqsRes.data.filter(
          (p) =>
            p.owner === user?._id ||
            p.owner?._id === user?._id
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      const response = await deletePost(postId);
      alert(response.message);
      loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  const handleDeletePyq = async (pyqId) => {
    if (!window.confirm("Delete this PYQ?")) return;

    try {
      const response = await deletePyq(pyqId);
      alert(response.message);
      loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (role !== "creator") {
    return <Navigate to="/home" />;
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">

        {/* Profile Header */}
        <section className="profile-header">
          <h2>My Profile</h2>

          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user?.fullName}
            </p>

            <p>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </section>

        {/* Posts + PYQs */}
        <section className="profile-columns">

          {/* My Posts */}
          <div className="profile-column">
            <h3>My Posts</h3>

            <div className="profile-list">
              {myPosts.length === 0 && (
                <p className="profile-empty">
                  No posts yet.
                </p>
              )}

              {myPosts.map((post) => (
                <div
                  key={post._id}
                  className="profile-item"
                >
                  <div className="profile-item-header">
                    <small>
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </small>

                    <button
                      className="profile-delete-btn"
                      onClick={() =>
                        handleDeletePost(post._id)
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>

                  <p>{post.content}</p>

                  {post.media?.length > 0 &&
                    post.media.map((item) =>
                      item.type === "image" ? (
                        <img
                          key={item.publicId}
                          src={item.url}
                          alt=""
                        />
                      ) : (
                        <video
                          key={item.publicId}
                          controls
                          src={item.url}
                        />
                      )
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* My PYQs */}
          <div className="profile-column">
            <h3>My PYQs</h3>

            <div className="profile-list">
              {myPyqs.length === 0 && (
                <p className="profile-empty">
                  No PYQs uploaded yet.
                </p>
              )}

              {myPyqs.map((pyq) => (
                <div
                  key={pyq._id}
                  className="profile-item"
                >
                  <div className="profile-item-header">
                    <small>
                      {new Date(
                        pyq.createdAt
                      ).toLocaleDateString()}
                    </small>

                    <button
                      className="profile-delete-btn"
                      onClick={() =>
                        handleDeletePyq(pyq._id)
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>

                  <p>
                    <strong>{pyq.branch}</strong>{" "}
                    — {pyq.subject}{" "}
                    (Sem {pyq.semester}, {pyq.year})
                  </p>

                  <a
                    href={pyq.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 View PDF
                  </a>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
};

export default Profile;

