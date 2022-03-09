import { EventHandler } from "./events/eventHandler";
import { IEvent } from "./events/ievent";

export class Observable<TItem>
{
    get item(): TItem {
        return this._item;
    }

    set item( newItem:TItem ) {
        if ( newItem !== this._item )
        {
            this._item = newItem;
            this._changed.invoke( this._owner, newItem );
        }
    }
    
    get changed(): IEvent<TItem> {
        return this._changed;
    }

    private readonly _owner: any;
    private _item: TItem;
    private _changed: EventHandler<TItem> = new EventHandler();

    constructor( owner: any, item: TItem )
    {
        this._owner = owner;
        this._item = item;
    }
}