import React from "react";
import { connect } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { Table } from "react-bootstrap";

const User = (props) => {
  const match = useRouteMatch("/users/:id");
  const user = match
    ? props.users.find((user) => user.id === match.params.id)
    : null;

  if (!user) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h5> {user.name} </h5>
        <Table striped bordered size="sm" variant="light">
          <tbody>
            {user.blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
};
const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};
export default connect(mapStateToProps)(User);
