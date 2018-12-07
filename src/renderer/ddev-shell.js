import { spawn } from 'child_process';
import { homedir } from 'os';
import _ from 'lodash';
import fixPath from 'fix-path';
import * as prompt from 'sudo-prompt';

// quirk with electron's pathing. without this, / is symlinked to application working directory root
fixPath();

/**
 * executor for ddev shell commands. *only* allows `ddev *` commands to be run; autoprefixes commands.
 * i.e. command = 'list' -> command = 'ddev list'
 * @param command {string} - ddev command to run.
 * @param args {array} - optional - CLI arguments to pass with command.
 * @param path {string} - optional - working directory in which to run the command in
 * @param callback {function} - function to execute on stdout/completion
 * @param errorCallback {function} - function to execute or error
 * @param stream {bool} - if true, success callback will be called with every update to stdout.
 */
export function ddevShell(command, args, path, callback, errorCallback, stream) {
  let opts = {};

  let ddevCommand = command;

  if (!Array.isArray(ddevCommand)) {
    ddevCommand = [ddevCommand];
  }

  if (args && Array.isArray(args)) {
    ddevCommand = ddevCommand.concat(args);
  }

  if (path) {
    opts = {
      cwd: path.replace('~', homedir()),
    };
  }

  const currentCommand = spawn('ddev', ddevCommand, opts);

  let outputBuffer = '';

  const appendBuffer = function(data) {
    outputBuffer += data;
    if (stream) {
      callback(data);
    }
  };

  currentCommand.stdout.on('data', output => {
    appendBuffer(output);
  });

  currentCommand.stderr.on('data', output => {
    appendBuffer(output);
  });

  currentCommand.on('exit', code => {
    if (code !== 0) {
      errorCallback(outputBuffer);
    } else if (stream) {
      callback(`Process Exited With Code ${code}`);
    } else {
      callback(outputBuffer);
    }
  });
}

/**
 * wrapper for `ddev list` - parses array of site objects from raw or returns empty array if none
 * @returns {Promise} - resolves with an array of sites, or an empty array if none found
 */
export function list() {
  const promise = new Promise((resolve, reject) => {
    function getRaw(output) {
      const objs = output.split('\n');
      objs.forEach(obj => {
        if (obj) {
          try {
            let outputObject = JSON.parse(obj);
            if (outputObject.level === 'info') {
              if (!outputObject.raw) {
                outputObject = {
                  raw: [],
                };
              }
              if (Array.isArray(outputObject.raw)) {
                resolve(outputObject.raw);
              } else {
                reject(obj);
              }
            }
          } catch (e) {
            reject(obj);
          }
        }
        return promise;
      });
    }
    ddevShell('list', ['-j'], null, getRaw, reject);
  });
  return promise;
}

/**
 * wrapper for `ddev start`
 * @param path {string} - path to execute command in
 * @param callback {function} - function called on stdout update
 * @param errorCallback {function} - function called on error
 */
export function start(path, callback, errorCallback) {
  ddevShell('start', null, path, callback, errorCallback, true);
}

/**
 * wrapper for `ddev stop`
 * @param path {string} - path to execute command in
 * @param callback {function} - function called on stdout update
 * @param errorCallback {function} - function called on error
 */
export function stop(path, callback, errorCallback) {
  ddevShell('stop', null, path, callback, errorCallback, true);
}

/**
 * wrapper for `ddev restart`
 * @param path {string} - path to execute command in
 * @param callback {function} - function called on stdout update
 * @param errorCallback {function} - function called on error
 */
export function restart(path, callback, errorCallback) {
  ddevShell('restart', null, path, callback, errorCallback, true);
}

/**
 * wrapper for `ddev remove`
 * @param name {string} - name of site to remove
 * @param shouldRemoveData {boolean} - if data should be removed as well as project containers
 */
export function remove(name, shouldRemoveData, callback, errorCallback) {
  const args = shouldRemoveData ? ['--remove-data'] : [];
  args.push(name);

  ddevShell('remove', args, '', callback, errorCallback, true);
}

/**
 * wrapper for `ddev config`, run with --projectname --docroot flags to prevent cli from prompting
 * @param path {string} - working directory of project to configure
 * @param args {obj}
 *    --docroot,
 *    --projectname,
 *    --projecttype,
 *    --php-version,
 *    --webserver,
 *    --http-port,
 *    --https-port,
 *    --xdebug-enabled,
 *    --create-docroot
 * @param callback {function} - function to call on execution completion
 * @param errorCallback - function to call on failure
 */
// export function config(path, name, docroot, args = {}, callback, errorCallback) {
export function config(path, args = {}, callback, errorCallback) {
  const argsArr = [];
  const finalArgs = _.merge({ '-j': null }, _.isObjectLike(args) ? args : {});

  _.forEach(finalArgs, (value, key) => {
    argsArr.push(key);
    if (!_.isEmpty(value)) argsArr.push(value);
  });

  ddevShell('config', argsArr, path, callback, errorCallback);
}

/**
 * wrapper for `ddev hostname`, attempts to run as sudo
 * @param siteName {string} - sitename to create hostname entry for
 * @param domain - optional - domain to create sitename subdomain
 * @returns {Promise} - resolves on successful execution with stdout text
 */
export function hostname(siteName, domain = 'ddev.local') {
  const promise = new Promise((resolve, reject) => {
    const options = {
      name: 'DDEV UI',
    };

    const command = `ddev hostname ${siteName}.${domain} 127.0.0.1 -j`;
    prompt.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
  return promise;
}

/**
 * wrapper for `ddev describe` and formats output (creates links) as needed by the UI
 * @param siteName {string} - target site to get details of
 * @returns {Promise} - resolves with object containing formatted links and sections for the UI
 */
export function describe(siteName) {
  const promise = new Promise((resolve, reject) => {
    function parseJSONOutput(describeJSON) {
      const objs = describeJSON.split('\n');

      objs.forEach(obj => {
        let siteDetails = {};
        if (obj) {
          try {
            const rawData = JSON.parse(obj);
            if (rawData.level === 'info') {
              siteDetails = rawData.raw;
              resolve(siteDetails);
            }
          } catch (e) {
            reject(siteDetails);
          }
        }
        return promise;
      });
    }
    ddevShell('describe', [siteName, '-j'], null, parseJSONOutput, reject, false);
  });

  return promise;
}

/**
 * wrapper for `ddev version`
 */
export function version() {
  const promise = new Promise((resolve, reject) => {
    function parseJSONOutput(describeJSON) {
      const objs = describeJSON.split('\n');

      objs.forEach(obj => {
        let ddevDetails = {};
        if (obj) {
          try {
            const rawData = JSON.parse(obj);
            if (rawData.level === 'info') {
              ddevDetails = rawData.raw;
              resolve(ddevDetails);
            }
          } catch (e) {
            reject(e);
          }
        }
        return promise;
      });
    }
    ddevShell('version', ['-j'], null, parseJSONOutput, reject, false);
  });
  return promise;
}

/**
 * priv escalation - only allows whitelisted commands to be run as sudo, and bans dangerous characters
 * @param command {string} - ddev command to run
 * @param promptOptions {object} - sudo prompt options such as application name and prompt icon
 * @returns {promise} - resolves if escalation is successful with stdout text
 */
export function sudo(command, promptOptions = { name: 'DDEV UI' }) {
  const bannedCharacters = [';', '|', '&'];
  const whitelistedCommands = ['version'];
  const ddevCommand = `ddev ${command}`;

  if (whitelistedCommands.indexOf(command) !== -1) {
    bannedCharacters.forEach(character => {
      if (command.includes(character)) {
        return Promise.reject(
          new Error(`${character} is not an allowed character in privilege escalation requests.`)
        );
      }
    });
    const promise = new Promise((resolve, reject) => {
      prompt.exec(ddevCommand, promptOptions, (error, stdout, stderr) => {
        if (error) {
          console.log(stderr);
          reject(new Error('Unable to escalate permissions.'));
        } else {
          resolve(stdout);
        }
      });
    });

    return promise;
  }
  return Promise.reject(new Error(`${ddevCommand} is not allowed to be run as sudo`));
}
