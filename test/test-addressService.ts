import { suite, test } from "mocha-typescript";
import { expect } from 'chai';
import { AddressService } from '../addressService'
import { IWiltsApi } from '../wiltshireApi'
import * as Moq from 'typemoq'
import constants from '../constants';

@suite class AddressServiceTests {
    apiMock: Moq.IMock<IWiltsApi>;
    addressService: AddressService;

    constructor() {
        this.apiMock = Moq.Mock.ofType<IWiltsApi>();
        this.addressService = new AddressService(this.apiMock.object);
    }

    afterEach() {
        this.apiMock.reset();
    }

    collectionData: [
        {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
        {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
        {"address": "3 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1015", "district": "Someplace"},
        {"address": "4 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1020", "district": "Someplace"}
    ];

    

    @test 'Can filter address correctly'() {

        // this.apiMock.setup(x => x.getAddresses(Moq.It.isAnyString()))
        //             .returns(x => this.createResolvingPromise(this.collectionData));
        
        //     return this.addressService.getAddressId('SN22 1AA', '3 Fake Street').then(function(id) {
        //         expect(id).to.equal("1015");
        //     });
    }

 
    private createResolvingPromise<T>(returnValue:T): Promise<T> {
        return new Promise<T>((resolve,reject) => { resolve(returnValue); });
    }
}
