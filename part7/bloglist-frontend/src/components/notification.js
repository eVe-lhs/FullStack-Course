import React from "react";
import { connect } from "react-redux";

const Notification = (props) => {
  const notification = props.notification;
  if (notification) {
    if (notification.type === "success") {
      return <div className="success">{notification.notification}</div>;
    } else if (notification.type === "error") {
      return <div className="error">{notification.notification}</div>;
    }
  } else {
    return null;
  }
};

const mapStateToProps = (state) => {
  return { notification: state.notification };
};

export default connect(mapStateToProps)(Notification);
