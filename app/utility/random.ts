export class Random
{
    private constructor() { }

    static range( min: number, max: number ): number
    {
        return Math.floor( Math.random() * ( max - min ) ) + min;
    }
}