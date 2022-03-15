import { Random } from "./random";

export class ArrayUtil
{
    private constructor() { }

    static fisherYatesShuffle<T>( array: Array<T> ): void
    {
        for ( let idx: number = array.length - 1; idx > 0; --idx )
        {
            const randIdx: number = Random.range( 0, idx + 1 );

            const temp: T = array[idx];
            array[idx] = array[randIdx];
            array[randIdx] = temp;
        }
    }

    static remove<T>( array: Array<T>, item: T ): void
    {
        const index: number = array.indexOf( item );
        if ( index >= 0 )
        {
            array.splice( index, 1 );
        }
    }

    static createRange( count: number, start: number = 0 ): number[]
    {
        const range: number[] = new Array( count );
        for ( let idx: number = 0; idx < count; ++idx )
        {
            range[idx] = idx + start;
        }
        return range;
    }

    static clear<T>( array: Array<T> ): void
    {
        array.splice( 0, array.length );
    }
}