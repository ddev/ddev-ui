const express = require('express');
const app = express();
const path = require('path');
const exec = require('child-process-promise').exec;
const port = 3000;

app.use(express.static('public'));

app.get('/sites', (request, response) => {
    getSiteNames().then((sites) => {
            let sitePromises = [];
            let siteInfo = [];
            sites.forEach((site) => {
                sitePromises.push(getSiteInformation(site)
                    .then((siteDescription) => {
                        siteInfo.push(siteDescription);
                    })
                );
            });
            Promise.all(sitePromises).then((result) => {
                    response.send(siteInfo);
                }
            );
        }
    );
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});

const getSiteNames = () => {
    const getSiteNamesPromise = new Promise((resolve, reject) => {
        exec('ddev list')
            .then((result) => {
                const stdout = result.stdout;
                const stderr = result.stderr;
                let siteNames = [];

                let sites = stdout.split(/\n/);
                sites.splice(0,2);
                sites.splice(-3,3);
                sites.forEach(function(site){
                    siteArray = site.split(/\s\s+/);
                    siteNames.push(siteArray[0]);
                });
                resolve(siteNames);
            })
            .catch((err) => {
                reject('ERROR: ' + err);
            });
    });
    return getSiteNamesPromise;
};

const getSiteInformation = (siteName) => {
    const getSiteInformationPromise = new Promise((resolve, reject) => {
        exec('ddev describe ' + siteName)
            .then((result) => {
                const stdout = result.stdout;
                const stderr = result.stderr;
                
                let siteInfo = stdout.split(/\n/);
                siteInfo.splice(-3,3);
                
                let rawSiteDetails = siteInfo[1].split(/\s\s+/);
                
                let siteDetails = {
                    name: rawSiteDetails[0],
                    type: rawSiteDetails[1],
                    location: rawSiteDetails[2],
                    url: rawSiteDetails[3],
                    status: rawSiteDetails[4]
                };
                
                let databaseDetails = {
                    username: siteInfo[5].split(/:[\s]+/)[1].trim(),
                    password: siteInfo[6].split(/:[\s]+/)[1].trim(),
                    databaseName: siteInfo[7].split(/:[\s]+/)[1].trim(),
                    host: siteInfo[8].split(/:[\s]+/)[1].trim(),
                    port: siteInfo[9].split(/:[\s]+/)[1].trim()
                };
                
                siteInfo.splice(0,15);

                let otherServices = {};
                siteInfo.forEach((service) => {
                    otherService = service.split(/:[\s]+/);
                    otherServices[otherService[0]] = otherService[1];
                });
                
                const currentSiteDetails = new SiteDetails(siteDetails, databaseDetails, otherServices);

                resolve(currentSiteDetails);
            })
            .catch((err) => {
                reject('ERROR: ' + err);
            });
    });
    return getSiteInformationPromise;
};

class SiteDetails {
    constructor(siteDetails, databaseDetails, otherServices) {
        this.site = siteDetails;
        this.databaseDetails = databaseDetails;
        this.otherServices = otherServices;
    }
}