const validListOutput = `
1 local site found.
NAME        TYPE     LOCATION            URL                           STATUS          
fakedrupal  drupal7  ~/Downloads/drupal  http://fakedrupal.ddev.local  running
fakewordpress  wordpress  ~/Downloads/wordpress  http://wordpress.ddev.local  running

DDEV ROUTER STATUS: running
        
`;

const expectedSitesArray = [
    {
        name: 'fakedrupal',
        type: 'drupal7',
        path: '~/Downloads/drupal',
        url: 'http://fakedrupal.ddev.local',
        state: 'running'
    }, {
        name: 'fakewordpress',
        type: 'wordpress',
        path: '~/Downloads/wordpress',
        url: 'http://wordpress.ddev.local',
        state: 'running'
    }
];

const validStartOutput = "Successfully started drupaltest";
const invalidStartOutput = "Unable to start drupaltest";
const validStopOutput = "Application has been stopped.";
const invalidStopOutput = "Unable to stop drupaltest";
const validRestartOutput = "Successfully restarted drupaltest";
const invalidRestartOutput = "Unable to restart drupaltest";

module.exports.validListOutput = validListOutput;
module.exports.expectedSitesArray = expectedSitesArray;
module.exports.validStartOutput = validStartOutput;
module.exports.invalidStartOutput = invalidStartOutput;
module.exports.validStopOutput = validStopOutput;
module.exports.invalidStopOutput = invalidStopOutput;
module.exports.validRestartOutput = validRestartOutput;
module.exports.invalidRestartOutput = invalidRestartOutput;