import { Component, customElement, HTML, html, property } from '@chialab/dna';

/**
 * @fires stringchange
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

    render() {
        return html`
            <span class="text">${this.stringProp}</span>
            ${this.booleanProp ? html`<span class="boolean">true</span>` : ''}
            <span class="number">${this.numericProp}</span>
            <span class="object">${JSON.stringify(this.objectProp)}</span>
        `;
    }
}

/**
 * @fires stringchange
 */
@customElement('test-link', {
    extends: 'a',
})
export class TestLink extends HTML.Anchor {
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

    render() {
        return html`
            <span class="text">${this.stringProp}</span>
            ${this.booleanProp ? html`<span class="boolean">true</span>` : ''}
            <span class="number">${this.numericProp}</span>
            <span class="object">${JSON.stringify(this.objectProp)}</span>
        `;
    }
}
