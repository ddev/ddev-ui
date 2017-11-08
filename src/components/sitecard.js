import React from 'react'
import {Col} from 'react-bootstrap'
import style from '../../sass/card.scss'

export default class SiteCard extends React.Component {
    render() {
        return (
            <Col className="card-container" xs={12} sm={6} md={4} lg={3} xl={2}>
                <div className="card">
                    <h2>{this.props.siteData.name}</h2>
                </div>
            </Col>
        );
    }
}