const wiltshireApi = require("./wiltshireApi");

exports.getAddress = function(postcode, addressFirstLine) {
    
    return wiltshireApi.getAddresses(postcode).then(function(addresses) {
        var re = new RegExp("^"+addressFirstLine, 'i');
        return addresses.find(a => re.test(a.address));
    });
};