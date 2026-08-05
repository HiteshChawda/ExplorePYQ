import { likePost, dislikePost } from "../pages/services/post.api";


const PostCard = ({ post, fetchPosts }) => {
  const handleLike = async () => {
    await likePost(post._id);
    fetchPosts();
  };

  const handleDislike = async () => {
    await dislikePost(post._id);
    fetchPosts();
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div>
          <h3>{post.owner.fullName}</h3>

          <small>@{post.owner.username}</small>

          <p>{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="post-content">{post.content}</div>

      {post.media.length > 0 &&
        post.media.map((item) =>
          item.type === "image" ? (
            <img key={item.publicId} src={item.url} alt="" />
          ) : (
            <video key={item.publicId} controls src={item.url} />
          ),
        )}

      <div className="post-footer">
        <button onClick={handleLike}>👍 {post.likes.length}</button>

        <button onClick={handleDislike}>👎 {post.dislikes.length}</button>
      </div>
    </div>
  );
};

export default PostCard;
