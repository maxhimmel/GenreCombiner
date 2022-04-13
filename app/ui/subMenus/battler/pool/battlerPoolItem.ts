import html from "bundle-text:../../../../../assets/html/battler/bracketPool/bracketPoolItem.html";

import { GenreComboModel } from "../../../../genre/genreComboModel";
import { HtmlTemplateBuilder } from "../../../../utility/htmlTemplateBuilder";

export class BattlerPoolItem
{
    private _labelParent: HTMLElement | null = null;

    constructor( parent: HTMLElement, combo: GenreComboModel )
    {
        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
        
        this.update( combo );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._labelParent = root.querySelector( ".btn-bracket" );
    }

    update( combo: GenreComboModel ): void
    {
        if ( this._labelParent === null )
        {
            return;
        }

        if ( this._labelParent.firstChild !== null )
        {
            this._labelParent.firstChild.textContent = combo.combo[0].item.name;
        }
        if ( this._labelParent.lastChild !== null )
        {
            this._labelParent.lastChild.textContent = combo.combo[1].item.name;
        }
    }

    setBattling( isBattling: boolean ): void
    {
        this._labelParent?.toggleAttribute( "disabled", isBattling );
    }

    setLoser(): void
    {
        this._labelParent?.toggleAttribute( "disabled", true );
        this._labelParent?.classList.toggle( "lose", true );
    }
}