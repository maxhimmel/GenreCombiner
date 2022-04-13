import html from "bundle-text:../../../../assets/html/battleAssigner/battleAssignerItem.html";

import { GenreComboModel } from "../../../genre/genreComboModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { DeltaArgs } from "../../../utility/observable";

export class BattleAssignerItem
{
    get pointModifierClicked(): IEvent<number>
    {
        return this._pointsModified;
    }

    get slotIndex(): number
    {
        return this._slotIndex;
    }

    private readonly _pointsModified: EventHandler<number> = new EventHandler();
    private readonly _slotIndex: number;

    private _comboLabel: HTMLElement | null = null;
    private _pointLabel: HTMLElement | null = null;
    private _addPointButton: HTMLElement | null = null;
    private _removePointButton: HTMLElement | null = null;

    constructor( parent: HTMLElement, slotIndex: number )
    {
        this._slotIndex = slotIndex;

        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._comboLabel = root.querySelector( ".btn-genre" );
        this._pointLabel = root.querySelector( ".point-container" );
        this._addPointButton = root.querySelector( ".btn-add-point" );
        this._removePointButton = root.querySelector( ".btn-remove-point" );

        this._addPointButton?.addEventListener( "click", this.onAddButtonClicked );
        this._removePointButton?.addEventListener( "click", this.onRemoveButtonClicked );
    }

    private onAddButtonClicked = () =>
    {
        this._pointsModified.invoke( this, 1 );
    }

    private onRemoveButtonClicked = () =>
    {
        this._pointsModified.invoke( this, -1 );
    }

    init( combo: GenreComboModel )
    {
        this.updateLabel( combo );

        combo.battlePointsChanged.subscribe( this.onPointsModified );
    }

    private updateLabel( combo: GenreComboModel ): void
    {
        if ( this._comboLabel === null )
        {
            return;
        }

        if ( this._comboLabel.firstChild !== null )
        {
            this._comboLabel.firstChild.textContent = combo.combo[0].item.name;
        }
        if ( this._comboLabel.lastChild !== null )
        {
            this._comboLabel.lastChild.textContent = combo.combo[1].item.name;
        }
    }

    private onPointsModified = ( sender: any, changeArgs: DeltaArgs<number> ): void =>
    {
        if ( this._pointLabel === null )
        {
            return;
        }

        if ( this._pointLabel.firstChild !== null )
        {
            this._pointLabel.firstChild.textContent = changeArgs.current.toString();
        }
    }
}