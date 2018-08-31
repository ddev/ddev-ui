import { createModal } from './bootstrap-modal';
import { remove } from './ddev-shell';

/**
 * Dismiss modal and show success or error result
 * @param message
 */
function removeCompleted(message) {
  alert(message);
  $('#removeModal').modal('hide');
}

/**
 * display loading spinner while waiting for promise to fulfill
 */
function displayLoadingState() {
  $('.loading-overlay', '#removeModal').css('display', 'flex');
  $('.remove-project-button')
    .addClass('btn-secondary')
    .removeClass('btn-danger');
}

/**
 * Remove Project - processes form input and calls ddevShell.remove
 * @formData {object} - serialzed formdata containing path and data removal option
 */
function removeProject(formData) {
  try {
    const data = formData.filter(input => input.name === 'removeOptions');
    const name = formData.filter(input => input.name === 'projectName');

    displayLoadingState();

    const removeName = name[0].value;
    const removeData = data[0].value.includes('Database');

    return remove(removeName, removeData)
      .then(() => {
        removeCompleted('Project Successfully Removed.');
      })
      .catch(err => {
        removeCompleted(`Could Not Remove Project (${err})`);
      });
  } catch (err) {
    removeCompleted(`Invalid Input Passed To Remove (${err}) payload:${JSON.stringify(formData)}`);
  }
}

/**
 * Resets remove modal to defaults
 */
function resetRemoveModal() {
  $('.remove-project-button')
    .removeClass('btn-secondary')
    .addClass('btn-danger');
  $('#removeContainers')
    .prop('checked', true)
    .trigger('change');
  $('#projectPath, #removeModal').val('');
  $('#removeName').text('');
  $('.loading-overlay', '#removeModal').css('display', 'none');
}

/**
 * Updates remove modal content with current project data and shows modal
 * @param projectPath {string} - path of project to remove
 */
function showRemoveModal(projectPath, projectName) {
  resetRemoveModal();
  $('#removeName').text(projectName);
  $('#projectPath, #removeModal').val(projectPath);
  $('#projectName, #removeModal').val(projectName);
  $('#removeModal').modal();
}

const RemoveProjectModalBody = () => (
  <div>
    <div className="loading-overlay">
      <div>
        <i className="fa fa-spinner fa-spin loading-spinner" />
      </div>
      <div className="loading-text">Removing...</div>
    </div>
    <div className="error-overlay">
      <div>
        <i className="fa fa-exclamation-triangle error-icon" />
      </div>
      <div className="error-text">Something Went Wrong</div>
      <div className="btn btn-primary">OK</div>
    </div>
    <h2>
      Please select a removal option for project "<span id="removeName" />"
    </h2>
    <div>The project files will *not* be removed from your system.</div>
    <hr />
    <form className="remove-options">
      <input id="projectPath" name="projectPath" type="hidden" />
      <input id="projectName" name="projectName" type="hidden" />
      <div className="remove-option">
        <input
          type="radio"
          name="removeOptions"
          id="removeContainers"
          value="Project from Dashboard"
          checked
        />
        <label htmlFor="removeContainers">Remove Project (ddev rm)</label>
      </div>
      <div className="remove-option">
        <input
          type="radio"
          name="removeOptions"
          id="removeContainersAndData"
          value="Project from Dashboard AND Project Database"
        />
        <label htmlFor="removeContainersAndData">
          Remove Project AND Project Database (ddev rm --remove-data)
        </label>
      </div>
    </form>
    <hr />
  </div>
);

const RemoveProjectModalFooter = () => (
  <div className="remove-button-container">
    <div className="btn btn-danger pull-right remove-project-button">
      Remove <span className="removal-items">Project from Dashboard</span>
    </div>
  </div>
);

/**
 * Initialization - hook UI and generate markup.
 */
export function init() {
  $('body').append(
    createModal('removeModal', 'Remove Project', RemoveProjectModalBody, RemoveProjectModalFooter)
  );
  $(document).on('click', '.removebtn', function() {
    showRemoveModal($(this).data('projectPath'), $(this).data('projectName'));
  });
  $('input[type=radio][name=removeOptions]').change(function() {
    $('.removal-items').text(this.value);
  });
  $('.remove-project-button').click(() => {
    if ($('.remove-project-button').hasClass('btn-danger')) {
      removeProject($('.remove-options').serializeArray());
    }
  });
}
