import { GenreComboModel } from "../../../genre/genreComboModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { Observable } from "../../../utility/observable";
import { SubMenu } from "../../iSubMenu";
import { GenreComboItem, SlotLookup } from "./genreComboItem";

export class GenreCombinerMenu extends SubMenu
{
    get slotSelected(): IEvent<SlotLookup>
    {
        return this._slotSelected;
    }

    get allotment(): Observable<number> | null
    {
        return this._swapCount;
    }
    get title(): string
    {
        return "Combos";
    }
    get description(): string
    {
        return "Rearrange and create your own combinations.";
    }

    private readonly _slotSelected: EventHandler<SlotLookup> = new EventHandler();
    private readonly _comboItems: Map<number, GenreComboItem> = new Map();
    private readonly _swapCount: Observable<number>;

    constructor(
        root: HTMLElement,
        genreCombos: Generator<GenreComboModel>,
        swapCount: Observable<number> )
    {
        super( root );

        let slotIndex: number = 0;
        for ( let combo of genreCombos )
        {
            const item = new GenreComboItem( root, slotIndex );
            this._comboItems.set( slotIndex, item );

            item.init( combo );
            item.slotSelected.subscribe( this.onSlotSelected );

            ++slotIndex;
        }

        this._swapCount = swapCount;
    }

    private onSlotSelected = ( sender: GenreComboItem, slotData: SlotLookup ): void =>
    {
        for ( let entry of this._comboItems )
        {
            const item = entry[1];
            if ( item.slotIndex === slotData.comboSlot )
            {
                // This item is handling it's own UI when selected.
                continue;
            }

            item.toggleAvailableForSwap();
        }

        this._slotSelected.invoke( sender, slotData );
    }
    
    stopWatchingSwappedCombos( lhsSlot: number, rhsSlot: number ): void
    {
        this._comboItems.delete( lhsSlot );
        this._comboItems.delete( rhsSlot );
    }
}