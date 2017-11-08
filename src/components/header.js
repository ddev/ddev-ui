import React from 'react'
import style from '../../sass/header.scss'
import DDEVLogo from '../../img/ddev_last.png'

export default class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <img className="ddev-logo" src={DDEVLogo} />
            </div>
        );
    }
}