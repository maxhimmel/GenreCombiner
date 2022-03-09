export type Signature<TArg> = ( sender: any, args: TArg ) => void;

export interface IEvent<TArg>
{
    Subscribe( func: Signature<TArg> ): void;
    Unsubscribe( func: Signature<TArg> ): void;
}