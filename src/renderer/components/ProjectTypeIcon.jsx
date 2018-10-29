import React from 'react';
import electron from 'electron';

import * as placeholder from '../../resources/imgs/placeholder.png';
import * as wordpress from '../../resources/imgs/wordpress.png';
import * as drupal6 from '../../resources/imgs/drupal6.png';
import * as drupal7 from '../../resources/imgs/drupal7.png';
import * as drupal8 from '../../resources/imgs/drupal8.png';
import * as php from '../../resources/imgs/php.png';

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
