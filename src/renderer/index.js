import React from 'react';
import { render } from 'react-dom';
import Router from './renderer/components/Router';

import 'popper.js';
import 'bootstrap';

window.$ = window.jQuery = require('jquery');

render(<Router />, document.getElementById('App'));
