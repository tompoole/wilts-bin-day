const rp = require('request-promise');
const Promise = require('bluebird');

exports.getAddresses = function(postcode) {    
    var options = {
        uri: "http://www.wiltshire.gov.uk/rubbish-collection/address-list",
        method: "POST",
        form: {
            postcode: postcode
        },
        json:true
    };

    return rp(options).then(function(r) {
        if (r.message !== "OK") {
            throw "API call error: "+r.message;
        }

        return r.response;
    });

    
};

exports.getRawCollectionHtml = function(uprn) {
    var options = {
        uri: "http://www.wiltshire.gov.uk/rubbish-collection/address-area",
        method: "POST",
        form: {
            uprn
        },
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Required, otherwise server 500s
        }
    };

    return rp(options).then(function(response) {
        if (response.indexOf('Sorry...') >= 0) {
            throw "Collection data not found for UPRN " + uprn;
        }

        return response;
    });
}

