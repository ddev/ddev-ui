const validHostname = 'AVeryValidHostname';
const invalidHostname = 'Hostnames Cannot Have Spaces';
const validCMSType = 'wordpress';
const invalidCMSType = 'joomla';
const mockFileSystem = {
    '~/.ddev/CMS': {
        'drupal-7.0.tar.gz': '',
        'wordpress-7.0.0.tar.gz': ''
    }
};

module.exports.mockFileSystem = mockFileSystem;
module.exports.validHostname = validHostname;
module.exports.invalidHostname = invalidHostname;
module.exports.validCMSType = validCMSType;
module.exports.invalidCMSType = invalidCMSType;