/**
 * TEMPLATE - generates markup for a bootstrap modal
 * @param id {string} - id to give new modal
 * @param title {string} - title to display in header of new modal
 * @param body {string} - content of new modal body
 * @param footer {string} - optional - content of new modal footer
 * @returns {string} - markup for a boostrap modal
 */
export function createModal(id, title, body, footer) {
  const markup = `<div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-labelledby="${id}Label" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h2 class="modal-title">${title}</h2>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      ${body}
                  </div>
                  <footer class="modal-footer">
                      ${footer}
                  </footer>
              </div>
          </div>
      </div>`;

  return markup;
}
