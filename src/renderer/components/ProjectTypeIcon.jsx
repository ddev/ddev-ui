import React from 'react';
import electron from 'electron';
import fs from 'fs';

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
  const placeholderImg = require(`${__static}/img/placeholder.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
  if (type) {
    const pathToFile = `${__static}/img/${type}.png`; // eslint-disable-line no-undef
    if (fs.existsSync(pathToFile)) {
      const platformImg = require(`${__static}/img/${type}.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
      if (platformImg) {
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
    } else {
      return (
        <a
          href="#!"
          className="open-site"
          onClick={e => {
            e.preventDefault();
            electron.shell.openExternal(httpurl);
          }}
        >
          <img alt="ddev logo" src={placeholderImg} className="platform-logo img-fluid" />
        </a>
      );
    }
  }
  return null;
};

export default ProjectTypeIcon;
