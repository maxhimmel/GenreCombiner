import * as Events from "./iEvent";
import { ArrayUtil } from "../arrays";

export class EventHandler<TArg> implements Events.IEvent<TArg>
{
    get event(): Events.IEvent<TArg>
    {
        return this;
    }

    private _handlers: Events.Signature<TArg>[] = [];

    subscribe( func: Events.Signature<TArg> ): void
    {
        this._handlers.push( func );
    }

    unsubscribe( func: Events.Signature<TArg> ): void
    {
        ArrayUtil.remove( this._handlers, func );
    }

    invoke( sender: any, arg: TArg ): void
    {
        this._handlers.forEach( handle => handle( sender, arg ) );
    }

    clear(): void
    {
        ArrayUtil.clear( this._handlers );
    }
}