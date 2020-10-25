import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
const Blogs = (props) => {
  return (
    <div>
      <h2>Blogs</h2>
      <Table striped bordered hover size="sm">
        <tbody>
          {props.blogs.map((blog) => (
            <tr key={blog.id}>
              <td className="blog_menu">
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
  };
};
export default connect(mapStateToProps)(Blogs);
