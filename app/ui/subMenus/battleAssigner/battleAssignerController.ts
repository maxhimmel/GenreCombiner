import { BattleAssigner } from "../../../battle/battleAssigner";
import { GenreComboModel } from "../../../genre/genreComboModel";
import { SubMenuRequest } from "../../menuContainer";
import { IController } from "../iController";
import { BattleAssignerMenu, PointModification } from "./battleAssignerMenu";

export class BattleAssignerController implements IController
{
    private readonly _battleAssigner: BattleAssigner;

    constructor( combos: GenreComboModel[] )
    {
        this._battleAssigner = new BattleAssigner( combos );
    }

    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( ( root ) =>
        {
            const menu = new BattleAssignerMenu( root, this._battleAssigner.getGenreCombos(), this._battleAssigner.remainingPoints );
            menu.pointModifierClicked.subscribe( this.onPointModiferClicked );

            return menu;
        } );
    }

    private onPointModiferClicked = ( sender: any, modification: PointModification ): void =>
    {
        if ( modification.direction > 0 )
        {
            this._battleAssigner.addBattlePoint( modification.slotIndex );
        }
        else if ( modification.direction < 0 )
        {
            this._battleAssigner.removeBattlePoint( modification.slotIndex );
        }
    }

    getNextController(): IController
    {
        throw new Error( "Method not implemented." );
    }
}