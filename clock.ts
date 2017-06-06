export default class clock {
    
    static now(): Date {
        return new Date();
    }

    static readonly oneDayInMs = 86400000;

    static nowWithoutTime() : Date {
        let now = clock.now();
        now.setHours(0,0,0,0);
        return now;
    }
}