import React, { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/loginForm";
import BlogForm from "./components/blogForm";
import Togglable from "./components/togglable";
import Blog from "./components/Blog";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errormessage, setErrorMessage] = useState("");
  const [successmessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();

  const onUsernameChange = ({ target }) => {
    setUsername(target.value);
  };
  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (e) {
      setErrorMessage(e.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };
  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisible();
    try {
      await blogService.addBlog(blog);
      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} is added`);
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      await blogService.getAll().then((blogs) => setBlogs(blogs));
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };
  const likeBlog = async (blog, id) => {
    try {
      await blogService.like(blog, id);
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    } catch (err) {
      setErrorMessage(err.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };
  const deleteBlog = async (id) => {
    try {
      await blogService.del(id);
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };
  const logout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };
  useEffect(() => {
    blogService.getAll().then((blogs) =>
      setBlogs(
        blogs.sort((a, b) => {
          return b.likes - a.likes;
        })
      )
    );
  }, []);
  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  return (
    <div>
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          errormessage={errormessage}
          onUsernameChange={onUsernameChange}
          onPasswordChange={onPasswordChange}
          username={username}
          password={password}
        />
      ) : (
        <div>
          <h2>blogs</h2>
          {successmessage === "" ? null : (
            <div className="success">{successmessage}</div>
          )}
          {errormessage === "" ? null : (
            <div className="error">{errormessage}</div>
          )}
          <p>
            {user.name} logged in <button onClick={logout}>Log Out</button>
          </p>
          <Togglable
            buttonView="new blog"
            buttonHide="Cancel"
            ref={blogFormRef}
          >
            <BlogForm add={addBlog} />
          </Togglable>
          <div className="blogs">
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                likeBlog={likeBlog}
                del={deleteBlog}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
