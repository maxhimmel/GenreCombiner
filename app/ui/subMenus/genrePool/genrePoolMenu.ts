import htmlTemplate from "bundle-text:../../../../assets/html/genrePool/genrePoolContainer.html"

import { GenreModel } from "../../../genre/genreModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { DeltaArgs, Observable } from "../../../utility/observable";
import { ISubMenu } from "../../iSubMenu";
import { GenrePoolItem } from "./genrePoolItem";

export class GenrePoolMenu implements ISubMenu
{
    get shuffled(): IEvent<number>
    {
        return this._shuffled;
    }

    get title(): string
    {
        return "Genres";
    }
    get description(): string
    {
        return "Randomly replace any of these genres.";
    }

    private readonly _shuffled: EventHandler<number> = new EventHandler();
    private readonly _root: HTMLElement;

    constructor()
    {
        this._root = new HtmlTemplateBuilder( htmlTemplate )
            .instant();
    }

    attach( parent: HTMLElement ): void
    {
        parent.appendChild( this._root );
    }

    remove(): void
    {
        this._root.remove();
    }

    init( genres: Generator<Observable<GenreModel>> ): void
    {
        let slotIndex: number = 0;
        for ( let genre of genres )
        {
            const item = new GenrePoolItem( slotIndex++ );

            item.init( genre, this._root );
            item.shuffled.subscribe( this.onShuffled );
        }
    }

    private onShuffled = ( sender: any, slotIndex: number ): void =>
    {
        this._shuffled.invoke( sender, slotIndex );
    }
}