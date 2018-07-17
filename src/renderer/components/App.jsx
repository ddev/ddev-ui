import React from "react";
import { Window } from "react-desktop/macOs";

import Header from "./Header";
import Sidebar from "./Sidebar";
// import Footer from './Footer';
// import Container from './Container';

import { init } from "./../modules/ui";

class App extends React.Component {
  constructor() {
    super();
    this.state = { selected: 1 };
  }
  componentDidMount() {
    init();
  }
  render() {
    return (
      <Window chrome padding="0px">
        <Header isFullscreen={this.state.isFullscreen} />
        <h3>TEST</h3>
        <Sidebar />
      </Window>
    );
  }
}

export default App;
