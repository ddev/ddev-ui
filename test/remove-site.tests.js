const fixtures = require('./remove-site-fixtures');
const rewire = require('rewire');
const chai = require('chai');
const spies = require('chai-spies');
require('jsdom-global')();

/*describe('remove-site', function () {
    chai.use(spies);
    const expect = chai.expect;
    let remove_site = rewire('../js/remove-site');
    let mockRemove = function(){
        var promise = new Promise((resolve, reject) => {

        });
        return promise;
    };
    let ddevShellMock = {
        remove: mockRemove
    };
    remove_site.__set__('ddevShell', ddevShellMock);
    var removeSite = remove_site.__get__('removeSite');

    describe('#removeSite()', function () {
        it('should call ddevShell module and attempt to exec `ddev remove` from path with no remove flag', function () {
            removeSite(fixtures.removeProjectArray);

            expect(ddevShellMock.ddevShell).to.be.spy;
            expect(ddevShellMock.ddevShell).to.have.been.called();
        });
    });
});
*/