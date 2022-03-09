namespace Utility
{
    export class Arrays
    {
        static FisherYatesShuffle<T>( array: Array<T> ): void
        {
            for ( let idx: number = array.length - 1; idx > 0; --idx )
            {
                const randIdx: number = Random.Range( 0, idx + 1 );

                const temp: T = array[idx];
                array[idx] = array[randIdx];
                array[randIdx] = temp;
            }
        }

        static Remove<T>( array: Array<T>, item: T ): void
        {
            const index: number = array.indexOf( item );
            if ( index >= 0 )
            {
                array.splice( index, 1 );
            }
        }
    }
}