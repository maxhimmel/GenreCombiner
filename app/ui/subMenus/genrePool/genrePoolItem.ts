import htmlTemplate from "bundle-text:../../../../assets/html/genrePool/genrePoolItem.html"

import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { GenreModel } from "../../../genre/genreModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { DeltaArgs, Observable } from "../../../utility/observable";

export class GenrePoolItem
{
    get shuffled(): IEvent<number>
    {
        return this._shuffled;
    }

    private readonly _shuffled: EventHandler<number> = new EventHandler();
    private readonly _slotIndex: number = -1;

    private _root: HTMLElement | null = null;
    private _labelElement: HTMLElement | null = null;
    private _shuffleButton: HTMLElement | null = null;

    constructor( slotIndex: number )
    {
        this._slotIndex = slotIndex;
    }
    
    init( genreModel: Observable<GenreModel>, parent: HTMLElement ): void
    {
        new HtmlTemplateBuilder( htmlTemplate )
            .config( elem => this.config( elem ) )
            .build( parent );

        genreModel.changed.subscribe( this.update );
        this.update( this, new DeltaArgs( genreModel.item, GenreModel.empty ) );
    }

    private config = ( element: HTMLElement ): void =>
    {
        this._root = element;
        this._labelElement = element.querySelector( ".btn-genre" );

        this._shuffleButton = element.querySelector( ".btn-shuffle" );
        this._shuffleButton?.addEventListener( "click", this.onShuffleClicked );
    }

    private onShuffleClicked = () =>
    {
        this._shuffled.invoke( this, this._slotIndex );
    }

    private update = ( sender: any, changedArgs: DeltaArgs<GenreModel> ): void =>
    {
        if ( this._labelElement !== null )
        {
            this._labelElement.innerText = changedArgs.current.name;
        }
    }

    remove(): void
    {
        this._root?.remove();
    }
}