import { Component, customElement, HTML, html } from '@chialab/dna';

@customElement('test-element')
export class TestElement extends Component {
    static get properties() {
        return {
            stringProp: String,
            booleanProp: Boolean,
            numericProp: Number,
            objectProp: Object,
        };
    }

    declare stringProp?: string;
    declare booleanProp?: boolean;
    declare numericProp?: number;
    declare objectProp?: object;

    render() {
        return html`
            <span class="text">${this.stringProp}</span>
            ${this.booleanProp ? html`<span class="boolean">true</span>` : ''}
            <span class="number">${this.numericProp}</span>
            <span class="object">${JSON.stringify(this.objectProp)}</span>
        `;
    }
}

@customElement('test-link', {
    extends: 'a',
})
export class TestLink extends HTML.Anchor {
    static get properties() {
        return {
            stringProp: String,
            booleanProp: Boolean,
            numericProp: Number,
            objectProp: Object,
        };
    }

    declare stringProp?: string;
    declare booleanProp?: boolean;
    declare numericProp?: number;
    declare objectProp?: object;

    render() {
        return html`
            <span class="text">${this.stringProp}</span>
            ${this.booleanProp ? html`<span class="boolean">true</span>` : ''}
            <span class="number">${this.numericProp}</span>
            <span class="object">${JSON.stringify(this.objectProp)}</span>
        `;
    }
}
