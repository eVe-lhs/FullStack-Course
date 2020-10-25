import React from "react";

const addBlog = ({ title, author, url, add }) => {
  return (
    <div>
      <div>
        title :<input type="text" value={title} />
      </div>
      <div>
        author:
        <input type="text" value={author} />
      </div>
      <div>
        url :<input type="text" value={url} />
      </div>
      <div>
        <button onSubmit={add}>Create</button>
      </div>
    </div>
  );
};
export default addBlog;
