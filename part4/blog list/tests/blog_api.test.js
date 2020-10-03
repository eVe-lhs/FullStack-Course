const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
var token = null;
beforeEach(async () => {
  const user = {
    username: "root",
    password: "sekret",
  };
  const login = await api.post("/api/login").send(user);
  token = login.body.token;
});
const Blog = require("../models/blog");
const User = require("../models/user");

describe("when there are initially saved blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(helper.blogs.length);
  });
  test("a specific author is within the returned notes", async () => {
    const response = await api.get("/api/blogs");

    const author = response.body.map((r) => r.author);
    expect(author).toContain("Michael Chan");
  });
});
//------------------------------------------------
describe("testing if id is defined", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("unique identifier is named id", async () => {
    const blogs = await helper.blogsInDB();
    const firstBlog = blogs[0];
    expect(firstBlog.id).toBeDefined();
  });
});
//------------------------------------------------
describe("adding new blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("succeeds with valid data", async () => {
    const newBlog = {
      title: "Facebook",
      author: "Mark",
      url: "facebook.com",
      likes: 100,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await helper.blogsInDB();
    expect(allBlogs.length).toBe(helper.blogs.length + 1);

    const author = allBlogs.map((b) => b.author);
    expect(author).toContain("Mark");
  });

  test("fail with 401 if token missing", async () => {
    const newBlog = {
      title: "Facebook",
      author: "Mark",
      url: "facebook.com",
      likes: 100,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const allBlogs = await helper.blogsInDB();
    expect(allBlogs.length).toBe(helper.blogs.length);
  });

  test("default likes value is 0 if missing", async () => {
    const newBlog = {
      title: "USA",
      author: "Donald",
      url: "usa.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await helper.blogsInDB();
    expect(allBlogs.length).toBe(helper.blogs.length + 1);

    const author = allBlogs.map((b) => b.author);
    expect(author).toContain("Donald");
  });

  test("blogs with missing data response with status 400", async () => {
    const newBlog = {
      author: "Donald",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(400);

    const allBlogs = await helper.blogsInDB();
    expect(allBlogs.length).toBe(helper.blogs.length);
  });
});
//-------------------------------------
describe("deleting a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const newBlog = {
      title: "Facebook",
      author: "Mark",
      url: "facebook.com",
      likes: 100,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog);
  });
  test("succeed with 204 if id is valid", async () => {
    const initialBlogs = await helper.blogsInDB();
    const blogToDelete = initialBlogs[0];
    await api
      .del(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const finalBlogs = await helper.blogsInDB();

    expect(finalBlogs.length).toBe(0);

    const titles = finalBlogs.map((blog) => blog.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
  test("fail with 400 if id is invalid", async () => {
    await api
      .del("/api/blogs/1234567")
      .set("Authorization", "Bearer " + token)
      .expect(400);
    const finalBlogs = await helper.blogsInDB();
    expect(finalBlogs.length).toBe(1);
  });
});
//--------------------------------------
describe("updating a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("successfully updated data", async () => {
    const blogs = await helper.blogsInDB();
    const blogToUpdate = blogs[0];
    const blogDataToUpdate = {
      title: "USA",
      author: "Donald",
      url: "usa.com",
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", "Bearer " + token)
      .send(blogDataToUpdate)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const finalBlogs = await helper.blogsInDB();
    expect(finalBlogs[0].title).toBe("USA");
  });
});
//user creation
describe("creating a new user with one user in db", () => {
  beforeEach(async () => {
    const passwordHash = await bcrypt.hash("sekret", 10);
    await User.deleteMany({});
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });
  test("user creation succeed with fresh username", async () => {
    const existingUsers = await helper.usersInDB();

    const newUser = {
      username: "lin",
      name: "linhtetswe",
      password: "lhs",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const finalUsers = await helper.usersInDB();
    expect(finalUsers.length).toBe(existingUsers.length + 1);

    const usernames = finalUsers.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("user creation fail with code 400 if username already exist", async () => {
    const existingUsers = await helper.usersInDB();

    const newUser = {
      username: "root",
      name: "linhtetswe",
      password: "lhs",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const finalUsers = await helper.usersInDB();
    expect(finalUsers.length).toBe(existingUsers.length);
  });

  test("user creation fail with code 400 if username is less than 3 characters", async () => {
    const existingUsers = await helper.usersInDB();

    const newUser = {
      username: "li",
      name: "linhtetswe",
      password: "lhs",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const finalUsers = await helper.usersInDB();
    expect(finalUsers.length).toBe(existingUsers.length);
  });

  test("user creation fail with code 400 if password is less than 3 characters", async () => {
    const existingUsers = await helper.usersInDB();

    const newUser = {
      username: "lin",
      name: "linhtetswe",
      password: "ls",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const finalUsers = await helper.usersInDB();
    expect(finalUsers.length).toBe(existingUsers.length);
  });

  test("user creation fail with code 400 if username missing", async () => {
    const existingUsers = await helper.usersInDB();

    const newUser = {
      name: "linhtetswe",
      password: "lhs",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const finalUsers = await helper.usersInDB();
    expect(finalUsers.length).toBe(existingUsers.length);

    const usernames = finalUsers.map((user) => user.username);
    expect(usernames).not.toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
