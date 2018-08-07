import React from 'react';

class CreateProjectWizard extends React.Component {
  state = {
    step: 1,
    name: '',
    type: '',
    path: '~/',
  };

  componentDidMount() {
    let navListItems = $('div.setup-panel div a'),
      allWells = $('.setup-content'),
      allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function(e) {
      e.preventDefault();
      let $target = $($(this).attr('href')),
        $item = $(this);

      if (!$item.hasClass('disabled')) {
        navListItems.removeClass('btn-outline-primary').addClass('btn-outline-secondary');
        $item.removeClass('btn-outline-secondary').addClass('btn-outline-primary');
        allWells.hide();
        $target.show();
        $target.find('input:eq(0)').focus();
      }
    });

    allNextBtn.click(function() {
      let curStep = $(this).closest('.setup-content'),
        curStepBtn = curStep.attr('id'),
        nextStepWizard = $(`div.setup-panel div a[href="#${curStepBtn}"]`)
          .parent()
          .next()
          .children('a'),
        curInputs = curStep.find("input[type='text'],input[type='url'],select"),
        isValid = true;

      $('.form-group').removeClass('has-error');
      for (let i = 0; i < curInputs.length; i++) {
        if (!curInputs[i].validity.valid) {
          isValid = false;
          $(curInputs[i])
            .closest('.form-group')
            .addClass('has-error');
        }
      }

      if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-outline-primary').trigger('click');
  }

  handleNameUpdate = e => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div className="create-project-wizard">
        <form role="form">
          {/* Step 1 */}
          <div className="setup-content" id="step-1">
            <div className="row">
              <div className="col-md-12">
                <h3 className="text-center">Project Setup</h3>
                <div className="form-group">
                  <label className="control-label">Project Name</label>
                  <input
                    maxLength="200"
                    type="text"
                    required="required"
                    className="form-control form-control-lg"
                    placeholder="my-new-project"
                    value={this.state.name}
                    name="project-name"
                    onChange={this.handleNameUpdate}
                  />
                </div>
                <div className="form-group form-row">
                  <label className="control-label" htmlFor="installType">
                    Is your project new or existing
                  </label>
                  <div className="btn-group w-100">
                    <button className="btn btn-outline-secondary btn-lg" type="button">
                      New Install
                    </button>
                    <button className="btn btn-outline-secondary btn-lg" type="button">
                      Existing Install
                    </button>
                  </div>
                  <select required="required" className="custom-select" id="installType">
                    <option value="">Please Select</option>
                    <option value="new">New</option>
                    <option value="existing">Existing</option>
                  </select>
                </div>
                <div className="form-group form-row">
                  <div className="col">
                    <label className="control-label">Local project domain</label>
                    <div className="input-group">
                      <input
                        type="text"
                        disabled="disabled"
                        readOnly
                        className="form-control"
                        placeholder="my-new-project"
                        value={this.state.name}
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">.ddev.local</div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <label className="control-label">Local path for install</label>
                    <div className="input-group select-path-folder">
                      <input
                        maxLength="100"
                        type="text"
                        readOnly
                        required="required"
                        className="selected-path-text form-control"
                        placeholder="~/Local Sites/"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <i className="fa fa-folder-open-o" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group clearix">
                  <button
                    className="btn btn-outline-secondary btn-sm pull-left"
                    type="button"
                    onClick={e => {
                      e.preventDefault;
                      this.props.history.goBack();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-outline-primary nextBtn btn-sm pull-right"
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="row setup-content" id="step-2">
            <div className="col-xs-12">
              <div className="col-md-12">
                <h3>Container Settings</h3>
                <div className="form-group">
                  <label className="control-label">Company Name</label>
                  <input
                    maxLength="200"
                    type="text"
                    required="required"
                    className="form-control"
                    placeholder="Enter Company Name"
                  />
                </div>
                <div className="form-group">
                  <label className="control-label">Company Address</label>
                  <input
                    maxLength="200"
                    type="text"
                    required="required"
                    className="form-control"
                    placeholder="Enter Company Address"
                  />
                </div>
                <button className="btn btn-outline-primary nextBtn btn-lg pull-right" type="button">
                  Next
                </button>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="row setup-content" id="step-3">
            <div className="col-xs-12">
              <div className="col-md-12">
                <h3>Platform Setup</h3>
                <button className="btn btn-outline-success btn-lg pull-right" type="submit">
                  Finish!
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Steps */}
        <div className="stepwizard fixed-bottom">
          <div className="stepwizard-row form-row h-100 btn-breadcrumb align-items-center setup-panel clearfix">
            {/* Step 1 */}
            <div className="stepwizard-step col-4">
              <a href="#step-1" type="button" className="btn btn-outline-primary btn-circle">
                1
              </a>
              <span>Project Setup</span>
            </div>
            {/* Step 2 */}
            <div className="stepwizard-step col-4">
              <a
                href="#step-2"
                type="button"
                className="btn btn-outline-secondary btn-circle"
                disabled
              >
                2
              </a>
              <span>Container Settings</span>
            </div>
            {/* Step 3 */}
            <div className="stepwizard-step col-4">
              <a
                href="#step-3"
                type="button"
                className="btn btn-outline-secondary btn-circle"
                disabled
              >
                3
              </a>
              <span>Platform Setup</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProjectWizard;
