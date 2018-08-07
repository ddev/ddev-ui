import React from 'react';
import Terminal from 'terminal-in-react';

const ddevShell = require('../modules/ddev-shell');

class ProjectConsole extends React.Component {
  logs = () => 'Hey NOW';

  render() {
    return (
      <Terminal
        color="green"
        hideTopBar
        allowTabs={false}
        backgroundColor="black"
        startState="maximised"
        // commandPassThrough={(cmd, print) => {
        //   // do something async
        //   print(`-PassedThrough:${cmd}: command not found`);
        // }}
        style={{
          fontWeight: 'bold',
          fontSize: '1em',
        }}
        commands={
          {
            // logs: this.logs
          }
        }
        descriptions={{
          color: false,
          show: false,
          // logs: "pull logs from the container"
        }}
        msg="Welcome to the DDEV console! From here you can pull logs, run commands from inside the container, and run any other DDEV-CLI commands for this project."
      />
    );
  }
}

export default ProjectConsole;
