import rootTemplate from "bundle-text:../../../../assets/html/poolSize/poolSizeContainer.html"

import { IEvent } from "../../../utility/events/iEvent";
import { ISubMenu } from "../../iSubMenu";
import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { EventHandler } from "../../../utility/events/eventHandler";
import { PoolSizeButton } from "./poolSizeButton";
import { ArrayUtil } from "../../../utility/arrays";

export class PoolSizeMenu implements ISubMenu
{
    get sizeSelected(): IEvent<number>
    {
        return this._sizeSelected;
    }

    get title(): string
    {
        return "Get Started";
    }
    get description(): string
    {
        return "Select how many genres you'd like to choose from.";
    }

    private readonly _root: HTMLElement;
    private readonly _itemContainer: HTMLElement;
    private readonly _sizeSelected: EventHandler<number>;
    private readonly _sizeButtons: PoolSizeButton[] = [];

    constructor()
    {
        this._root = new HtmlTemplateBuilder( rootTemplate )
            .instant();
        
        this._itemContainer = this._root.querySelector( ".group-pool-size" ) as HTMLElement;

        this._sizeSelected = new EventHandler();
    }

    attach( parent: HTMLElement ): void
    {
        parent.appendChild( this._root );
    }

    remove(): void
    {
        this._root.remove();
    }

    select( size: number ): void
    {
        for ( let sizeButton of this._sizeButtons )
        {
            if ( sizeButton.size === size )
            {
                sizeButton.select();
                return;
            }
        }
    }

    update( sizes: Generator<number> ): void
    {
        this.clear();

        for ( let size of sizes )
        {
            const newButton = new PoolSizeButton();
            this._sizeButtons.push( newButton );

            newButton.init( size, this._itemContainer );
            newButton.sizeSelected.subscribe( this.onSizeSelected );
        }
    }

    private clear(): void
    {
        for ( let sizeButton of this._sizeButtons )
        {
            sizeButton.remove();
        }
        
        ArrayUtil.clear( this._sizeButtons );
    }

    private onSizeSelected = ( sender: any, size: number ): void =>
    {
        this._sizeSelected.invoke( sender, size );
    }
}