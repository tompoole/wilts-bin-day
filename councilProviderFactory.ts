import {ICouncilProvider} from './council-providers/ICouncilApi'
import {SwindonCouncilProvider} from './council-providers/swindonCouncilProvider'
import {WiltshireCouncilProvider} from './council-providers/wiltshireCouncilProvider'
import {BristolCouncilProvider} from './council-providers/bristolCouncilProvider';


import * as addressHelpers from './addressHelpers'

interface ICouncil {
    name: string;
    postcodes: string[];
}

export class CouncilProviderFactory {

    private councils: ICouncil[] = [
        {name: "Swindon", postcodes: ["SN1", "SN2", "SN25", "SN26", "SN5", "SN4", "SN6"]},
        {name: "Wiltshire", postcodes: ["BA12", "BA13", "BA14", "BA15", "GL8", "RG17", "SN10", "SN11", "SN12", "SN13", "SN14", "SN15", "SN16", "SN4", "SN5", "SN6", "SN8", "SN9", "SP1", "SP11", "SP2", "SP3", "SP4", "SP5", "SP7", "SP9"]},
        {name: "Bristol", postcodes: ["BS1", "BS2", "BS3", "BS4"]}
    ]

    public getCouncilProvidersByPostcode(postcode: string): ICouncilProvider[] {
        let outcode = addressHelpers.getOutwardCodeFromPostcode(postcode);
        outcode = outcode.toLowerCase();

        let matchingProviders = this.councils.filter(x => x.postcodes.find(p => p.toLowerCase().indexOf(outcode) != -1));

        return matchingProviders.map(x => this.getCouncilProviderByName(x.name));
    }

    public getCouncilProviderByName(name: String): ICouncilProvider {
        switch(name) {
            case "Swindon":
                return new SwindonCouncilProvider();
            case "Wiltshire":
                return new WiltshireCouncilProvider();
            case "Bristol":
                return new BristolCouncilProvider();
            default:
                throw new Error("No Provider found for " + name);
        }
    }


}