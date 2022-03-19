import { AsyncUtil } from "./async";

export class AnimUtil
{
    private constructor() { }

    static async toggleFadeDrop( element: HTMLElement ): Promise<void>
    {
        let isTransitionComplete: boolean = false;
        const callback = ( evt: TransitionEvent ): void =>
        {
            if ( evt.target !== element )
            {
                return;
            }

            this.completeFadeDrop( element );

            element.removeEventListener( "transitionend", callback );
            isTransitionComplete = true;
        };
        element.addEventListener( "transitionend", callback );

        const isShowing: boolean = element.classList.contains( "show" );
        this.playFadeDrop( element, !isShowing );

        await AsyncUtil.until( () => isTransitionComplete );
    }

    private static completeFadeDrop( element: HTMLElement ): void
    {
        element.classList.remove( "fade-dropping" );
        element.classList.add( "fade-drop" );

        const isShowing: boolean = ( element.style.height !== "0px" && element.style.height !== "" );
        element.classList.toggle( "show", isShowing );

        element.style.removeProperty( "height" );
        element.style.removeProperty( "opacity" );
    }

    private static playFadeDrop( element: HTMLElement, isShowRequested: boolean ): void
    {
        const startHeight: number = isShowRequested ? 0 : element.scrollHeight;
        const startOpacity: number = isShowRequested ? 0 : 100;
        this.setFadeDrop( element, startHeight, startOpacity );

        element.classList.remove( "fade-drop", "show" );
        element.classList.add( "fade-dropping" );

        const endHeight: number = isShowRequested ? element.scrollHeight : 0;
        const endOpacity: number = isShowRequested ? 100 : 0;
        this.setFadeDrop( element, endHeight, endOpacity );
    }

    private static setFadeDrop( element: HTMLElement, heightPixel: number, opacityPercent: number ): void
    {
        element.style.height = `${heightPixel}px`;
        element.style.opacity = `${opacityPercent}%`;

        this.reflow( element );
    }

    // See: Bootstrap.bundle.js
    private static reflow( elem: HTMLElement ): void
    {
        elem.offsetHeight;
    }
}