import React, { useEffect, useRef } from "react";
import blogService from "./services/blogs";
import LoginForm from "./components/loginForm";
import BlogForm from "./components/blogForm";
import Togglable from "./components/togglable";
import Notification from "./components/notification";
import Blog from "./components/Blog";
import Blogs from "./components/Blogs";
import Users from "./components/users";
import User from "./components/user";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { initBlogs } from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";
import { getUsers } from "./reducers/allUsers";
import { Navbar, Nav, Button } from "react-bootstrap";

const App = (props) => {
  const blogFormRef = useRef();
  const logout = () => {
    window.localStorage.removeItem("loggedUser");
    props.setUser(null);
  };
  const { initBlogs, setUser, getUsers } = props;
  useEffect(() => {
    initBlogs();
  }, [initBlogs]);
  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [setUser]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  if (!props.user) {
    return <LoginForm />;
  } else {
    return (
      <div className="container">
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Blogs</Nav.Link>
              <Nav.Link href="/users">Users</Nav.Link>
              <Navbar.Brand>{props.user.name} logged in</Navbar.Brand>
              <Button variant="danger" onClick={logout}>
                LogOut
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div>
          <Notification />
          <h2>Blog app</h2>
          <Switch>
            <Route
              path="/"
              exact
              render={() =>
                props.user ? (
                  <div>
                    <Togglable
                      buttonView="new blog"
                      buttonHide="Cancel"
                      ref={blogFormRef}
                    >
                      <BlogForm toggle={blogFormRef} />
                    </Togglable>
                    <div className="blogs">
                      <Blogs />
                    </div>
                  </div>
                ) : (
                  <Redirect to="/login" />
                )
              }
            ></Route>
            <Route
              path="/users"
              exact
              render={() => (props.user ? <Users /> : <Redirect to="/login" />)}
            />
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/users/:id">
              <User />
            </Route>
            <Route path="/blogs/:id">
              <Blog />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
};
const mapDispatchToProps = {
  initBlogs,
  setUser,
  getUsers,
};
const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
//  {
//    user ? (
//      <em>{user} logged in</em>
//    ) : (
//      <Link  to="/login">
//        login
//      </Link>
//    );
//  }
