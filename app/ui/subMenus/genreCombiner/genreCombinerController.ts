import { GenreCombiner } from "../../../genre/genreCombiner";
import { GenreModel } from "../../../genre/genreModel";
import { SubMenuRequest } from "../../menuContainer";
import { BattleAssignerController } from "../battleAssigner/battleAssignerController";
import { IController } from "../iController";
import { GenreCombinerMenu } from "./genreCombinerMenu";
import { SlotLookup } from "./genreComboItem";

export class GenreCombinerController implements IController
{
    private readonly _genreCombiner: GenreCombiner;
    private _menu: GenreCombinerMenu | null;
    private _currentSlotData: SlotLookup;

    constructor( genres: GenreModel[] )
    {
        this._genreCombiner = new GenreCombiner( genres );
        this._menu = null;
        this._currentSlotData = SlotLookup.empty;
    }

    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( ( root: HTMLElement ) =>
        {
            this._menu = new GenreCombinerMenu( root, this._genreCombiner.getGenreCombos(), this._genreCombiner.swapCount );
            this._menu.slotSelected.subscribe( this.onSlotSelected );

            return this._menu;
        } );
    }

    private onSlotSelected = ( sender: any, slotData: SlotLookup ): void =>
    {
        if ( this._currentSlotData.isEqual( slotData ) )
        {
            this._genreCombiner.cancelSwapQueue( slotData.comboSlot );
            this._currentSlotData = SlotLookup.empty;
            return;
        }

        this._genreCombiner.queueGenreForSwap( slotData.comboSlot, slotData.genreSlot );

        if ( this._currentSlotData !== SlotLookup.empty )
        {
            this._genreCombiner.swapGenres( this._currentSlotData.comboSlot, slotData.comboSlot );
            this._menu?.stopWatchingSwappedCombos( this._currentSlotData.comboSlot, slotData.comboSlot );

            this._currentSlotData = SlotLookup.empty;
            return;
        }

        this._currentSlotData = slotData;
    }

    getNextController(): IController
    {
        return new BattleAssignerController( this._genreCombiner.export() );
    }
}