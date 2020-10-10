import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const hideButton = { display: visible ? "none" : "" };
  const showForm = { display: visible ? "" : "none" };

  const toggleVisible = () => {
    setVisible(!visible);
  };
  useImperativeHandle(ref, () => {
    return { toggleVisible };
  });
  return (
    <div>
      <div style={hideButton}>
        <button onClick={toggleVisible}>{props.buttonView}</button>
      </div>
      <div style={showForm}>
        {props.children}
        <button onClick={toggleVisible}>{props.buttonHide}</button>
      </div>
    </div>
  );
});
Togglable.displayName = "Togglable";
Togglable.propTypes = {
  buttonView: PropTypes.string.isRequired,
  buttonHide: PropTypes.string.isRequired,
};

export default Togglable;
