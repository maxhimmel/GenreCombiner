import html from "bundle-text:../../../../assets/html/battler/battlerItem.html";

import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { GenreComboModel } from "../../../genre/genreComboModel";

export class BattleComboItem
{
    private _root: HTMLElement | null = null;

    constructor( parent: HTMLElement )
    {
        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._root = root;
    }

    update( combo: GenreComboModel ): void
    {
        if ( this._root === null )
        {
            return;
        }

        if ( this._root.firstChild !== null )
        {
            this._root.firstChild.textContent = combo.combo[0].item.name;
        }
        if ( this._root.lastChild !== null )
        {
            this._root.lastChild.textContent = combo.combo[1].item.name;
        }
    }

    async playWinAnimation(direction: number): Promise<void>
    {
        const side = this.getSideClassName( direction );
        this._root?.classList.add( "smash", side );
    }

    async playLoseAnimation(direction: number): Promise<void>
    {
        const side = this.getSideClassName( direction );
        this._root?.classList.add( "hurt", side );
    }

    private getSideClassName( side: number ): string
    {
        if ( side === 0 )
        {
            return "";
        }

        return side < 0 ? "lhs" : "rhs";
    }

    clearAnimations(): void
    {
        this._root?.classList.remove( "smash", "hurt", "lhs", "rhs" );
    }
}