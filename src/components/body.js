import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import style from '../../sass/body.scss'
import DDEVLogo from '../../img/ddev_logo_black.png'
import SiteCard from './sitecard'

export default class Body extends React.Component {
    render() {
        return (
            <div className="main-panel">
                <Grid>
                    <Row>
                        {this.props.sites.map(i => {
                            return <SiteCard siteData={i} />
                        })}
                    </Row>
                </Grid>
            </div>
        );
    }
}