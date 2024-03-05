import ProbTableItem from "./probTableItem";
import RandomUtil from "./randomUtil";

export class ProbTable<T> {
    private items: ProbTableItem<T>[];

    constructor() {
        this.items = [];
    }

    public get totalWeight(): number {
        return this.items.reduce((total: number, item: ProbTableItem<T>) => total + item.probability, 0);
    }

    public add(item: T, probRate: number): void {
        if (probRate % 1 !== 0) {
            throw new Error("ProbRate must be an integer");
        }
        this.items.push(new ProbTableItem(item, probRate));
    }

    public roll(): ProbTableItem<T>["item"] {
        let randomNumber: number = RandomUtil.instance.int(0, this.totalWeight);

        for (const item of this.items) {
            if (randomNumber <= item.probability) {
                return item.item;
            } else {
                randomNumber -= item.probability;
            }
        }
    }
}
