import { MenuContainer } from "./ui/menuContainer";
import { emptyController, IController } from "./ui/subMenus/iController";

class AppController
{
    private readonly _menuContainer: MenuContainer;
    private _currentController: IController;

    constructor()
    {
        this._menuContainer = new MenuContainer();
        this._menuContainer.continueClicked.subscribe( this.onContinueRequested );

        this._currentController = emptyController;
    }

    private onContinueRequested = () =>
    {
        this.start( this._currentController.getNextController() );
    }

    start( controller: IController ): void
    {
        this._currentController = controller;
        this._menuContainer.pushSubMenu( controller.createSubMenuRequest() );
    }
}

export const appController: AppController = new AppController();