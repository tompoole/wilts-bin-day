const wiltshireApi = require("./wiltshireApi");

exports.getAddressId = function(postcode, addressFirstLine) {
    return wiltshireApi.getAddresses(postcode).then(function(addresses) {
        var re = new RegExp("^"+addressFirstLine, 'i');
        var address = addresses.find(a => re.test(a.address));

        if (address) {
            return address.UPRN;
        }
        else {
            throw "Could not find address";
        }
    });
};

exports.getData = function(addressId) {
    return wiltshireApi.getRawCollectionHtml(addressId).then(function(rawHtml) {
        var response = {
            waste: getCollectionById(rawHtml, '56'),
            blackBox: getCollectionById(rawHtml, '8'),
            plasticBottle: getCollectionById(rawHtml, '63'),
            garden: getCollectionById(rawHtml, '92')
        };

        return response;
    });
};



function getCollectionById(html, id) {
    var re = new RegExp('service-' + id + '"><\/span>([^]+?):<\/strong>[^]+?\">([^]+?)<\/div>', 'm');
    var matches = re.exec(html);

    if (matches == null) {
        return {};
    }

    var name = matches[1].replace('(chargeable)','').trim();
    
    var date = new Date(matches[2].trim());
    date.setHours(0,0,0);

    return { name, date };
}
