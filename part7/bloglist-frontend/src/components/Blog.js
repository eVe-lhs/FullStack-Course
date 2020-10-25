import React, { useState } from "react";
import { connect } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { like, remove, comment } from "../reducers/blogReducer";
import { setNoti } from "../reducers/notificationReducer";
import { Button, Table, Form } from "react-bootstrap";

const Blog = (props) => {
  const [comment, setComment] = useState("");
  const onCommentChange = (e) => {
    setComment(e.target.value);
  };
  const likeBlog = async (blog) => {
    try {
      await props.like(blog);
      props.setNoti(
        `liked the blog ${blog.title}`,
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
  const deleteBlog = async (id) => {
    try {
      await props.remove(id);
      props.setNoti(
        `deleted the blog ${props.blog.title}`,
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
  const match = useRouteMatch("/blogs/:id");
  const blog = match
    ? props.blogs.find((blog) => blog.id === match.params.id)
    : null;
  const commentBlog = async (event) => {
    event.preventDefault();
    try {
      await props.comment(blog, comment);
      props.setNoti(
        `commented on the blog`,
        5,
        props.notification.timeout,
        "success"
      );
    } catch (err) {
      console.log(err);
      props.setNoti(
        err.response.data.error,
        5,
        props.notification.timeout,
        "error"
      );
    }
  };
  if (!blog) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div>
          <div className="blog_menu">
            <h3>
              {blog.title} {blog.author}
            </h3>
          </div>

          <div className="blog_detail">
            <a href={`${blog.url}`}>{blog.url}</a>
            <div>
              <span className="likes">{blog.likes}</span> likes
              <Button onClick={() => likeBlog(blog)} id="likeButton">
                like
              </Button>
            </div>
            <div>added by {blog.user.name}</div>
            <div>
              <Button onClick={() => deleteBlog(blog.id)}>remove</Button>
            </div>
          </div>
          <div>
            <h4>Comments</h4>
            <Form onSubmit={commentBlog}>
              <Form.Control
                id="comment"
                type="text"
                onChange={onCommentChange}
                value={comment}
              />
              <Button type="submit"> Add Comment </Button>
            </Form>
            {blog.comments.length !== 0 ? (
              <Table bordered size="sm" variant="light">
                <tbody>
                  {blog.comments.map((comment) => (
                    <tr key={comment}>
                      <td className="blog_menu">{comment}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div>No comments</div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
const mapDispatchToProps = {
  like,
  remove,
  setNoti,
  comment,
};
const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    notification: state.notification,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Blog);
