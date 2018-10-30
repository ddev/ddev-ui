import React from 'react';
import electron from 'electron';

import * as placeholder from 'Media/placeholder.png';
import * as wordpress from 'Media/wordpress.png';
import * as drupal6 from 'Media/drupal6.png';
import * as drupal7 from 'Media/drupal7.png';
import * as drupal8 from 'Media/drupal8.png';
import * as php from 'Media/php.png';

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
