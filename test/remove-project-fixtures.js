const removeProjectArray = [
  { name: 'removeOptions', value: 'Project from Dashboard' },
  { name: 'projectName', value: 'testyMcTestProject' },
];
const removeProjectDataArray = [
  { name: 'removeOptions', value: 'Project from Dashboard AND Project Database' },
  { name: 'projectName', value: 'testyMcTestProject' },
];
const brokenProjectArray = [{ bad: 'object' }, 'wrong type'];

const brokenErrorMessage = `Invalid Input Passed To Remove (TypeError: Cannot read property 'value' of undefined) payload:[{"bad":"object"},"wrong type"]`;

const _removeProjectArray = removeProjectArray;
export { _removeProjectArray as removeProjectArray };
const _removeProjectDataArray = removeProjectDataArray;
export { _removeProjectDataArray as removeProjectDataArray };
const _brokenProjectArray = brokenProjectArray;
export { _brokenProjectArray as brokenProjectArray };
const _brokenErrorMessage = brokenErrorMessage;
export { _brokenErrorMessage as brokenErrorMessage };
