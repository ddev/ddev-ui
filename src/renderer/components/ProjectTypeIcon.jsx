import React from 'react';

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
  if (type) {
    const platformImg = require(`${__static}/img/${type}.png`);
    return (
      <a
        href="#!"
        className="open-site"
        onClick={e => {
          e.preventDefault();
          electron.shell.openExternal(httpurl);
        }}
      >
        <img alt="ddev logo" src={platformImg} className="platform-logo img-fluid" />
      </a>
    );
  }
  return null;
};

export default ProjectTypeIcon;
