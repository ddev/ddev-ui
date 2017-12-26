var distroUpdater = require('./distro-updater');
var tar = require('tar');
var ddevShell = require('./ddev-shell');
var os = require('os');
var exec = require('child_process').exec;

var addSiteOptionsModalBody =
    `<div class="row">
        <div class="option-container second-option column col-lg-12 col-md-12 col-sm-12 start-from-template">
            <div class="btn btn-primary start-button-option-container">
                <i class="fa fa-file-archive-o" style="font-size: 50px"></i>
            </div>
            <div>Start fresh from a CMS template</div>
        </div>
    </div>`;

var createSiteModalBody =
    `<div class="modal-body">
        <div class="loading-overlay">
            <div>
                <i class="fa fa-spinner fa-spin loading-spinner" style="font-size:150px"></i>
            </div>
            <div class="loading-text">Working...</div>
        </div>
        <div class="error-overlay">
            <div>
                <i class="fa fa-exclamation-triangle error-icon" style="font-size:50px"></i>
            </div>
            <div class="error-text">Something Went Wrong</div>
            <div class="btn btn-primary">OK</div>
        </div>
        <h3 class="add-modal-section-header">Application Type</h3>
        <div class="tile-container">
            <div class="tile">
                <img class="drupal7" src="img/drupal7.png" data-type="drupal7"/>
            </div>
            <div class="tile">
                <img class="drupal8" src="img/drupal8.png" data-type="drupal8"/>
            </div>
            <div class="tile">
                <img class="wordpress" src="img/wordpress.png" data-type="wordpress"/>
            </div>
        </div>
        <h3 class="add-modal-section-header">Project Name</h3>
        <div class="site-name-container add-site-segment">
            <div class="input-group">
                <input type="text" class="form-control" id="site-name">
            </div>
        </div>
        <h3 class="add-modal-section-header">Installation Directory</h3>
        <div class="select-folder-container add-site-segment">
            <div class="input-group select-path-folder">
                <span class="input-group-addon" id="basic-addon1"><i class="fa fa-folder-open-o" aria-hidden="true"></i></span>
                <input type="text" readonly class="selected-path-text form-control" placeholder="Path To Install Site" aria-describedby="basic-addon1">
            </div>
        </div>
        <div class="hidden">
            <input type="hidden" id="appType">
        </div>
    </div>`;

var createSiteModalFooter =
    `<div class="btn btn-primary create-site">Create Site</div>`;
/**
 * Initialization - hook UI and generate markup.
 */
function init(){
    $('body').append(createModal('addOptionsDialog','Choose a Starting Point', addSiteOptionsModalBody));
    $('body').append(createModal('distroModal','Create a New Site',createSiteModalBody, createSiteModalFooter));
}

/**
 * Basic validation of a hostname based on RFC 2396 Section 3.2.2
 * @param hostname {string} a hostname to validate
 * @return {bool} if hostname has passed validation
 */
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

/**
 * Validates a supported cmsType was passed in by the UI selector
 * @param cmsType {string} the cmsType provided by the UI selector
 * @return {promise} resolves with validity boolean if passes check, rejects with error message if fails.
 */
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

/**
 * Validates that the chosen install path is both valid and can be written to by the UI process
 * @param path {string} path to test for read/write access
 * @return {promise} resolves if path is read/writable, rejects with system error if not
 */
function validateInstallPath(path){
    var promise = new Promise(function(resolve,reject){
        distroUpdater.canReadAndWrite(path)
            .then(function(output){
                resolve(output);
            })
            .catch(function(err){
                err = err.toString().includes('no such file') ? "Cannot find or write to the selected directory." : err;
                reject(err);
            });
    });
    return promise;
}

/**
 * Gets the file location of the CMS image tarball pre-downloaded by the UI
 * @param cmsType {string} the name of the target CMS
 * @return {promise} resolves with tarball path if found, rejects with system error if not found
 */
function getCMSTarballPath(cmsType, cmsPath){
    var promise = new Promise(function(resolve, reject) {
        var targetCMS;
        switch(cmsType) {
            case 'wordpress':
                targetCMS = 'wordpress';
                break;
            case 'drupal7':
                targetCMS = 'drupal-7';
                break;
            case 'drupal8':
                targetCMS = 'drupal-8';
                break;
            default:
                throw 'No CMS selected';
        }
        distroUpdater.getLocalDistros(cmsPath).then(function(files){
            files.forEach(function(fileName) {
                if (fileName.indexOf(targetCMS) != -1) {
                    resolve(cmsPath + '/' + fileName);
                }
            });
            reject('CMS tarball not found');
        }).catch(function(){
            reject('CMS tarball not found in `~/.ddev/CMS`. Restarting the UI will attempt to redownload these files.');
        })
    });
    return promise;
}

/**
 * unpacks tarball to target directory
 * @param tarballPath {string} the path to a tarball to extract
 * @param outputPath {string} the path to extract the target tarball to
 * @return {promise} resolves with the path to the files extracted from tarball, rejects with system error if not
 */
function unpackCMSTarball(tarballPath, outputPath) {
    var promise = new Promise(function(resolve,reject){
        exec('mkdir '+outputPath, function(err, stdout, stderr) {
            if (err){
                reject(err);
            }
            else {
                try{
                    tar.x(
                        {
                            file: tarballPath,
                            C: outputPath,
                            strip: 1
                        },'',function(){
                            resolve(outputPath);
                        }
                    )
                } catch (err){
                    reject('Cannot extract base CMS file in `~/.ddev/CMS`. Restarting the UI will attempt to redownload them.');
                }
            }
        });
    });
    return promise;
}

/**
 * wrapper that runs all validations
 * @param name {string} hostname to be validated
 * @param type {string} cms type to be validated
 * @param type {string} target install path to have read/write permissions validated
 * @return {promise} resolves if ALL validations pass, rejects with message of failed validations of any do not pass
 */
function validateInputs(name, type, targetPath){
    return Promise.all([
        validateHostname(name),
        validateCMSType(type),
        validateInstallPath(targetPath)
    ]);
}

/**
 * wrapper that will unpack target CMS tarball to directory based on sitename and return docroot for ddev config use
 * @param siteName {string} site name of new site. used to build directory ( ex: {targetpath}/{sitename}/wordpress)
 * @param cmsType {string} target CMS to extract
 * @param targetFolder {string} target folder to extract to
 * @return {promise} resolves with path to new site docroot, rejects with error returned from any failed called function
 */
function createFiles(siteName, cmsType, cmsPath, targetFolder){
    var promise = new Promise(function(resolve, reject){
        getCMSTarballPath(cmsType,cmsPath).then(function(CMSTarballPath){
            targetFolder = targetFolder + "/" + siteName;
            unpackCMSTarball(CMSTarballPath,targetFolder).then(function(unzippedPath){
                resolve(unzippedPath);
            });
        })
        .catch(function(err){
            reject(err);
        });
    });
    return promise;
}

/**
 * wrapper for ddev config
 * @param siteName {string} name of site to configure
 * @param workingPath {string} the path of the extracted files to run ddev config in
 * @return {promise} resolves with a successful terminal output from ddev config, rejects with ddev error output
 */
function configureSite(siteName, workingPath){
    var promise = new Promise(function(resolve, reject){
        ddevShell.config(workingPath, siteName, '', resolve, reject);
    });
    return promise;
}

/**
 * wrapper for ddev start
 * @param workingPath {string} the path of the extracted files to run ddev start in
 * @return {promise} resolves with a successful terminal output from ddev start, rejects with ddev error output
 */
function startSite(workingPath) {
    var promise = new Promise(function(resolve, reject){
        ddevShell.start(workingPath, resolve, reject);
    });
    return promise;
}

/**
 * public function - calls private functions to validate inputs, unpack files, and configure/start site
 * @param name {string} name of site to create
 * @param type {string} type of CMS to install (drupal7, drupal8, wordpress)
 * @param targetPath {string} path to unpack CMS and install site
 */
function addCMS(name, type, targetPath) {
    var cmsPath = "~/.ddev/CMS";
    cmsPath = cmsPath.replace('~', os.homedir());
    showLoadingScreen(true);
    validateInputs(name,type,targetPath)
        .then(function(){
            updateLoadingText('Unzipping files');
            createFiles(name, type, cmsPath, targetPath)
                .then(function(workingPath){
                    updateLoadingText('Configuring Site');
                    configureSite(name, workingPath)
                        .then(function(){
                            updateLoadingText('Updating Hosts File');
                            ddevShell.hostname(name);
                        })
                        .then(function(){
                            updateLoadingText('Starting Site');
                            startSite(workingPath)
                                .then(function(stdout){
                                    if(stdout.toString().indexOf('Starting environment') != -1){
                                        resetAddModal();
                                        alert('Start Process Initiated. It may take a few seconds for the new site card to appear.');
                                    }
                                })
                                .catch((err) => {
                                    showErrorScreen(true, err.toString());
                                })
                        })
                        .catch((err) => {
                            showErrorScreen(true, err.toString());
                        })
                })
                .catch((err) => {
                    showErrorScreen(true, err.toString());
                })
        })
        .catch((err) => {
            showErrorScreen(true, err.toString());
        });
}

/**
 *
 * Markup and DOM Bindings
 *
 */
function showLoadingScreen(display){
    var displayType = display ? "flex" : "none";
    $('.loading-overlay').css('display', displayType);
}

function showErrorScreen(display, error='Something Went Wrong'){
    $('.error-overlay').click(function(){
        showErrorScreen(false, '');
    });
    var displayType = display ? "block" : "none";
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

module.exports.init = init;
module.exports.resetAddModal = resetAddModal;
module.exports.addCMS = addCMS;
