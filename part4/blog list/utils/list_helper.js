var _ = require("lodash");
const dummy = (blog) => {
  return 1;
};
const totalLikes = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const reducer = (sum, item) => {
    return sum + item;
  };
  return blogs.length === 0 ? 0 : likes.reduce(reducer, 0);
};
const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((acc, cur) => (acc.likes > cur.likes ? acc : cur));
};
const mostBlog = (blogs) => {
  const blogCount = _.countBy(blogs, "author");
  const mostAuthor = Object.keys(blogCount).reduce((acc, cur) =>
    blogCount[acc] > blogCount[cur] ? acc : cur
  );
  const mostBlog = {
    author: mostAuthor,
    blogs: blogCount[mostAuthor],
  };
  return mostBlog;
};
const mostLike = (blogs) => {
  var authorLikes = {};
  blogs.map((blog) => {
    if (!authorLikes[blog.author]) {
      authorLikes[blog.author] = blog.likes;
    } else {
      authorLikes[blog.author] = authorLikes[blog.author] + blog.likes;
    }
  });
  const mostLikedAuthor = Object.keys(authorLikes).reduce((acc, cur) =>
    authorLikes[acc] > authorLikes[cur] ? acc : cur
  );
  return {
    author: mostLikedAuthor,
    likes: authorLikes[mostLikedAuthor],
  };
};
module.exports = { dummy, totalLikes, favoriteBlog, mostBlog, mostLike };
