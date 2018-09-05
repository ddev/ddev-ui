import React from 'react';
import electron from 'electron';
import fs from 'fs';

const placeholderImg = require(`${__static}/img/placeholder.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const wordpress = require(`${__static}/img/wordpress.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const drupal7 = require(`${__static}/img/drupal7.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const drupal8 = require(`${__static}/img/drupal8.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const php = require(`${__static}/img/php.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
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
