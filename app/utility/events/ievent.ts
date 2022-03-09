export type Signature<TArg> = ( sender: any, args: TArg ) => void;

export interface IEvent<TArg>
{
    subscribe( func: Signature<TArg> ): void;
    unsubscribe( func: Signature<TArg> ): void;
}