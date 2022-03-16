export class GenreModel
{
    static readonly empty = new GenreModel( -1, "ERROR" );

    readonly id: number;
    readonly name: string;

    constructor( id: number, name: string )
    {
        this.id = id;
        this.name = name;
    }

    toString(): string
    {
        return this.name;
    }
}