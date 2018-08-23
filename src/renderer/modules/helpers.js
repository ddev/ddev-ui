// parse stdout/stderr to determine error "type"
export function getErrorResponseType(error) {
  // console.log(error.msg);
  if (error.msg === 'Could not connect to docker. Please ensure Docker is installed and running.') {
    return 'docker';
  }
  return 'general';
}
