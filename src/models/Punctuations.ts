export class Punctuation {
    id: number;
    name: string;
    value: number;

    constructor (id: number | string, name: string, value: number) {
        this.id = Number(id);
        this.name = name;
        this.value = value;
    }
}