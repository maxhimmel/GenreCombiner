import htmlRoot from "bundle-text:../../../../../assets/html/battler/dice/diceItem.html";
import htmlD1 from "bundle-text:../../../../../assets/html/battler/dice/diceDots/dice1.html";
import htmlD2 from "bundle-text:../../../../../assets/html/battler/dice/diceDots/dice2.html";
import htmlD3 from "bundle-text:../../../../../assets/html/battler/dice/diceDots/dice3.html";
import htmlD4 from "bundle-text:../../../../../assets/html/battler/dice/diceDots/dice4.html";
import htmlD5 from "bundle-text:../../../../../assets/html/battler/dice/diceDots/dice5.html";
import htmlD6 from "bundle-text:../../../../../assets/html/battler/dice/diceDots/dice6.html";

import { HtmlTemplateBuilder } from "../../../../utility/htmlTemplateBuilder";

class DiceFactory
{
    private readonly MIN_SIDES: number = 1;
    private readonly MAX_SIDES: number = 6;
    private readonly _diceSides: Map<number, string> = new Map();

    constructor()
    {
        this._diceSides.set( 1, htmlD1 );
        this._diceSides.set( 2, htmlD2 );
        this._diceSides.set( 3, htmlD3 );
        this._diceSides.set( 4, htmlD4 );
        this._diceSides.set( 5, htmlD5 );
        this._diceSides.set( 6, htmlD6 );
    }

    create( diceSide: number, parent: HTMLElement, configFn: ( ( root: HTMLElement ) => void ) | null = null ) 
    {
        new HtmlTemplateBuilder( htmlRoot )
            .config( root => this.config( root, diceSide, configFn ) )
            .build( parent );
    }

    private config = ( root: HTMLElement, diceSide: number, configFn: ( ( root: HTMLElement ) => void ) | null = null ): void =>
    {
        if ( diceSide < this.MIN_SIDES || diceSide > this.MAX_SIDES )
        {
            throw new RangeError();
        }

        const diceSideHtml = this._diceSides.get( diceSide ) as string;
        const sideContainer = root.querySelector( ".side" ) as HTMLElement;

        new HtmlTemplateBuilder( diceSideHtml )
            .build( sideContainer );
        
        if ( configFn !== null )
        {
            configFn( root );
        }
    }
}

export const diceFactory: DiceFactory = new DiceFactory();