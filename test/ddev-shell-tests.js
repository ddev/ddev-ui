const ddevShell = require('../js/ddev-shell');
const {stubSpawnOnce} = require('stub-spawn-once');
const assert = require('assert');

const sitesList = `
1 local site found.
NAME        TYPE     LOCATION            URL                           STATUS          
fakedrupal  drupal7  ~/Downloads/drupal  http://fakedrupal.ddev.local  running
fakewordpress  wordpress  ~/Downloads/wordpress  http://wordpress.ddev.local  running

DDEV ROUTER STATUS: running
        
`;

describe('ddev-shell', function () {
    const expectedSitesList = [
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
    describe('#list()', function () {
        stubSpawnOnce('ddev list', 0, sitesList);
        it('should parse `ddev list` shell output and return an array of site objects', function () {
            return ddevShell.list().then(function fulfilled(result) {
                assert.equal(JSON.stringify(expectedSitesList), JSON.stringify(result));
            });
        });
    });
});