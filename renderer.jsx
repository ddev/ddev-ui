/* eslint-env browser */
import App from './src/app';

const React = require('react');
const ReactDOM = require('react-dom');

const mockSites = [
  {
    name: 'testsite',
  },
];

ReactDOM.render(<App sites={mockSites} />, document.getElementById('app'));
