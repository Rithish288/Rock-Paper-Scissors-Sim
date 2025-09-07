type Listener<T> = (event: T) => void;

export class EventEmitter<T> {
    private listeners: Listener<T>[] = [];

    public subscribe(listener: Listener<T>): void {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: Listener<T>): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public emit(payload: T): void {
        this.listeners.forEach(listener => listener(payload));
    }
}