import blogService from "../services/blogs";

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "LIKE": {
      return state.map((blog) =>
        blog.id === action.likedBlog.id ? action.likedBlog : blog
      );
    }
    case "COMMENT": {
      return state.map((blog) =>
        blog.id === action.commentedBlog.id ? action.commentedBlog : blog
      );
    }
    case "ADD_BLOG":
      return action.blogs;
    case "DELETE_BLOG":
      return action.blogs;
    default:
      return state;
  }
};
export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({
      type: "INIT_BLOGS",
      data: blogs,
    });
  };
};
export const like = (blog) => {
  return async (dispatch) => {
    const newObject = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };
    const likedBlog = await blogService.like(newObject, blog.id);
    dispatch({
      type: "LIKE",
      likedBlog,
    });
  };
};
export const comment = (blog, comment) => {
  return async (dispatch) => {
    const newObject = {
      comment,
    };
    const commentedBlog = await blogService.comment(blog.id, newObject);
    console.log(commentedBlog);
    dispatch({
      type: "COMMENT",
      commentedBlog,
    });
  };
};
export const addBlog = (blog) => {
  return async (dispatch) => {
    await blogService.addBlog(blog);
    const blogs = await blogService.getAll();
    dispatch({
      type: "ADD_BLOG",
      blogs,
    });
  };
};
export const remove = (id) => {
  return async (dispatch) => {
    await blogService.del(id);
    const blogs = await blogService.getAll();
    dispatch({
      type: "DELETE_BLOG",
      blogs,
    });
  };
};

export default blogReducer;
