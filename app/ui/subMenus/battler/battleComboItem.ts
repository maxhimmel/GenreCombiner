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
        this._root.style.transform = "scale(0)";
    }

    async update( combo: GenreComboModel ): Promise<void>
    {
        if ( this._root === null )
        {
            return;
        }
        
        await this.playTransition( "anim-shrink", "scale(0)" );

        if ( this._root.firstChild !== null )
        {
            this._root.firstChild.textContent = combo.combo[0].item.name;
        }
        if ( this._root.lastChild !== null )
        {
            this._root.lastChild.textContent = combo.combo[1].item.name;
        }

        await this.playTransition( "anim-grow", "scale(1)" );
    }

    private async playTransition( name: string, value: string ): Promise<void>
    {
        if ( this._root !== null )
        {
            if ( !this._root.classList.toggle( name ) )
            {
                return;
            }

            window.requestAnimationFrame( () =>
            {
                if ( this._root !== null )
                {
                    this._root.style.transform = value;
                }
            } );
            await this._root.waitForTransitionEnd();
            
            this._root.classList.toggle( name );
        }
    }

    async playWinAnimation(direction: number): Promise<void>
    {
        const side = this.getSideClassName( direction );
        this._root?.classList.add( "smash", side );

        await this._root?.waitForAnimationEnd();

        this.clearAnimations();
    }

    async playLoseAnimation(direction: number): Promise<void>
    {
        const side = this.getSideClassName( direction );
        this._root?.classList.add( "hurt", side );

        await this._root?.waitForAnimationEnd();

        this.clearAnimations();
    }

    private getSideClassName( side: number ): string
    {
        if ( side === 0 )
        {
            return "";
        }

        return side < 0 ? "lhs" : "rhs";
    }

    private clearAnimations(): void
    {
        this._root?.classList.remove( "smash", "hurt", "lhs", "rhs" );
    }
}