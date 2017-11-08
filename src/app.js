import React from 'react';
import style from '../sass/base.scss'
import Header from './components/header'
import Body from './components/body'
import Footer from './components/footer'

export default class App extends React.Component {
    render() {
        return (
            <div className="app-container">
                <Header />
                <Body sites={this.props.sites}/>
                <Footer />
            </div>
        );
    }
}