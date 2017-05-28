import { suite, test } from "mocha-typescript";
import { expect } from 'chai';
import { AddressService } from '../addressService'
import { ICouncilApi } from '../wiltshireApi'
import * as Moq from 'typemoq'
import * as fs from 'fs';
import constants from '../constants';

@suite class AddressServiceTests {
    apiMock: Moq.IMock<ICouncilApi>;
    addressService: AddressService;

    constructor() {
        this.apiMock = Moq.Mock.ofType<ICouncilApi>();
        this.addressService = new AddressService(this.apiMock.object);
    }

    afterEach() {
        this.apiMock.reset();
    }

    @test 'Can filter address correctly'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
            {"address": "3 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1015", "district": "Someplace"},
            {"address": "4 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1020", "district": "Someplace"}
        ];

        this.apiMock.setup(x => x.getAddresses(Moq.It.isAnyString()))
                    .returns(x => this.createResolvingPromise(addressData));
       
            return this.addressService.getAddressId('SN22 1AA', '3 Fake Street').then(function(id) {
                expect(id).to.equal("1015");
            });
    }

    @test 'Can filter addresses with different casing'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 FAKE STREET, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
        ];

        this.apiMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA")))
                    .returns(x => this.createResolvingPromise(addressData));

        return this.addressService.getAddressId('SN22 1AA', '2 Fake Street').then(id => {
            expect(id).to.equal("1010");
        })
    }

    @test 'Can filter addresses with extra characters'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
            {"address": "   3, Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1022", "district": "Someplace"},

        ];

        this.apiMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA")))
                    .returns(x => this.createResolvingPromise(addressData));

        return this.addressService.getAddressId('SN22 1AA', '3 Fake Street').then(id => {
            expect(id).to.equal("1022");
        })
    }

    @test 'Can filter with just street name'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
            {"address": "3 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1022", "district": "Someplace"},

        ];

        this.apiMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA")))
                    .returns(x => this.createResolvingPromise(addressData));

        return this.addressService.getAddressId('SN22 1AA', 'fake street').then(id => {
            expect(id).to.equal("1005");
        })
    }

 
    private createResolvingPromise<T>(returnValue:T): Promise<T> {
        return new Promise<T>((resolve,reject) => { resolve(returnValue); });
    }
}
