// import addressService = require('./addressService'),
// import collectionDataService = require('./collectionDataService');
import {Handler} from 'alexa-sdk'

export interface IIntent {
    handler(alexa:Handler): void
}



export class GetCollectionsIntent implements IIntent {
    
    public handler(alexa:Handler) {
        
    }
}


