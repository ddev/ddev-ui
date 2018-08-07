import React from 'react';

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
  if (type) {
    const platformImg = require(`${__static}/img/${type}.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
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
