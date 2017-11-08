import React from 'react';
import PropTypes from 'prop-types';
import '../sass/base.scss';
import Header from './components/header';
import Body from './components/body';
import Footer from './components/footer';

function App({ sites }) {
  return (
    <div className="app-container">
      <Header />
      <Body sites={sites} />
      <Footer />
    </div>
  );
}

App.propTypes = {
  sites: PropTypes.arrayOf(PropTypes.object),
};

App.defaultProps = {
  sites: [],
};

export default App;
