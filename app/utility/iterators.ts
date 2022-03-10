type Signature<TArg> = ( args: TArg ) => void;

export class IteratorUtil
{
    private constructor() { }

    static forEach<T>( iter: Generator<T>, callbackfn: Signature<T> ): void
    {
        let current = iter.next();
        while ( !current.done )
        {
            callbackfn( current.value );
            current = iter.next();
        }
    }
}