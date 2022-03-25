import { PoolSize } from "../../../genre/poolSize";
import { Observable } from "../../../utility/observable";
import { ISubMenu } from "../../iSubMenu";
import { PoolSizeMenu } from "./poolSizeMenu";

export class PoolSizeController
{
    get menu(): ISubMenu
    {
        return this._menu;
    }

    readonly desiredSize: Observable<number>;

    private readonly _poolSize: PoolSize;
    private readonly _menu: PoolSizeMenu;

    constructor()
    {
        this._poolSize = new PoolSize();
        this._menu = new PoolSizeMenu();

        this.desiredSize = new Observable( this, this._poolSize.minSize );

        this._menu.sizeSelected.subscribe( this.onSizeSelected );
        this._menu.update( this._poolSize.getSizes() );
        this._menu.select( this._poolSize.minSize );
    }

    private onSizeSelected = ( sender: any, size: number ): void =>
    {
        this.desiredSize.item = size;
        console.log( `Size: ${size}` );
    }
}