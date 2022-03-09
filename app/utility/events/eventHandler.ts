namespace GenreCombiner.Events
{
    export class EventHandler<TArg> implements IEvent<TArg>
    {
        private _handlers: Signature<TArg>[] = [];

        Subscribe( func: Signature<TArg> ): void
        {
            this._handlers.push( func );
        }

        Unsubscribe( func: Signature<TArg> ): void
        {
            Utility.Arrays.Remove( this._handlers, func );
        }

        Invoke( sender: any, arg: TArg ): void
        {
            this._handlers.forEach( handle => handle( sender, arg ) );
        }

        get Event(): IEvent<TArg>
        {
            return this;
        }
    }
}