import React from 'react';
import electron from 'electron';

const placeholder = require('../../resources/imgs/placeholder.png');
const wordpress = require('../../resources/imgs/wordpress.png');
const drupal6 = require('../../resources/imgs/drupal6.png');
const drupal7 = require('../../resources/imgs/drupal7.png');
const drupal8 = require('../../resources/imgs/drupal8.png');
const php = require('../../resources/imgs/php.png');

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
        platformImg = drupal6;
        break;
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
