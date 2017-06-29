import { suite, test } from "mocha-typescript";
import { expect } from 'chai';
import { AddressService } from '../addressService'
import { ICouncilProvider } from '../council-providers/ICouncilApi'
import * as Moq from 'typemoq'
import * as fs from 'fs';

@suite class AddressServiceTests {
    providerMock: Moq.IMock<ICouncilProvider>;
    addressService: AddressService;
    providers: ICouncilProvider[]

    constructor() {
        this.providerMock = Moq.Mock.ofType<ICouncilProvider>();
        this.providerMock.setup(x => x.name).returns(() => "MockProvider1");
        this.providers = [this.providerMock.object];

        this.addressService = new AddressService();
    }

    @test 'Can filter address correctly'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
            {"address": "3 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1015", "district": "Someplace"},
            {"address": "4 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1020", "district": "Someplace"}
        ];

        this.providerMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA"),  Moq.It.isValue("3")))
                         .returns(x => this.createResolvingPromise(addressData));
       
            return this.addressService.getAddressId(this.providers, 'SN22 1AA', '3 Fake Street')
                       .then(function(result) {
                            expect(result.UPRN).to.equal("1015");
                       });
    }

    @test 'Can filter addresses with different casing'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 FAKE STREET, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
        ];

        this.providerMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA"),  Moq.It.isValue("2")))
                    .returns(x => this.createResolvingPromise(addressData));

        return this.addressService.getAddressId(this.providers, 'SN22 1AA', '2 Fake Street')
                   .then(result => {
                        expect(result.UPRN).to.equal("1010");
                    });
    }

    @test 'Can filter addresses with extra characters'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
            {"address": "   3, Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1022", "district": "Someplace"},

        ];

        this.providerMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA"),  Moq.It.isValue("3")))
                    .returns(x => this.createResolvingPromise(addressData));

        return this.addressService.getAddressId(this.providers, 'SN22 1AA', '3 Fake Street')
                   .then(result => {
                        expect(result.UPRN).to.equal("1022");
                    })
    }

    @test 'Can filter with just street name'() {
        let addressData =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"},
            {"address": "3 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1022", "district": "Someplace"},
        ];

        this.providerMock.setup(x => x.getAddresses(Moq.It.isValue("SN22 1AA"), Moq.It.isValue("")))
                         .returns(x => this.createResolvingPromise(addressData));

        return this.addressService.getAddressId(this.providers,'SN22 1AA', 'fake street')
                   .then(result => {
                        expect(result.UPRN).to.equal("1005");
                    })
    }

     @test 'Can get results from second provider, if none are found in first.'() {
         let addressData1 =  [
            {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
            {"address": "2 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1010", "district": "Someplace"}
         ]

         let addressData2 =  [
            {"address": "1 Some Lane, Tinyvillage, Wiltshire. BA44 2AB", "UPRN": "9090", "district": "Otherplace"},        
            {"address": "5 Some Lane, Tinyvillage, Wiltshire. BA44 2AB", "UPRN": "9292", "district": "Otherplace"},        
         ]

         this.providerMock.setup(x => x.getAddresses(Moq.It.isValue("BA44 2AB"), Moq.It.isValue("5")))
                          .returns(x => this.createResolvingPromise(addressData1));

         let provider2 = Moq.Mock.ofType<ICouncilProvider>();
         provider2.setup(x => x.name).returns(x => "MockProvider2");
         provider2.setup(x => x.getAddresses(Moq.It.isValue("BA44 2AB"), Moq.It.isValue("5")))
                  .returns(x => this.createResolvingPromise(addressData2));

        let providers = [this.providerMock.object, provider2.object];

        return this.addressService.getAddressId(providers, "BA44 2AB", "5 Some Lane")
             .then(r => {
                 expect(r.provider).to.equal("MockProvider2");
                 expect(r.UPRN).to.equal("9292");
             });
     }

     @test.only 'Returns error if no results in any provider'() {
        let addressData = [
           {"address": "1 Fake Street, Sometown, Wiltshire. SN22 1AA", "UPRN": "1005", "district": "Someplace"},        
        ];
        const postcode = "NO1 1AA", houseNumber = "44";

        this.providerMock.setup(x => x.getAddresses(Moq.It.isValue(postcode), Moq.It.isValue(houseNumber)))
                          .returns(x => this.createResolvingPromise(addressData));

        let provider2 = Moq.Mock.ofType<ICouncilProvider>();
        provider2.setup(x => x.name).returns(x => "MockProvider2");
        provider2.setup(x => x.getAddresses(Moq.It.isValue(postcode), Moq.It.isValue(houseNumber)))
                 .returns(x => this.createResolvingPromise([]));

        let providers = [this.providerMock.object, provider2.object];
        
        return this.addressService.getAddressId(providers, postcode, houseNumber)
                   .catch(e => {
                       expect(e).to.be.a('error');

                       let err = e as Error;
                       expect(err.message).to.contain("MockProvider1, MockProvider2");
                   });
     }

 
    private createResolvingPromise<T>(returnValue:T): Promise<T> {
        return new Promise<T>((resolve,reject) => { resolve(returnValue); });
    }
}
