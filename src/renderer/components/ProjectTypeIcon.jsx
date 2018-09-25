import React from 'react';
import electron from 'electron';

const placeholder = require(`${__static}/img/placeholder.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const wordpress = require(`${__static}/img/wordpress.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const drupal7 = require(`${__static}/img/drupal7.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const drupal8 = require(`${__static}/img/drupal8.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const php = require(`${__static}/img/php.png`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
  if (type) {
    let platformImg = placeholder;
    switch (type) {
      case 'wordpress':
        platformImg = wordpress;
        break;
      case 'drupal6':
      case 'drupal7':
        platformImg = drupal7;
        break;
      case 'drupal8':
        platformImg = drupal8;
        break;
      case 'php':
        platformImg = php;
        break;
      default:
        break;
    }
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
  return (
    <a
      href="#!"
      className="open-site"
      onClick={e => {
        e.preventDefault();
        electron.shell.openExternal(httpurl);
      }}
    >
      <img alt="ddev logo" src={placeholder} className="platform-logo img-fluid" />
    </a>
  );
};

export default ProjectTypeIcon;
