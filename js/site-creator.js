var distroUpdater = require('./distro-updater');
var tarball = require('tarball-extract');
var ddevShell = require('./ddev-shell');

function validateHostname(hostname){
    var promise = new Promise(function(resolve, reject){
        var hostnameRegex = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9‌​]+)*))*$/;
        if(hostnameRegex.test(hostname.toLowerCase())){
            resolve(true);
        } else {
            var error = hostname ? 'Hostname is Invalid.' : 'Hostname Cannot Be Blank.';
            reject(error);
        }
    });
    return promise;
}

function validateCMSType(cmsType){
    var promise = new Promise(function(resolve, reject){
        var cmsString = cmsType.toLowerCase();
        if(cmsString === 'wordpress' || cmsString === 'drupal7' || cmsString === 'drupal8'){
            resolve(true);
        } else {
            var error = cmsType ? 'CMS Type is Invalid.' : 'CMS Type Cannot Be Blank.';
            reject(error);
        }
    });
    return promise;
}

function validateInstallPath(path){
    return distroUpdater.canReadAndWrite(path);
}

function getCMSPath(cmsType){
    var targetCMS;
    switch(cmsType) {
        case 'wordpress':
            targetCMS = ['wordpress',''];
            break;
        case 'drupal7':
            targetCMS = ['drupal',7];
            break;
        case 'drupal8':
            targetCMS = ['drupal',8];
            break;
        default:
            throw 'No CMS selected';
    }
    return distroUpdater.getCMSTarballPath(targetCMS[0],targetCMS[1]);
}

function unpackCMSTarball(tarballPath, outputPath) {
    var promise = new Promise(function(resolve,reject){
        tarball.extractTarball(tarballPath, outputPath, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(outputPath);
            }
        });
    });
    return promise;
}

function addCMS(name, type, targetPath) {
    showLoadingScreen(true);
    validateInputs(name,type,targetPath)
        .then(function(){
            updateLoadingText('Unzipping files');
            createFiles(name, type, targetPath)
                .then(function(workingPath){
                    updateLoadingText('Configuring Site');
                    configureSite(name, workingPath)
                        .then(function(){
                            updateLoadingText('Updating Hosts File');
                            updateHostsFile(name)
                        })
                        .then(function(){
                            updateLoadingText('Starting Site');
                            startSite(workingPath)
                                .then(function(stdout){
                                    if(stdout.toString().indexOf('Starting environment') != -1){
                                        updateLoadingText('Start Process Initiated.' + stdout);
                                        resetAddModal();
                                    }
                                })
                        })
                })
        })
        .catch((err) => {
            showErrorScreen(true, err.toString());
        });
}

function validateInputs(name, type, targetPath){
    return Promise.all([
        validateHostname(name),
        validateCMSType(type),
        validateInstallPath(targetPath)
    ]);
}

function createFiles(siteName, cmsType, targetFolder){
    var promise = new Promise(function(resolve, reject){
        getCMSPath(cmsType).then(function(CMSTarballPath){
            targetFolder = targetFolder + "/" + siteName;
            unpackCMSTarball(CMSTarballPath,targetFolder).then(function(unzippedPath){
                var CMSWorkingPath = (cmsType.indexOf('wordpress') !== -1) ? 'wordpress' : CMSTarballPath.split('/').pop().replace('.tar.gz','');
                resolve(unzippedPath + "/" + CMSWorkingPath);
            });
        })
        .catch(function(err){
            reject(err);
        });
    });
    return promise;
}

function configureSite(siteName, workingPath){
    var promise = new Promise(function(resolve, reject){
        ddevShell.config(workingPath, siteName, '', resolve, reject);
    });
    return promise;
}

function updateHostsFile(siteName) {
    return ddevShell.hostname(siteName);
}

function startSite(workingPath) {
    var promise = new Promise(function(resolve, reject){
        ddevShell.start(workingPath, resolve, reject);
    });
    return promise;
}

function showLoadingScreen(display){
    var displayType = display ? "flex" : "none";
    $('.loading-overlay').css('display', displayType);
}

function showErrorScreen(display, error){
    $('.error-overlay').click(function(){
        showErrorScreen(false, '');
    });
    var displayType = display ? "flex" : "none";
    showLoadingScreen(false);
    $('.error-text').text(error.toString());
    $('.error-overlay').css('display', displayType);
}

function updateLoadingText(text){
    $('.loading-text').text(text.toString());
}

function resetAddModal() {
    $('#appType').val('').trigger('change');
    $('#site-name').val('');
    $('.selected-path-text').val('');
    showLoadingScreen(false);
    showErrorScreen(false);
    $('#distroModal').modal('hide');
}

module.exports.addCMS = addCMS;
