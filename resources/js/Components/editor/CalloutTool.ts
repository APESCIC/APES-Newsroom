/**
 * Minimal Editor.js callout tool matching the server allowlist.
 */
export default class CalloutTool {
    static get toolbox() {
        return {
            title: 'Callout',
            icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 0L0 15h17L8.5 0z"/></svg>',
        };
    }

    private data: { text: string };
    private readonly wrapper: HTMLElement;

    constructor({ data }: { data?: { text?: string } }) {
        this.data = { text: data?.text ?? '' };
        this.wrapper = document.createElement('div');
    }

    render(): HTMLElement {
        this.wrapper.classList.add('ce-callout');
        const input = document.createElement('div');
        input.contentEditable = 'true';
        input.dataset.placeholder = 'Callout text';
        input.innerText = this.data.text;
        input.addEventListener('input', () => {
            this.data.text = input.innerText;
        });
        this.wrapper.appendChild(input);
        return this.wrapper;
    }

    save(blockContent: HTMLElement): { text: string } {
        const input = blockContent.querySelector('[contenteditable]');
        return { text: input?.textContent ?? '' };
    }
}
