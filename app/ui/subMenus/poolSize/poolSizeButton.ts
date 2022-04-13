import sizeItemTemplate from "bundle-text:../../../../assets/html/poolSize/poolSizeItem.html"

import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";

export class PoolSizeButton
{
    get size(): number
    {
        return this._size;
    }
    get sizeSelected(): IEvent<number>
    {
        return this._sizeSelected;
    }

    private readonly _sizeSelected: EventHandler<number> = new EventHandler();

    private _size: number = -1;
    private _inputElement: HTMLInputElement | null = null;
    private _labelElement: HTMLLabelElement | null = null;

    init( size: number, parent: HTMLElement ): void
    {
        this._size = size;

        new HtmlTemplateBuilder( sizeItemTemplate )
            .config( this.config )
            .build( parent );
    }

    private config = (root: HTMLElement ): void =>
    {
        const id = `sizeItem${this._size}`;

        this._inputElement = root.querySelector( "input" ) as HTMLInputElement;
        this._inputElement.id = id;

        this._labelElement = root.querySelector( "label" ) as HTMLLabelElement;
        this._labelElement.htmlFor = id;

        this._labelElement.innerText = this._size.toString();
        this._labelElement.addEventListener( "click", this.onSizeSelected );
    }

    private onSizeSelected = () =>
    {
        this._sizeSelected.invoke( this, this._size );
    }

    select()
    {
        this._inputElement?.toggleAttribute( "checked" );
    }

    remove()
    {
        this._labelElement?.remove();
        this._inputElement?.remove();
    }
}