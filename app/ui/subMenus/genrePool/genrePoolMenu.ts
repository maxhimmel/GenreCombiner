import { GenreModel } from "../../../genre/genreModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { Observable } from "../../../utility/observable";
import { SubMenu } from "../../iSubMenu";
import { GenrePoolItem } from "./genrePoolItem";

export class GenrePoolMenu extends SubMenu
{
    get allotment(): Observable<number> | null
    {
        return this._replacementCount;
    }
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
    private readonly _replacementCount: Observable<number>;
    private readonly _poolItems: GenrePoolItem[] = [];

    constructor(
        container: HTMLElement,
        genres: Generator<Observable<GenreModel>>,
        replacementCount: Observable<number> )
    {
        super( container );

        let slotIndex: number = 0;
        for ( let genre of genres )
        {
            const item = new GenrePoolItem( slotIndex++ );
            this._poolItems.push( item );

            item.init( genre, this._container );
            item.shuffled.subscribe( this.onShuffled );
        }

        this._replacementCount = replacementCount;
    }

    private onShuffled = ( sender: any, slotIndex: number ): void =>
    {
        this._shuffled.invoke( sender, slotIndex );
    }

    setReplacingActive( isActive: boolean ): void
    {
        for ( let item of this._poolItems )
        {
            item.setReplacingActive( isActive );
        }
    }
}