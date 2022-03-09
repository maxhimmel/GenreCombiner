import * as Events from "./ievent";
import { ArrayUtil } from "../arrays";

export class EventHandler<TArg> implements Events.IEvent<TArg>
{
    private _handlers: Events.Signature<TArg>[] = [];

    Subscribe( func: Events.Signature<TArg> ): void
    {
        this._handlers.push( func );
    }

    Unsubscribe( func: Events.Signature<TArg> ): void
    {
        ArrayUtil.Remove( this._handlers, func );
    }

    Invoke( sender: any, arg: TArg ): void
    {
        this._handlers.forEach( handle => handle( sender, arg ) );
    }

    get Event(): Events.IEvent<TArg>
    {
        return this;
    }
}