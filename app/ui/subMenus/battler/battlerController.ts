import { BattleBracket } from "../../../battle/battleBracket";
import { BattleResult, BattleRound } from "../../../battle/battleResolver";
import { GenreComboModel } from "../../../genre/genreComboModel";
import { AsyncUtil } from "../../../utility/async";
import { SubMenuRequest } from "../../menuContainer";
import { IController } from "../iController";
import { BattlerMenu } from "./battlerMenu";

export class BattlerController implements IController
{
    private readonly _battler: BattleBracket;
    private readonly _combos: GenreComboModel[];

    private _menu: BattlerMenu | null = null;

    constructor( combos: GenreComboModel[] )
    {
        this._combos = combos;
        this._battler = new BattleBracket( combos );
    }

    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( root =>
        {
            this._menu = new BattlerMenu( root, this._combos );

            this.update();

            return this._menu;
        } );
    }

    private async update(): Promise<void>
    {
        console.log( "START!" );

        while ( !this._battler.isEmpty )
        {
            const battle: BattleResult = this._battler.resolveNextBattle();

            await this._menu?.updateBattleStart( battle );

            for ( const round of battle.rounds )
            {
                await this._menu?.updateRound( round );
            }

            await this._menu?.updateBattleEnd( battle );
        }

        console.log( "COMPLETE!" );
    }

    getNextController(): IController
    {
        throw new Error( "Method not implemented." );
    }
}