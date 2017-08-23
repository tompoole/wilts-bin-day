import { suite, test, slow, timeout } from 'mocha-typescript'
import {IAlexaApi, AddressResponse} from '../alexaApi';
import { expect } from 'chai';
import {CachedAlexaApi} from '../cachedAlexaApi';
import * as Moq from 'typemoq'

@suite.only()
class CachedAlexaApiTests {

    cachedApi:IAlexaApi;
    mockAlexaApi: Moq.IMock<IAlexaApi>;

    constructor() {
        this.mockAlexaApi = Moq.Mock.ofType<IAlexaApi>();
        this.cachedApi = new CachedAlexaApi(this.mockAlexaApi.object);
    }

    @test.only 'Will use cached address if exists'() {
        let event: any = {
            session: {
                user: {
                    userId: "testAccountId"
                }
            }
        };

        return this.cachedApi.getAddressForDevice(event).then(r => {
            expect(r.postcode).to.eq("AB12 3XY");
            expect(r.addressLine1).to.eq("Address Line 1");
        });
    }

    @test.only 'Will fallback to existing API if not found in cache.'() {
        let event: any = {
            session: {
                user: {
                    userId: "amzn1.ask.account.abcefgh"
                }
            }
        };

        this.mockAlexaApi.setup(x => x.getAddressForDevice(Moq.It.isAny()))
                         .returns(x => Promise.resolve<AddressResponse>({postcode: "BA1 1AA", addressLine1: "123 Fake Street"}))

        return this.cachedApi.getAddressForDevice(event).then(r => {
            expect(r.addressLine1).to.equal("123 Fake Street");
            expect(r.postcode).to.equal("BA1 1AA");
        });
    }

    @test.only 'Will fallback to existing API if user ID not found'() {
        let event: any = {
            session: {
                user: {
                    nothing: 'here'
                }
            }
        };

        this.mockAlexaApi.setup(x => x.getAddressForDevice(Moq.It.isAny()))
                         .returns(x => Promise.resolve<AddressResponse>({postcode: "BA1 1AA", addressLine1: "123 Fake Street"}))

        return this.cachedApi.getAddressForDevice(event).then(r => {
            expect(r.addressLine1).to.equal("123 Fake Street");
            expect(r.postcode).to.equal("BA1 1AA");
        });
    }


}