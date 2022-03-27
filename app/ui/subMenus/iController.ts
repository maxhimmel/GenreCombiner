import { emptySubMenu } from "../iSubMenu";
import { SubMenuRequest } from "../menuContainer";

export interface IController
{
    createSubMenuRequest(): SubMenuRequest;
    getNextController(): IController;
}

class EmptyController implements IController
{
    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( root =>
        {
            return emptySubMenu;
        } );
    }

    getNextController(): IController
    {
        return emptyController;
    }
}

export const emptyController: EmptyController = new EmptyController();