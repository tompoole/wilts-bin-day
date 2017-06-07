import {ICollectionItem}  from './council-providers/ICouncilApi';
import {humaniseDate} from './dateHumaniser'
import clock from './clock'

function getDaysUntilCollection(date: Date) {
     return (date.valueOf() - clock.nowWithoutTime().valueOf()) / 86400000;
}

export function createResponseFromCollectionData(collectionData: ICollectionItem[]): string {
    collectionData = collectionData.sort((a,b) => a.date.valueOf() - b.date.valueOf());

    let firstCollection = collectionData[0];
    let daysUntilCollection = getDaysUntilCollection(firstCollection.date);

    if (daysUntilCollection == 0 && clock.now().getHours() >= 12)
    {
        collectionData = collectionData.filter(x => x.date.valueOf() !== firstCollection.date.valueOf());
        firstCollection = collectionData[0];
        daysUntilCollection = getDaysUntilCollection(firstCollection.date);
    }

    let allCollectionsOnDate = collectionData.filter(c => c.date.valueOf() == firstCollection.date.valueOf());

    let output;

    if (allCollectionsOnDate.length > 1) {
        let allCollectionsStr = allCollectionsOnDate.map(x => x.name).sort().join(', ');
        allCollectionsStr = allCollectionsStr.replace(/(, )(?!.*,)/, " and ");
        output = `Your next collections are ${allCollectionsStr} ${humaniseDate(firstCollection.date)}. `;
    }
    else {
        output = `Your next collection is ${firstCollection.name} ${humaniseDate(firstCollection.date)}. `;
    }

    let noun = allCollectionsOnDate.length == 1 ? "bin" : "bins";

    if (daysUntilCollection == 0) {
        output += ` Hope you put the ${noun} out!`;
    }
    else if (daysUntilCollection == 1) {
        output += `Don't forget to put the ${noun} out!`;
    }

    return output;
}
