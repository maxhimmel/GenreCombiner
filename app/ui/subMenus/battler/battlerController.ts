import { BattleBracket } from "../../../battle/battleBracket";
import { BattleResult, BattleRound } from "../../../battle/battleResolver";
import { GenreComboModel } from "../../../genre/genreComboModel";
import { AsyncUtil } from "../../../utility/async";
import { SubMenuRequest } from "../../menuContainer";
import { IController } from "../iController";
import { BattlerMenu } from "./battlerMenu";

export class BattlerController implements IController
{
    private readonly BATTLE_START_DELAY: number = 1;

    private readonly _battler: BattleBracket;
    private readonly _combos: GenreComboModel[];

    private _menu: BattlerMenu | null = null;
    private _currentRound: number = 0;
    private _currentBattle: BattleResult;

    constructor( combos: GenreComboModel[] )
    {
        this._combos = combos;
        this._battler = new BattleBracket( combos );

        this._currentRound = 0;
        this._currentBattle = this._battler.resolveNextBattle();
    }

    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( root =>
        {
            this._menu = new BattlerMenu( root, this._combos );
            this._menu.battleStartClicked.subscribe( this.onBattleStarted );
            this._menu.initializeBattle( this._currentBattle );

            return this._menu;
        } );
    }

    private onBattleStarted = async ( sender: any ): Promise<void> =>
    {
        await AsyncUtil.delay( this.BATTLE_START_DELAY );

        while ( this.isBattling() )
        {
            const round: BattleRound = this._currentBattle.rounds[this._currentRound++];

            await this._menu?.updateRound( round );

            if ( this.isBattling() )
            {
                this._menu?.nextRound();
            }
        }

        await this.onBattleEnded();
    }

    private isBattling(): boolean
    {
        return this._currentRound < this._currentBattle.rounds.length;
    }

    private async onBattleEnded(): Promise<void>
    {
        await this._menu?.updateBattleEnd( this._currentBattle );

        if ( this._battler.isEmpty )
        {
        }
        else
        {
            this._currentRound = 0;
            this._currentBattle = this._battler.resolveNextBattle();
            this._menu?.initializeBattle( this._currentBattle );
        }
    }

    getNextController(): IController
    {
        throw new Error( "Method not implemented." );
    }
}