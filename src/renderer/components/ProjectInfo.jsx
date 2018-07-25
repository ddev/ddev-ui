import React from "react";

class ProjectInfo extends React.Component {
  render() {
    return (
      <div className="tabs">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="site-details-tab"
              data-toggle="tab"
              href="#site-details"
              role="tab"
              aria-controls="site-details"
              aria-selected="true"
            >
              Project Details
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="site-db-tab"
              data-toggle="tab"
              href="#site-db"
              role="tab"
              aria-controls="site-db"
              aria-selected="false"
            >
              Database
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="ssl-tab"
              data-toggle="tab"
              href="#ssl"
              role="tab"
              aria-controls="ssl"
              aria-selected="false"
            >
              SSL
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="site-details"
            role="tabpanel"
            aria-labelledby="site-details-tab"
          >
            <dl className="list-group list-group-flush">
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Project Name</dt>
                <dd className="col-sm-9">{this.props.name}</dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">App Root</dt>
                <dd className="col-sm-9">{this.props.approot}</dd>
              </li>
              <li className="list-group-item row d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
            </dl>
          </div>
          <div
            className="tab-pane fade"
            id="site-db"
            role="tabpanel"
            aria-labelledby="site-db-tab"
          >
            <dl className="list-group list-group-flush">
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
            </dl>
          </div>
          <div
            className="tab-pane fade"
            id="ssl"
            role="tabpanel"
            aria-labelledby="ssl-tab"
          >
            <dl className="list-group list-group-flush">
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
              <li className="list-group-item row  d-flex">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                </dd>
              </li>
            </dl>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectInfo;
