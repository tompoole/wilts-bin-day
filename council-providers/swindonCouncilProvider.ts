import rp = require('request-promise-native')
import { ICouncilProvider, IAddress, ICollectionItem } from './ICouncilApi'
import * as parse from 'xml-parser'
import {XmlEntities} from 'html-entities'
import clock from '../clock'

export class SwindonCouncilProvider implements ICouncilProvider {
    
    name: string = "Swindon"

    entities = new XmlEntities();

    getAddresses(postcode: string, houseNumber: string): Promise<IAddress[]> {
        let xml = `<?xml version="1.0" encoding="utf-8" ?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><getAddressFromPostcode xmlns="http://tempuri2.org/"><username>UN</username><password>PW</password><council>SWN</council><searchString>PC=${postcode}$HN=${houseNumber}$ST=$TW=</searchString></getAddressFromPostcode></soap:Body></soap:Envelope>`
        console.log(xml);
        let request = {
            url: "https://collections-swindon.azurewebsites.net/webservice2.asmx",
            method: "POST",
            body: xml,
            headers: {
                "Content-Type": "text/xml"
            }
        };

        return rp(request).then((response) => {
            console.log(response);
            let parseResult = parse(response);
            let rows = parseResult.root.children[0].children[0].children[0].children[0].children;
            
            if (rows.length == 0) {
                throw `No results for postcode ${postcode}`
            }

            let addresses = rows.map(row => {
                let address = row.children[0].content as string;
                let street = row.children[1].content as string;
                let uprn = row.children[4].content as string
                
                address = this.tidyAddress(address);
                
                return {
                    UPRN: uprn,
                    address: address + " " + street,
                    district: 'SWINDON'
                };
            });


            return addresses;
        });
    }

    private tidyAddress(inputAddress: string): string {
        inputAddress = inputAddress.replace(/#/g, ' ');
        inputAddress = inputAddress.trim();
        inputAddress = inputAddress.replace(/\s{2,}/g, ' ');
        inputAddress = this.entities.decode(this.entities.decode(inputAddress));
        return inputAddress;
    }

    public getRawCollectionData(uprn: string): Promise<string> {
        let xml = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><getRoundInfoForUPRN xmlns="http://tempuri2.org/"><council>SWN</council><UPRN>${uprn}</UPRN><PW>wax01653</PW></getRoundInfoForUPRN></soap:Body></soap:Envelope>`
        let request = {
            url: "https://collections-swindon.azurewebsites.net/webservice2.asmx",
            method: "POST",
            body: xml,
            headers: {
                "Content-Type": "text/xml"
            }
        };

        return rp(request).then(response => {
            let responseXml = response as string;

            if (responseXml.indexOf('<Rows xmlns="" />') >= 0) {
                throw `No collections found for Swindon UPRN ${uprn}.`;
            }

            return responseXml;
        });
    }

    public parseRawCollectionData(rawData: any): ICollectionItem[] {
        let parsedXml = parse(rawData);
        let rows = parsedXml.root.children[0].children[0].children[0].children[0].children[0].children;
        let re = /^([a-z]+) - (.+?) then/i;

        let collectionData = 
            rows.map(row => {
                let content = row.content as string;
                let matches = re.exec(content);

                if (matches == null) {
                    console.error("No match for " + content);
                    return {id: -1, name: "", date: new Date()};
                }
                
                let collectionType = matches[1];
                let dateStr = matches[2];
                let date: Date;

                if (dateStr.startsWith("Tomorrow")) {
                    let today = clock.nowWithoutTime();
                    date = new Date(today.valueOf() + clock.oneDayInMs);
                }
                else {
                    date = new Date(dateStr);
                }

                return {
                    id: 0,
                    name: collectionType,
                    date: date
                }  
            });

        collectionData = collectionData.filter(d => d.id != -1);
        return collectionData;
    }

}