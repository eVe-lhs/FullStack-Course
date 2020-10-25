import React, { useState } from "react";
import { connect } from "react-redux";
import { setNoti } from "../reducers/notificationReducer";
import { addBlog } from "../reducers/blogReducer";
import { Button, Form } from "react-bootstrap";

const BlogForm = (props) => {
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
  const add = async (event) => {
    event.preventDefault();
    setTitle("");
    setAuthor("");
    setUrl("");
    props.toggle.current.toggleVisible();
    const newBlog = {
      title,
      author,
      url,
    };
    try {
      await props.addBlog(newBlog);
      props.setNoti(
        `a new blog ${newBlog.title} added`,
        5,
        props.notification.timeout,
        "success"
      );
    } catch (err) {
      props.setNoti(
        err.response.data.error,
        5,
        props.notification.timeout,
        "error"
      );
    }
  };
  return (
    <div>
      <Form onSubmit={add}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            id="title"
            type="text"
            onChange={onTitleChange}
            value={title}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            id="author"
            type="text"
            onChange={onAuthorChange}
            value={author}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Url:</Form.Label>
          <Form.Control
            id="url"
            type="text"
            onChange={onUrlChange}
            value={url}
          />
        </Form.Group>
        <Form.Group>
          <Button
            onClick={() => props.toggle.current.toggleVisible()}
            variant="outline-secondary"
          >
            Cancel
          </Button>
          <Button onClick={add}>Create</Button>
        </Form.Group>
      </Form>
    </div>
  );
};
const mapDispatchToProps = {
  addBlog,
  setNoti,
};
const mapStateToProps = (state) => {
  return {
    notification: state.notification,
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BlogForm);
