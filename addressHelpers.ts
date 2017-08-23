export function isValidPostcode(postcode: string): boolean {
    var re = /^[a-z]{1,2}[0-9]{1,2}\s?[0-9][A-Z]{2}$/i;
    return re.test(postcode.trim());
}

export function getOutwardCodeFromPostcode(postcode: string) {
    let re = /^([a-z]{1,2}[0-9]{1,2})\s?[0-9]{1}[a-z]{2}/i;
    let matches = re.exec(postcode);
    return matches != null ? matches[1] : ""; 
}