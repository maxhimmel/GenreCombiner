import html from "bundle-text:../../../../assets/html/genreCombiner/genreComboItem.html";

import { GenreComboModel } from "../../../genre/genreComboModel";
import { GenreModel } from "../../../genre/genreModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { DeltaArgs, Observable } from "../../../utility/observable";

export class GenreComboItem
{
    get slotSelected(): IEvent<SlotLookup>
    {
        return this._slotSelected;
    }

    get slotIndex(): number
    {
        return this._slotIndex;
    }

    private readonly _slotIndex: number;
    private readonly _genreToButton: Map<Observable<GenreModel>, HTMLElement> = new Map();
    private readonly _slotSelected: EventHandler<SlotLookup> = new EventHandler();

    private _root: HTMLElement | null = null;
    private _buttons: NodeListOf<HTMLElement> | null = null;
    private _comboDivider: HTMLElement | null = null;

    constructor( parent: HTMLElement, slotIndex: number )
    {
        this._slotIndex = slotIndex;

        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._root = root;
        this._buttons = root.querySelectorAll( ".btn-genre" );
        this._comboDivider = root.querySelector( ".combo-divider-icon" );
    }

    init( combo: GenreComboModel ): void
    {
        if ( this._buttons === null )
        {
            throw new ReferenceError();
        }
        if ( this._buttons.length !== combo.combo.length )
        {
            throw new RangeError();
        }

        for ( let idx: number = 0; idx < combo.combo.length; ++idx )
        {
            const genreObservable = combo.combo[idx];
            const genreButton = this._buttons[idx];

            this._genreToButton.set( genreObservable, genreButton );

            this.updateLabel( genreButton, genreObservable.item );
            genreObservable.changed.subscribe( this.onGenreChanged );

            genreButton.addEventListener( "click", this.onGenreClicked );
        }

        combo.queuedSwapSlotChanged.subscribe( this.onQueuedSwapSlotChanged );
        combo.isLocked.changed.subscribe( this.onLockedStateChanged );
    }

    private onGenreChanged = ( sender: Observable<GenreModel>, changeArgs: DeltaArgs<GenreModel> ): void =>
    {
        if ( !this._genreToButton.has( sender ) )
        {
            throw new RangeError();
        }

        const label = this._genreToButton.get( sender ) as HTMLElement;
        this.updateLabel( label, changeArgs.current );
    }

    private updateLabel( label: HTMLElement, genre: GenreModel ): void
    {
        label.innerText = genre.name;
    }

    private onGenreClicked = ( evt: Event ): void =>
    {
        if ( this._buttons === null )
        {
            return;
        }

        const genreIndex = this.getButtonIndex( evt.target as HTMLElement );
        this._slotSelected.invoke( this, new SlotLookup( this._slotIndex, genreIndex ) );
    }

    private getButtonIndex( button: HTMLElement ): number
    {
        if ( this._buttons === null )
        {
            throw new ReferenceError();
        }

        for ( let idx: number = 0; idx < this._buttons.length; ++idx )
        {
            const btn = this._buttons[idx];
            if ( btn === button )
            {
                return idx;
            }
        }

        throw new RangeError();
    }

    private onQueuedSwapSlotChanged = ( sender: GenreComboModel, changeArgs: DeltaArgs<number> ): void =>
    {
        if ( this._buttons === null ) 
        {
            return;
        }

        if ( changeArgs.current === GenreComboModel.EMPTY_SLOT )
        {
            this.removeSwapQueue();
            return;
        }

        for ( let idx: number = 0; idx < this._buttons.length; ++idx )
        {
            const button = this._buttons[idx];
            const isQueuedSlot = ( idx === changeArgs.current );

            button.toggleAttribute( "disabled", !isQueuedSlot );

            if ( isQueuedSlot )
            {
                button.classList.add( "swap-queued" );
            }
        }
    }

    private onLockedStateChanged = ( sender: GenreComboModel, changeArgs: DeltaArgs<boolean> ): void =>
    {
        this.toggleAvailableForSwap( false );
        this.removeSwapQueue();

        this._root?.classList.toggle( "locked", changeArgs.current );
        this._comboDivider?.classList.toggle( "locked", changeArgs.current );

        this._buttons?.forEach( ( elem =>
        {
            elem.toggleAttribute( "disabled", changeArgs.current );
        } ) );
    }

    private removeSwapQueue(): void
    {
        if ( this._buttons !== null )
        {
            this._buttons.forEach( ( elem ) =>
            {
                elem.classList.remove( "swap-queued" );
                elem.removeAttribute( "disabled" );
            } );
        }
    }

    toggleAvailableForSwap( force?: boolean ): void
    {
        this._buttons?.forEach( ( elem ) =>
        {
            elem.classList.toggle( "swap-available", force );
        } );
    }
}

export class SlotLookup
{
    static readonly empty: SlotLookup = new SlotLookup();

    comboSlot: number;
    genreSlot: number;

    constructor( comboSlot: number = -1, genreSlot: number = -1 )
    {
        this.comboSlot = comboSlot;
        this.genreSlot = genreSlot;
    }

    isEqual( other: SlotLookup ): boolean
    {
        return this.comboSlot === other.comboSlot
            && this.genreSlot === other.genreSlot;
    }
};