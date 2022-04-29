import { AsyncUtil } from "./async";

declare global
{
    interface HTMLElement
    {
        reflow(): void;
        removeAllChildren(): void;
        waitForTransitionEnd(): Promise<void>
        waitForAnimationEnd(): Promise<void>
    }
}

// See: Bootstrap.bundle.js
HTMLElement.prototype.reflow = function(): void
{
    this.offsetHeight;
}

HTMLElement.prototype.removeAllChildren = function(): void
{
    while ( this.firstChild !== null )
    {
        this.lastChild?.remove();
    }
}

HTMLElement.prototype.waitForTransitionEnd = async function (): Promise<void>
{
    let isTransitionComplete: boolean = false;
    
    const onTransitionEnd = (): void =>
    {
        isTransitionComplete = true;
        this.removeEventListener( "transitionend", onTransitionEnd );
    };
    this.addEventListener( "transitionend", onTransitionEnd );

    await AsyncUtil.until( () => isTransitionComplete );
}

HTMLElement.prototype.waitForAnimationEnd = async function (): Promise<void>
{
    let isAnimationComplete: boolean = false;

    const onAnimationEnd = (): void =>
    {
        isAnimationComplete = true;
        this.removeEventListener( "animationend", onAnimationEnd );
    };
    this.addEventListener( "animationend", onAnimationEnd );

    await AsyncUtil.until( () => isAnimationComplete );
}

export { }