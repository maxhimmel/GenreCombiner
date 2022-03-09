namespace GenreCombiner.Events
{
    export type Signature<TArg extends EventArgs> = ( sender: any, args: TArg ) => void;

    export interface IEvent<TArg extends EventArgs>
    {
        Subscribe( func: Signature<TArg> ): void;
        Unsubscribe( func: Signature<TArg> ): void;
    }
}