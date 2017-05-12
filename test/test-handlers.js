const proxyquire = require('proxyquire');
const should = require('chai').should();
const sinon = require('sinon');

const addressFinderStub = {};
const handlers = proxyquire('../handlers', {
    './addressFinder': addressFinderStub
});

describe('Get Collections Handlers', function() {
    it('should work', function(done) {

        var getAddressIdStub = sinon.stub(addressFinderStub, 'getAddressId');
        getAddressIdStub.resolves('123');

        var getDataStub = sinon.stub(addressFinderStub, 'getData')
        getDataStub.resolves({hello:true});
        
        var context = createFakeContext(); 
        handlers.GetNextBinCollection.call(context);

        setTimeout(function() {
            context.emit.called.should.be.true;
            done();
        }, 5);

    });

});

function createFakeContext() {
    return {
        emit: sinon.spy()
    };
}