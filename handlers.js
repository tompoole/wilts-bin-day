const addressFinder = require("./addressFinder");

const getNextCollectionHandler = function() {
      var c = this;
      addressFinder.getAddressId('SN15 1DF', 'Boo`')
                    .catch(function() {
                        c.emit(':tell', 'Sorry, your address could\'t be found');
                    })
                    .then(addressFinder.getData)
                    .catch(function(e) {
                        c.emit(':tell', 'Sorry, we couldn\'t get collection data');
                    })
                    .then(function(data) {
                        var speak = `Success ${data.waste.name}`;
                        c.emit(':tell', speak);
                    });
}

exports.GetNextBinCollection = getNextCollectionHandler;