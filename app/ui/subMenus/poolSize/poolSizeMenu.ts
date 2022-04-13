import rootTemplate from "bundle-text:../../../../assets/html/poolSize/poolSizeContainer.html"

import { IEvent } from "../../../utility/events/iEvent";
import { SubMenu } from "../../iSubMenu";
import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { EventHandler } from "../../../utility/events/eventHandler";
import { PoolSizeButton } from "./poolSizeButton";
import { ArrayUtil } from "../../../utility/arrays";
import { Observable } from "../../../utility/observable";

export class PoolSizeMenu extends SubMenu
{
    get allotment(): Observable<number> | null
    {
        return null;
    }
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

    private _itemContainer: HTMLElement | null = null;
    private readonly _sizeSelected: EventHandler<number>;
    private readonly _sizeButtons: PoolSizeButton[] = [];

    constructor( container: HTMLElement )
    {
        super( container );

        new HtmlTemplateBuilder( rootTemplate )
            .config( this.config )
            .build( container );

        this._sizeSelected = new EventHandler();
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._itemContainer = root.querySelector( ".group-pool-size" );
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

            newButton.init( size, this._itemContainer as HTMLElement );
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