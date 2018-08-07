import React from 'react';

class GlobalActions extends React.Component {
  render() {
    return (
      <div
        className={`global-actions text-center text-md-right ${
          this.props.className ? this.props.className : ''
        }`}
      >
        <ul className="global-actions list-unstyled list-inline mb-0">
          <li className="restart list-inline-item">
            <a href="#!" className="text-success" onClick={this.processRestart}>
              <i className="fa fa-retweet" aria-hidden="true" /> <b>Restart All</b>
            </a>
          </li>
          <li className="stop list-inline-item">
            <a href="#!" className="text-danger" onClick={this.processStop}>
              <i className="fa fa-stop-circle-o" aria-hidden="true" /> <b>Stop All</b>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default GlobalActions;
