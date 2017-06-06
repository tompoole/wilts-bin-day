class Singleton {
    private static instance: Singleton;
    private constructor() {
        // do something construct...
    }
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
            // ... any one time initialization goes here ...
        }
        return Singleton.instance;
    }
    someMethod() { }
}
