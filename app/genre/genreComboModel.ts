import { GenreModel } from "./genreModel";
import { Observable } from "../utility/observable";
import { IEvent } from "../utility/events/ievent";

export class GenreComboModel
{
    get queuedSwapSlotChanged(): IEvent<number>
    {
        return this._queuedSwapSlot.changed;
    }
    get battlePointsChanged(): IEvent<number>
    {
        return this._battlePoints.changed;
    }

    get queuedSwapSlot(): number
    {
        return this._queuedSwapSlot.item;
    }

    readonly combo: Observable<GenreModel>[];
    readonly isLocked: Observable<boolean>;
    
    private readonly _queuedSwapSlot: Observable<number>;
    private readonly _battlePoints: Observable<number>;

    constructor( ...genreArgs: GenreModel[] )
    {
        this.combo = new Array( genreArgs.length );
        for ( let idx: number = 0; idx < genreArgs.length; ++idx )
        {
            const genre = genreArgs[idx];
            this.combo[idx] = new Observable( this, genre );
        }

        this.isLocked = new Observable<boolean>( this, false );
        this._queuedSwapSlot = new Observable( this, -1 );
        this._battlePoints = new Observable( this, 0 );
    }

    queueForSwap( swapSlot: number ): void
    {
        if ( swapSlot < 0 || swapSlot >= this.combo.length )
        {
            throw new RangeError();
        }
        if ( this.isQueuedForSwap() )
        {
            throw new Error( "This is already queued for swapping. Did you mean to cancel the swap first?" );
        }

        if ( this.isSwapCanceled( swapSlot ) )
        {
            this.cancelSwapQueue();
            return;
        }

        this._queuedSwapSlot.item = swapSlot;
    }

    private isQueuedForSwap(): boolean
    {
        return this._queuedSwapSlot.item !== -1;
    }

    private isSwapCanceled( swapSlot: number ): boolean
    {
        return swapSlot === this._queuedSwapSlot.item;
    }

    cancelSwapQueue(): void
    {
        this._queuedSwapSlot.item = -1;
    }

    addBattlePoint(): void
    {
        ++this._battlePoints.item;
    }

    removeBattlePoint(): void
    {
        const points = this._battlePoints.item;
        if ( points > 0 )
        {
            --this._battlePoints.item;
        }
    }

    toString(): string
    {
        let result: string = `${this.combo[0].item.name}`;
        for ( let idx: number = 1; idx < this.combo.length; ++idx )
        {
            const genre = this.combo[idx].item;
            result += ` + ${genre.name}`;
        }

        return result;
    }
}