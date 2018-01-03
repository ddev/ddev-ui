var bootstrapModal = require('./bootstrap-modal');
var ddevShell = require('./ddev-shell');

/**
 * Remove Site - processes form input and calls ddevShell.remove
 * @formData {object} - serialzed formdata containing path and data removal option
 */
function removeSite(formData){
    var path = formData.filter(function(input){
        return input.name === 'sitePath'
    });
    var data = formData.filter(function(input){
        return input.name === 'removeOptions'
    });

    $('.loading-overlay', '#removeModal').css('display','flex');

    ddevShell.remove(path, data)
    .then(function(){
        alert('Site Successfully Removed.');
        $('#removeModal').modal('hide');
    })
    .catch(function(err){
        alert('Could Not Remove Site ('+err+')');
    })
}

/**
 * Resets remove modal to defaults
 */
function resetRemoveModal() {
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
    <div>The project files will *not* be removed from your harddrive.</div>
    <hr/>
    <form class="remove-options">
        <input id='sitePath' name="sitePath" type="hidden">
        <div class="remove-option">
            <input type="radio" name="removeOptions" id="removeContainers" value="Site from Dashboard" checked/>
            <label for="removeContainers">Site from Dashboard</label>
        </div>
        <div class="remove-option">
            <input type="radio" name="removeOptions" id="removeContainersAndData" value="Site from Dashboard AND Site Database"/>
            <label for="removeContainersAndData">Site from Dashboard AND Site Database</label>
        </div>
    </form>
    <hr/>
    `;

var removeSiteModalFooter =
    `<div class="remove-button-container">
        <div class="btn btn-danger pull-right remove-site-button">Remove <span class="removal-items">Site from Dashboard</span></div>
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
       removeSite($('.remove-options').serializeArray());
    });
}

module.exports.init = init;
