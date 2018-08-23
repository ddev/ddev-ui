import React from 'react';
import { render } from 'react-dom';
import * as path from 'path';
import App from './components/App';

if (process.env.NODE_ENV !== 'development') {
  window.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

render(<App />, document.getElementById('app'));
