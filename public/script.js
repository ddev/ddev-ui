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

        return "<ul class='database-information-list' style='list-style:none;-webkit-padding-start:0;'>"+databaseInfo+'</ul>';
    }

    function createOtherServices(otherServices) {
        var services = '';
        for (var key in otherServices) {
            if (otherServices.hasOwnProperty(key)) {
                services += '<li>'+key+': '+otherServices[key]+'</li>';
            }
        }
        return "<ul class='other-services-list' style='list-style:none;-webkit-padding-start:0;'>"+services+'</ul>';
    }

    function createButtons(siteInformation) {
        var buttons = {
            start: "<a href=\"#\" class=\"btn btn-primary start\" data-location='"+siteInformation.location+"'>START</a>",
            stop: "<a href=\"#\" class=\"btn btn-primary stop\" data-name='"+siteInformation.name+"'>STOP</a>",
            restart: "<a href=\"#\" class=\"btn btn-primary restart\" data-location='"+siteInformation.location+"'>RESTART</a>"
        };
        if(siteInformation.status === 'running') {
            return buttons.stop + buttons.restart;
        } else {
            return buttons.start;
        }
    }

    var template = '<div class="col-lg-4 col-md-12 mb-6"><div class="card">'+createSiteLogo(site)+'<div class="card-block">'+createSiteTitle(site)+'<p class="card-text">'+createSiteInformation(site)+'</p></div><div class="card-footer">'+createButtons(site)+'</div></div></div>';
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

//bindings
$('body').on('click','.start',function(evt){
    $.LoadingOverlay("show");
    $.post( "/start", { siteLocation: $(this).data('location') })
        .done(function( data ) {
            alert( data + ' - reloading UI.' );
            location.reload();
        })
        .fail(function( data ) {
            alert( "Start Failed! - " + data.statusText);
            location.reload();
        });
});

$('body').on('click','.stop',function(evt){
    $.LoadingOverlay("show");
    $.post( "/stop", { siteID: $(this).data('name') })
        .done(function( data ) {
            alert( data + ' - reloading UI.' );
            location.reload();
        })
        .fail(function( data ) {
            alert( "Stop Failed! - " + data.statusText);
            location.reload();
        });
});
$('body').on('click','.restart',function(evt){
    $.LoadingOverlay("show");
    $.post( "/restart", { siteLocation: $(this).data('location')})
        .done(function( data ) {
            alert( data + ' - reloading UI.' );
            location.reload();
        })
        .fail(function( data ) {
            alert( "Restart Failed! - " + data.statusText);
            location.reload();
        });
});