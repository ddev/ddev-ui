const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const exec = require('child-process-promise').exec;
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/sites', (request, response) => {
    getSitesDetails().then((sites) => {
        response.send(sites);
    });
});

app.get('/sites/:id', (request, response) => {
    getSiteDescription(request.params.id).then((site) => {
       response.send(site);
    });
});

app.post('/start', (req,res) => {
    const siteLocation = req.body.siteLocation.replace('~','%HOMEPATH%');
    exec('(cd '+siteLocation+' && ddev start)')
        .then((result) => {
            const stdout = result.stdout;
            res.send(stdout);
        })
        .catch((err) => {
            res.status(500);
            res.send(err.stderr);
        });
});

app.post('/stop', (req,res) => {
    const siteID = req.body.siteID;
    exec('ddev stop ' + siteID)
        .then((result) => {
            res.send(siteID + " successfully stopped.");
        })
        .catch((err) => {
            res.status(500);
            res.send(err.stderr);
        });
});

app.post('/restart', (req,res) => {
    const siteLocation = req.body.siteLocation.replace('~','%HOMEPATH%');
    exec('(cd '+siteLocation+' && ddev restart)')
        .then((result) => {
            const stdout = result.stdout;
            res.send(stdout);
        })
        .catch((err) => {
            res.status(500);
            res.send(err.stderr);
        });
});

app.post('/new', (req,res) => {

});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});

const getSitesDetails = () => {
    const getSitesDetailsPromise = new Promise((resolve, reject) => {
        exec('ddev list')
            .then((result) => {
                const stdout = result.stdout;
                let sitesDetails = [];
                let outputLines = stdout.split(/\n/);

                let isSiteLine = false;

                outputLines.forEach(function(line){
                    if(isSiteLine) {
                        if(line.length > 0) {
                            let siteArray = line.split(/\s\s+/);
                            const siteDetails = {
                                name: siteArray[0],
                                type: siteArray[1],
                                location: siteArray[2],
                                url: siteArray[3],
                                status: siteArray[4]
                            };
                            sitesDetails.push(siteDetails);
                        } else {
                            isSiteLine = false;
                        }
                    }
                    if(line.replace(/\s/g, '') === "NAMETYPELOCATIONURLSTATUS") {
                        isSiteLine = true;
                    }
                });

                resolve(sitesDetails);
            })
            .catch((err) => {
                reject('ERROR: ' + err);
            });
    });
    return getSitesDetailsPromise;
};

const getSiteDescription = (siteName) => {
    const getSiteDescriptionPromise = new Promise((resolve, reject) => {
        exec('ddev describe ' + siteName)
            .then((result) => {
                const stdout = result.stdout;

                let outputLines = stdout.split(/\n/);
                let dataGroups = [];
                let currentDataGroup = '';

                for( let i = 0; i < outputLines.length; i++) {
                    const line = outputLines[i];
                    if(line.indexOf('----') !== -1) {
                        currentDataGroup = outputLines[(i-1)];
                        dataGroups[currentDataGroup] = [];
                    }
                    if(currentDataGroup && line.indexOf(':') !== -1 && line.indexOf('example') === -1){
                        dataGroups[currentDataGroup].push(line);
                    }
                    if(line.length === 0) {
                        currentDataGroup = '';
                    }
                }

                console.log(dataGroups);

                resolve(dataGroups);
            })
            .catch((err) => {
                reject('ERROR: ' + err);
            });
    });
    return getSiteDescriptionPromise;
};