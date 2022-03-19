import { integrationTests } from "./integrationTests";
import { AnimUtil } from "./utility/animations";

//integrationTests.run();

function toggleFadeDrops(): void
{
    const droppers: HTMLCollectionOf<Element> = document.getElementsByClassName( "fade-dropper" );
    for ( let idx: number = 0; idx < droppers.length; ++idx )
    {
        const dropElem = droppers.item( idx ) as HTMLElement;
        foo( dropElem );
    }
}

async function foo(elem: HTMLElement): Promise<void>
{
    await AnimUtil.toggleFadeDrop( elem );
    await AnimUtil.toggleFadeDrop( elem );
}

window.toggleFadeDrops = toggleFadeDrops;