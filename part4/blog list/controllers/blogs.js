const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
  let data = null;
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  if (!request.body.likes) {
    data = {
      ...request.body,
      likes: 0,
      user: user._id,
    };
  } else {
    data = {
      ...request.body,
      user: user._id,
    };
  }
  const blog = new Blog(data);
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog.toJSON());
});

blogsRouter.delete("/:id", async (request, response) => {
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    await User.findByIdAndUpdate(decodedToken.id, {
      $pull: { blogs: request.params.id },
    });
    response.sendStatus(204).end();
  } else {
    response.status(401).json({ error: "Cannot delete this blog" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const data = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, data, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});
module.exports = blogsRouter;
