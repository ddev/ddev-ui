var bootstrapModal = require('./bootstrap-modal');
var ddevShell = require('./ddev-shell');

/**
 * Remove Site - processes form input and calls ddevShell.remove
 * @formData {object} - serialzed formdata containing path and data removal option
 */
function removeSite(formData){
    try {
        var path = formData.filter(function(input){
            return input.name === 'sitePath'
        });
        var data = formData.filter(function(input){
            return input.name === 'removeOptions'
        });

        displayLoadingState();

        var removePath = path[0].value;
        var removeData = data[0].value.includes('Database');

        return  ddevShell.remove(removePath, removeData)
            .then(function(){
                removeCompleted('Site Successfully Removed.');
            })
            .catch(function(err){
                removeCompleted('Could Not Remove Site ('+err+')');
            });
    } catch(e) {
        removeCompleted('Invalid Input Passed To Remove');
    }
}

/**
 * display loading spinner while waiting for promise to fulfill
 */
function displayLoadingState(){
    $('.loading-overlay', '#removeModal').css('display','flex');
    $('.remove-site-button').addClass('btn-secondary').removeClass('btn-danger');
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
    $('.remove-site-button').removeClass('btn-secondary').addClass('btn-danger');
    $('#removeContainers').prop('checked',true).trigger('change');
    $('#sitePath, #removeModal').val('');
    $('.loading-overlay', '#removeModal').css('display','none');
}

/**
 * Updates remove modal content with current site data and shows modal
 * @param sitePath {string} - path of site to remove
 */
function showRemoveModal(sitePath) {
    resetRemoveModal();
    $('#sitePath, #removeModal').val(sitePath);
    $('#removeModal').modal();
}

var removeSiteModalBody =
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
    <h2>Please select a removal option</h2>
    <div>The project files will *not* be removed from your system.</div>
    <hr/>
    <form class="remove-options">
        <input id='sitePath' name="sitePath" type="hidden">
        <div class="remove-option">
            <input type="radio" name="removeOptions" id="removeContainers" value="Site from Dashboard" checked/>
            <label for="removeContainers">Remove Project</label>
        </div>
        <div class="remove-option">
            <input type="radio" name="removeOptions" id="removeContainersAndData" value="Site from Dashboard AND Site Database"/>
            <label for="removeContainersAndData">Remove Project AND Project Database</label>
        </div>
    </form>
    <hr/>
    `;

var removeSiteModalFooter =
    `<div class="remove-button-container">
        <div class="btn btn-danger pull-right remove-site-button">Remove <span class="removal-items">Project from Dashboard</span></div>
    </div>`;

/**
 * Initialization - hook UI and generate markup.
 */
function init(){
    $('body').append(bootstrapModal.createModal('removeModal','Remove Site',removeSiteModalBody,removeSiteModalFooter));
    $(document).on('click', '.removebtn', function () {
        showRemoveModal($(this).data('sitePath'));
    });
    $('input[type=radio][name=removeOptions]').change(function() {
        $('.removal-items').text(this.value);
    });
    $('.remove-site-button').click(function(){
        if($('.remove-site-button').hasClass('btn-danger')){
            removeSite($('.remove-options').serializeArray());
        }
    });
}

module.exports.init = init;
