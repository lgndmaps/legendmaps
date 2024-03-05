export default class ProbTableItem<T> {
    //name: string;
    item: T;
    probability: number;

    constructor(item: T, probability: number) {
        this.item = item;
        this.probability = probability;
        // this.id = uuid(JSON.stringify(item), uuid.URL);
    }
}
