import html from "bundle-text:../../../../../assets/html/battler/bracketPool/bracketPoolContainer.html"

import { GenreComboModel } from "../../../../genre/genreComboModel";
import { HtmlTemplateBuilder } from "../../../../utility/htmlTemplateBuilder";
import { BattlerPoolItem } from "./battlerPoolItem";

export class BattlerPoolMenu
{
    private readonly _items: Map<GenreComboModel, BattlerPoolItem>;
    private _container: HTMLElement | null = null;

    constructor( parent: HTMLElement, combos: GenreComboModel[] )
    {
        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
        
        this._items = new Map();
        for ( let idx: number = 0; idx < combos.length; ++idx )
        {
            const genreCombo = combos[idx];
            this._items.set( genreCombo, new BattlerPoolItem( this._container as HTMLElement, genreCombo ) );
        }
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._container = root.querySelector( ".bracket-container" );
    }

    setBattlers( lhsCombo: GenreComboModel, rhsCombo: GenreComboModel, isBattling: boolean ): void
    {
        const lhsItem = this.getItem( lhsCombo );
        const rhsItem = this.getItem( rhsCombo );

        lhsItem.setBattling( isBattling );
        rhsItem.setBattling( isBattling );
    }

    setLoser( loser: GenreComboModel ): void
    {
        const item = this.getItem( loser );
        item.setLoser();
    }

    private getItem( combo: GenreComboModel ): BattlerPoolItem
    {
        if ( !this._items.has( combo ) )
        {
            throw new RangeError();
        }

        return this._items.get( combo ) as BattlerPoolItem;
    }
}