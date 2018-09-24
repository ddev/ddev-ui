import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

// define the Alerts component
class Alerts extends React.Component {
  render() {
    // find errors stored in state
    if (this.props.errors) {
      _.forEach(this.props.errors, value => {
        if (!_.isUndefined(value) && !_.isUndefined(value.msg)) {
          toast(value.msg, {
            toastId: value.id,
            onClose: () => this.props.errorRemove(value.id),
          });
        }
      });
    }

    return (
      <div className="alerts mt-3">
        <ToastContainer autoClose={false} />
      </div>
    );
  }
}

export default Alerts;
