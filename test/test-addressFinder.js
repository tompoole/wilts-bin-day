const proxyquire = require('proxyquire');
const should = require('chai').should();
const sinon = require('sinon');

const fs = require("fs");

const apiStub = {};
const addressFinder = proxyquire('../addressFinder', {'./wiltshireApi': apiStub});

const addressData = [
    {UPRN: '321', address: '1 Fake Street', region: 'North'},
    {UPRN: '123', address: '7 Fake Street', region: 'South'},
    {UPRN: '432', address: '9 Fake Street', region: 'North'}
];

describe('Address Finder', function() {
    it('should return a single address', function(done) {

        var getAddresses = sinon.stub(apiStub, 'getAddresses')
        getAddresses.resolves(addressData);

        handlers

        getAddresses.restore();
    });

    it('should fail if address cannot be found', function(done) {

        var getAddresses = sinon.stub(apiStub, 'getAddresses')
        getAddresses.resolves([]);

        addressFinder.getAddressId('SN121AA', '123 Fake Street').catch(function(e) {
            done();
        });

        getAddresses.restore();
    });

  
});



describe('Collection data service', function() {
    it('should parse collection data with garden', function(done) {

        var getData = sinon.stub(apiStub, 'getRawCollectionHtml');
        getData.resolves(getSampleDataFromFile('with-garden.html'));

        addressFinder.getData('123').then(function(data) {
            
            data.waste.name.should.equal('Household waste');
            data.waste.date.should.be.a('date');
            data.waste.date.getFullYear().should.equal(2017);

            data.garden.name.should.equal('Garden waste');
            data.garden.date.should.be.a('date');

            done();
        });

        getData.restore();
    });

    it('should parse collection data without garden', function(done) {

        var getData = sinon.stub(apiStub, 'getRawCollectionHtml');
        getData.resolves(getSampleDataFromFile('without-garden.html'));

        addressFinder.getData('123').then(function(data) {
            data.waste.name.should.equal('Household waste');
            data.waste.date.should.be.a('date');
            data.waste.date.getFullYear().should.equal(2017);        
            
            data.garden.should.be.empty;
            
            done();
        });

        getData.restore();
    });

    it('should correctly parse empty collection data', function(done) {

        var getData = sinon.stub(apiStub, 'getRawCollectionHtml');
        getData.resolves(getSampleDataFromFile('no-collections.html'));

        addressFinder.getData('123').then(function(data) {
            data.waste.should.be.empty;
            data.blackBox.should.be.empty;
            data.plasticBottle.should.be.empty;

            done();
        });

        getData.restore();
    });


});


function getSampleDataFromFile(fileName)
{
    // OK to use sync version here, happens in a console
    return fs.readFileSync("test/data/" + fileName, 'utf8');
}