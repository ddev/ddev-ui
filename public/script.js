var createCard = function(site) {
    function createSiteLogo(siteInformation) {
        var logos = [];
        logos['drupal8'] = '/images/drupal8.png';
        logos['drupal7'] = '/images/drupal7.png';
        logos['wordpress'] = '/images/wordpress.png';
        var siteLogo = '<img class="card-img-top img-fluid" src="'+logos[siteInformation.type]+'" alt="">';

        return siteLogo;
    }

    function createSiteTitle(siteInformation) {
        var siteTitle = '<h4 class="card-title">' + siteInformation.name + '</h4>';

        return siteTitle;
    }
    function createSiteInformation(siteInformation) {
        var templateOpen = '<div class="site-info-container">';
        var siteUrl = '<div class="site-url">URL: <a href="'+siteInformation.url+'">' + siteInformation.url + '</a></div>';
        var siteLocation = '<div class="site-location">Source Location: '+siteInformation.location+'</div>';
        var templateClose = '</div>';

        return templateOpen + siteUrl + siteLocation + templateClose;
    }
    function createDatabaseInformation(databaseInformation) {
        var databaseInfo = '';
        for (var key in databaseInformation) {
            if (databaseInformation.hasOwnProperty(key)) {
                databaseInfo += '<li>'+key+': '+databaseInformation[key]+'</li>';
            }
        }

        return "<ul class='database-information-list'>"+databaseInfo+'</ul>';
    }
    function createOtherServices(otherServices) {
        var services = '';
        for (var key in otherServices) {
            if (otherServices.hasOwnProperty(key)) {
                services += '<li>'+key+': '+otherServices[key]+'</li>';
            }
        }
        return "<ul class='other-services-list'>"+services+'</ul>';
    }

    var action = (site.site.status === 'running') ? 'STOP' : 'START';

    var template = '<div class="col-lg-4 col-md-12 mb-6"><div class="card">'+createSiteLogo(site.site)+'<div class="card-block">'+createSiteTitle(site.site)+'<p class="card-text">'+createSiteInformation(site.site)+'</p><p class="card-text">'+createDatabaseInformation(site.databaseDetails)+'</p><p class="card-text">'+createOtherServices(site.otherServices)+'</p></div><div class="card-footer"><a href="#" class="btn btn-primary">'+action+'</a></div></div></div>';
    return template;
};

var sites = [];
$.getJSON('http://localhost:3000/sites').done(function(data){
    for(var i = 0; i<data.length; i++){
        var site = data[i];
        sites.push(createCard(site));
        $('#sites').append(createCard(site));
    }
});