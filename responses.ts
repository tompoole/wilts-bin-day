const responses = {
    'ErrorNoAccessToken': "Sorry, I couldn't get your address. Please ensure you have granted this skill access to your full address details.",    
    'ErrorGettingAddressData': "Sorry, I couldn't get your address. Please ensure you have setup your full address details in the Alexa App. Go to the Settings section, choose your device and enter your address details there.",
    'ErrorFindingAddress': "I'm sorry, I couldn't find your address. Please ensure the address you have entered is within the area and you have entered your house number or name.",
    'ErrorInvalidPostcode': "I'm sorry, the postcode you have provided is invalid. Please ensure you have set your full postcode within the Alexa app.",
    'ErrorGettingCollectionData': "Sorry, I couldn't get your collection information. Please try again later.",
    'Unhandled': "I'm sorry, I didn't understand that. Try asking for your next bin collection.",
    "Help": "Hello! I can tell you when your next bin collection is. Please make sure you have setup your full address for this device in the Alexa app."
};

export default responses;