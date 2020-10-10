import React, { useState } from "react";

const Blog = ({ blog, likeBlog, del }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const toggleVisible = () => {
    setVisible(!visible);
  };
  const like = async () => {
    const newBlog = {
      user: blog.user.id,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
    };
    likeBlog(newBlog, blog.id);
  };
  const remove = async () => {
    del(blog.id);
  };
  const [visible, setVisible] = useState(false);
  return (
    <div style={blogStyle} className="blog">
      <div className="blog_menu">
        {blog.title} {blog.author}
        <button onClick={toggleVisible}>
          {visible === false ? "view" : "hide"}
        </button>
      </div>
      {visible === false ? null : (
        <div className="blog_detail">
          <div>{blog.url}</div>
          <div>
            likes:<span className="likes">{blog.likes}</span>
            <button onClick={like} id="likeButton">
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          <div>
            <button onClick={remove}>remove</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
