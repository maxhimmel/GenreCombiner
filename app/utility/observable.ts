import { EventHandler } from "./events/eventHandler";
import { IEvent } from "./events/ievent";

export class DeltaArgs<TItem>
{
    readonly current: TItem;
    readonly prev: TItem;

    constructor( current: TItem, prev: TItem )
    {
        this.current = current;
        this.prev = prev;
    }
}

export class Observable<TItem>
{
    get item(): TItem
    {
        return this._item;
    }

    set item( newItem: TItem )
    {
        if ( newItem !== this._item )
        {
            const args = new DeltaArgs( newItem, this._item );
            this._item = newItem;

            this._changed.invoke( this._owner, args );
        }
    }

    get changed(): IEvent<DeltaArgs<TItem>>
    {
        return this._changed;
    }

    private readonly _owner: any;
    private readonly _changed: EventHandler<DeltaArgs<TItem>> = new EventHandler();
    private _item: TItem;

    constructor( owner: any, item: TItem )
    {
        this._owner = owner;
        this._item = item;
    }
}