import { PoolSize } from "../../../genre/poolSize";
import { Observable } from "../../../utility/observable";
import { SubMenuRequest } from "../../menuContainer";
import { PoolSizeMenu } from "./poolSizeMenu";

export class PoolSizeController
{
    readonly desiredSize: Observable<number>;

    private readonly _poolSize: PoolSize;

    constructor()
    {
        this._poolSize = new PoolSize();
        this.desiredSize = new Observable( this, this._poolSize.minSize );
    }

    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( ( root: HTMLElement ) =>
        {
            const menu = new PoolSizeMenu( root );
            menu.sizeSelected.subscribe( this.onSizeSelected );
            menu.update( this._poolSize.getSizes() );
            menu.select( this._poolSize.minSize );

            return menu;
        } );
    }

    private onSizeSelected = ( sender: any, size: number ): void =>
    {
        this.desiredSize.item = size;
        console.log( `Size: ${size}` );
    }
}