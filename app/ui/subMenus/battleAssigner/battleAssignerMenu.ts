import { GenreComboModel } from "../../../genre/genreComboModel";
import { EventHandler } from "../../../utility/events/eventHandler";
import { IEvent } from "../../../utility/events/iEvent";
import { Observable } from "../../../utility/observable";
import { SubMenu } from "../../iSubMenu";
import { BattleAssignerItem } from "./battleAssignerItem";

export class BattleAssignerMenu extends SubMenu
{
    get pointModifierClicked(): IEvent<PointModification>
    {
        return this._pointModifierClicked;
    }

    get allotment(): Observable<number> | null
    {
        return this._remainingPoints;
    }
    get title(): string
    {
        return "Points";
    }
    get description(): string
    {
        return "Assign battle points to increase a combo's odds.";
    }

    private readonly _pointModifierClicked: EventHandler<PointModification> = new EventHandler();
    private readonly _remainingPoints: Observable<number>;

    constructor(
        container: HTMLElement,
        combos: Generator<GenreComboModel>,
        remainingPoints: Observable<number> )
    {
        super( container );

        let slotIndex: number = 0;
        for ( let combo of combos )
        {
            const item = new BattleAssignerItem( container, slotIndex++ )
            item.init( combo );
            item.pointModifierClicked.subscribe( this.onPointModifierClicked );
        }

        this._remainingPoints = remainingPoints;
    }

    private onPointModifierClicked = ( sender: BattleAssignerItem, direction: number ): void =>
    {
        this._pointModifierClicked.invoke( this, new PointModification(
            sender.slotIndex, direction
        ) );
    }
}

export class PointModification
{
    slotIndex: number;
    direction: number;

    constructor( slotIndex: number = -1, pointDirection: number = 0 )
    {
        this.slotIndex = slotIndex;
        this.direction = pointDirection;
    }
}