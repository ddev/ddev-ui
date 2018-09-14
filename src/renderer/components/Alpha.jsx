import React from 'react';

const issue = require(`${__static}/img/Issue.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require

const Alpha = () => (
  <div className="alpha mt-3">
    <div className="alert alert-info alert-dismissible fade show" role="alert">
      Thanks for testing out the Alpha and pardon the mess!
      <br />
      <br />
      <small>
        If you find any issues, something seems off, or is just flat out not working let us know. We
        are also looking for your feedback for future releases. Look for the{' '}
        <img alt="Open Issue" src={issue} className="" /> icon in the bottom of the sidebar to
        submit any issues or feedback you might have.
      </small>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
);

export default Alpha;
