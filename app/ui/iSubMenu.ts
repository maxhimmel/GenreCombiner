import { IEvent } from "../utility/events/iEvent";
import { Observable } from "../utility/observable";

export interface ISubMenu
{
    get allotment(): Observable<number> | null;

    get title(): string;
    get description(): string;
}

export abstract class SubMenu implements ISubMenu
{
    abstract get allotment(): Observable<number> | null;
    abstract get title(): string;
    abstract get description(): string;

    protected readonly _container: HTMLElement;

    constructor( container: HTMLElement )
    {
        this._container = container;
    }
}

class EmptySubMenu implements ISubMenu
{
    get allotment(): Observable<number> | null
    {
        return null;
    }

    get title(): string
    {
        return "Empty";
    }
    get description(): string
    {
        return "Something went wrong.";
    }
}

export const emptySubMenu: EmptySubMenu = new EmptySubMenu();