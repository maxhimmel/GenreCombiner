declare global
{
    interface HTMLElement
    {
        reflow(): void;
    }
}

// See: Bootstrap.bundle.js
HTMLElement.prototype.reflow = function(): void
{
    this.offsetHeight;
}

export { }