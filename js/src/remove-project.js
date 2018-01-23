var bootstrapModal = require('./bootstrap-modal');
var ddevShell = require('./ddev-shell');

/**
 * Remove Project - processes form input and calls ddevShell.remove
 * @formData {object} - serialzed formdata containing path and data removal option
 */
function removeProject(formData){
    try {
        var path = formData.filter(function(input){
            return input.name === 'projectPath'
        });
        var data = formData.filter(function(input){
            return input.name === 'removeOptions'
        });
        var name = formData.filter(function(input){
					  return input.name === 'projectName'
				});

        displayLoadingState();

        var removePath = path[0].value;
        var removeName = name[0].value;
        var removeData = data[0].value.includes('Database');

        return  ddevShell.remove(removePath, removeData, removeName)
            .then(function(){
                removeCompleted('Project Successfully Removed.');
            })
            .catch(function(err){
                removeCompleted('Could Not Remove Project ('+err+')');
            });
    } catch(err) {
        removeCompleted('Invalid Input Passed To Remove ('+err+') payload:'+ JSON.stringify(formData) );
    }
}

/**
 * display loading spinner while waiting for promise to fulfill
 */
function displayLoadingState(){
    $('.loading-overlay', '#removeModal').css('display','flex');
    $('.remove-project-button').addClass('btn-secondary').removeClass('btn-danger');
}

/**
 * Dismiss modal and show success or error result
 * @param message
 */
function removeCompleted(message){
    alert(message);
    $('#removeModal').modal('hide');
}

/**
 * Resets remove modal to defaults
 */
function resetRemoveModal() {
    $('.remove-project-button').removeClass('btn-secondary').addClass('btn-danger');
    $('#removeContainers').prop('checked',true).trigger('change');
    $('#projectPath, #removeModal').val('');
    $('#removeName').text('');
    $('.loading-overlay', '#removeModal').css('display','none');
}

/**
 * Updates remove modal content with current project data and shows modal
 * @param projectPath {string} - path of project to remove
 */
function showRemoveModal(projectPath, projectName) {;
    resetRemoveModal();
    $('#removeName').text(projectName);
    $('#projectPath, #removeModal').val(projectPath);
    $('#projectName, #removeModal').val(projectName);
    $('#removeModal').modal();
}

var removeProjectModalBody =
    `<div class="loading-overlay">
            <div>
                <i class="fa fa-spinner fa-spin loading-spinner" style="font-size:150px"></i>
            </div>
            <div class="loading-text">Removing...</div>
        </div>
        <div class="error-overlay">
            <div>
                <i class="fa fa-exclamation-triangle error-icon" style="font-size:50px"></i>
            </div>
            <div class="error-text">Something Went Wrong</div>
            <div class="btn btn-primary">OK</div>
        </div>
    <h2>Please select a removal option for project "<span id='removeName'></span>"</h2>
    <div>The project files will *not* be removed from your system.</div>
    <hr/>
    <form class="remove-options">
        <input id='projectPath' name="projectPath" type="hidden">
        <input id='projectName' name="projectName" type="hidden">
        <div class="remove-option">
            <input type="radio" name="removeOptions" id="removeContainers" value="Project from Dashboard" checked/>
            <label for="removeContainers">Remove Project
(ddev rm)</label>
        </div>
        <div class="remove-option">
            <input type="radio" name="removeOptions" id="removeContainersAndData" value="Project from Dashboard AND Project Database"/>
            <label for="removeContainersAndData">Remove Project AND Project Database 
(ddev rm --remove-data)</label>
        </div>
    </form>
    <hr/>
    `;

var removeProjectModalFooter =
    `<div class="remove-button-container">
        <div class="btn btn-danger pull-right remove-project-button">Remove <span class="removal-items">Project from Dashboard</span></div>
    </div>`;

/**
 * Initialization - hook UI and generate markup.
 */
function init(){
    $('body').append(bootstrapModal.createModal('removeModal','Remove Project',removeProjectModalBody,removeProjectModalFooter));
    $(document).on('click', '.removebtn', function () {
        showRemoveModal($(this).data('projectPath'),$(this).data('projectName'));
    });
    $('input[type=radio][name=removeOptions]').change(function() {
        $('.removal-items').text(this.value);
    });
    $('.remove-project-button').click(function(){
        if($('.remove-project-button').hasClass('btn-danger')){
            removeProject($('.remove-options').serializeArray());
        }
    });
}

module.exports.init = init;
