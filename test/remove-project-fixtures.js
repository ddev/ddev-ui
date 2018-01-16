var removeProjectArray = [{"name":"projectPath","value":"/Users/testguy777/Desktop/d7test1234"},{"name":"removeOptions","value":"Project from Dashboard"}];
var removeProjectDataArray = [{"name":"projectPath","value":"/Users/testguy777/Desktop/d87loihasd"},{"name":"removeOptions","value":"Project from Dashboard AND Project Database"}];
var brokenProjectArray = [{"bad":"object"},"wrong type"];

var brokenErrorMessage = `Invalid Input Passed To Remove (TypeError: Cannot read property 'value' of undefined) payload:[{"bad":"object"},"wrong type"]`;

module.exports.removeProjectArray = removeProjectArray;
module.exports.removeProjectDataArray = removeProjectDataArray;
module.exports.brokenProjectArray = brokenProjectArray;
module.exports.brokenErrorMessage = brokenErrorMessage;