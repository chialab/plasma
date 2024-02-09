import { Component, customElement, html, property } from '@chialab/dna';

/**
 * @fires stringchange
 * @slot icon - The icon slot.
 */
@customElement('test-element')
export class TestElement extends Component {
    @property({
        event: 'stringchange',
    })
    stringProp?: string;
    @property()
    booleanProp?: boolean;
    @property()
    numericProp?: number;
    @property()
    objectProp?: object;
    @property()
    defaultValue = 0;

    render() {
        return html`
            <slot />
            <span class="text">${this.stringProp}</span>
            ${this.booleanProp ? html`<span class="boolean">true</span>` : ''}
            <span class="number">${this.numericProp}</span>
            <span class="object">${JSON.stringify(this.objectProp)}</span>
            <slot name="icon" />
        `;
    }
}
