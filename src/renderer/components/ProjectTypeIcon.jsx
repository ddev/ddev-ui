import React from "react";

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
  if (type) {
    return (
      <a
        href="#!"
        className="open-site"
        onClick={e => {
          e.preventDefault();
          electron.shell.openExternal(httpurl);
        }}
      >
        <img
          alt="ddev logo"
          src={`/img/${type}.png`}
          className="platform-logo img-fluid"
        />
      </a>
    );
  } else {
    return null;
  }
};

export default ProjectTypeIcon;
