class Subject {
    constructor(defaultState = null) {
        this.observers = [];
        this.state = defaultState;
    }

    subscribe(observer) {
        if (!this.observers.includes(observer)) this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    setState(state) {
        this.state = state;
        this.observers.forEach((observer) => observer.update(state));
    }
}

class Observer {
    constructor(name, customAction) {
        this.name = name;
        this.action = customAction;
    }

    update(data) {
        if (this.action) this.action(data);
    }
}

export { Subject, Observer };
