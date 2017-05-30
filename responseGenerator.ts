import {ICollectionItem}  from './collectionDataService';
import {humaniseDate} from './dateHumaniser'

export var __nowOverride: Date | undefined = undefined;

export function _setNowOverride(d : Date) {
    __nowOverride = d;
}

function getNow(): Date {
    if (__nowOverride) return new Date(__nowOverride.valueOf());
    return new Date();
}

function isToday(date:Date){
    let now = getNow();
    now.setHours(0,0,0,0);
    date.setHours(0,0,0,0);
    return (now.valueOf() === date.valueOf());
}

export function createResponseFromCollectionData(collectionData: ICollectionItem[]): string {
    collectionData = collectionData.sort((a,b) => a.date.valueOf() - b.date.valueOf());
    
    let firstCollection = collectionData[0];

    if (isToday(firstCollection.date) && getNow().getHours() >= 17)
    {
        collectionData = collectionData.filter(x => x.date.valueOf() !== firstCollection.date.valueOf());
        firstCollection = collectionData[0];
    }

    let allCollectionsOnDate = collectionData.filter(c => c.date.valueOf() == firstCollection.date.valueOf());

    if (allCollectionsOnDate.length > 1) {
        let allCollectionsStr = allCollectionsOnDate.map(x => x.name).sort().join(', ');
        allCollectionsStr = allCollectionsStr.replace(/(, )(?!.*,)/, " and ");
        return `Your next collections are ${allCollectionsStr} ${humaniseDate(firstCollection.date)}`;
    }
    else {
        return `Your next collection is ${firstCollection.name} ${humaniseDate(firstCollection.date)}`;
    }
}
