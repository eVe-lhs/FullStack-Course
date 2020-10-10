import React, { useState } from "react";

const BlogForm = ({ add }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const onTitleChange = ({ target }) => {
    setTitle(target.value);
  };
  const onAuthorChange = ({ target }) => {
    setAuthor(target.value);
  };
  const onUrlChange = ({ target }) => {
    setUrl(target.value);
  };
  const addBlog = async (e) => {
    e.preventDefault();
    const blog = {
      title: title,
      author: author,
      url: url,
    };
    setTitle("");
    setAuthor("");
    setUrl("");
    add(blog);
  };
  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          title :
          <input
            id="title"
            type="text"
            onChange={onTitleChange}
            value={title}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            onChange={onAuthorChange}
            value={author}
          />
        </div>
        <div>
          url :<input id="url" type="text" onChange={onUrlChange} value={url} />
        </div>
        <div>
          <button onClick={addBlog}>Create</button>
        </div>
      </form>
    </div>
  );
};
export default BlogForm;
