const validHostname = 'AVeryValidHostname';
const invalidHostname = 'Hostnames Cannot Have Spaces';
const validCMSType = 'wordpress';
const invalidCMSType = 'joomla';
const mockFileSystem = {
  '~/.ddev/CMS': {
    'drupal-7.0.tar.gz': '',
    'wordpress-7.0.0.tar.gz': '',
  },
};

export { validHostname, invalidHostname, validCMSType, invalidCMSType, mockFileSystem };
