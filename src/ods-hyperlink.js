// Copyright (c) Alaska Air. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

import { LitElement, html } from "lit-element";
import { ifDefined } from 'lit-html/directives/if-defined.js';
// Import touch detection lib
import 'focus-visible/dist/focus-visible.min.js';
import hyperlinkProperties from './tokens/componentShapeProperties-css.js';

// import the processed CSS file into the scope of the component
import styleCss from "./style-css.js";

import stepout from '@alaskaairux/orion-icons/dist/icons/stepout_es6.js';

// build the component class
class OdsHyperlink extends LitElement {
  constructor() {
    super();
    this.ariaPressed = 'false';
    this.tabisactive = 'false';

    /*
      If the component requires a touch detection,
      please use this function to determine if a user is
      activelly touching a device, versus detecting if
      the device is touych enables or a handheld device.

      Also uncomment the touch detection lib above
    */
    this.addEventListener('touchstart', function() {
      this.classList.add('is-touching');
    });

    this.dom = new DOMParser().parseFromString(stepout.svg, 'text/html');
    this.svg = this.dom.body.firstChild;
  }

  // function to define props used within the scope of thie component
  static get properties() {
    return {
      download:         { type: Boolean },
      darktheme:        { type: Boolean },
      inline:           { type: Boolean },
      href:             { type: String },
      rel:              { type: String },
      role:             { type: String },
      tabisactive:      { type: String },
      target:           { type: String },
      type:             { type: String },
      anchorCallback:   { type: Function }
    };
  }

  anchorCallback() {
    alert('Alert: Event not bound to anchor')
  }

  getContext(inline) {
    return inline ? "hyperlink--inline" : 'hyperlink--no-inline'
  }

  getTheme(darktheme) {
    return darktheme ? "hyperlink--darktheme" : 'hyperlink--lighttheme'
  }

  getTabState(tabisactive) {
    return tabisactive === 'true' ? "is-active" : ''
  }

  getAnchortype(role, href) {
    if (role === 'button') {
      return 'hyperlink--button'
    } else if (role === 'tab') {
      return 'hyperlink--tab'
    } else if (href) {
      return 'hyperlink'
    }
  }

  getReltype(target, rel) {
    if(target === '_blank') {
      return 'noopener noreferrer'
    } else if (rel) {
      return rel
    }
  }

  targetIcon(target){
    if(target === '_blank') {
      return this.svg;
    }
  }

  ariaPressedState(ariaPressed) {

    const ariaToggle = function (event) {
      const ariaPressedNode = this.shadowRoot.querySelector('[aria-pressed]');

      if(event.type == 'mousedown') {
        ariaPressedNode.setAttribute("aria-pressed", 'true')
      }

      if(event.type == 'mouseup') {
        ariaPressedNode.setAttribute("aria-pressed", 'false')
      }

      if(event.type == 'keydown') {
        if(event.keyCode === 13 || event.keyCode === 32) {
          event.preventDefault();
          ariaPressedNode.setAttribute("aria-pressed", 'true')
        }
      }

      if(event.type == 'keyup') {
        if(event.keyCode === 13 || event.keyCode === 32) {
          event.preventDefault();
          ariaPressedNode.setAttribute("aria-pressed", 'false')
        }
      }
    };

    // Add our event listeners
    this.addEventListener('mousedown', ariaToggle, false);
    this.addEventListener('keydown', ariaToggle, false);
    this.addEventListener('mouseup', ariaToggle, false);
    this.addEventListener('keyup', ariaToggle, false);

    return ariaPressed
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    return html`
      ${hyperlinkProperties}
      ${styleCss}

      <a
        aria-pressed="${ifDefined(this.role === 'button' ? this.ariaPressedState(this.ariaPressed) : undefined)}"
        aria-selected="${ifDefined(this.tabisactive === 'true' ? this.tabisactive : undefined)}"
        ?download="${this.download}"
        role="${ifDefined(this.role === 'button' || this.role === 'tab' ? this.role : undefined)}"
        rel="${ifDefined(this.target || this.rel ? this.getReltype(this.target, this.rel) : undefined)}"
        class="${this.getAnchortype(this.role, this.href)} ${this.getContext(this.inline)} ${this.getTheme(this.darktheme)} ${this.getTabState(this.tabisactive)}"
        href="${ifDefined(this.href ? this.href : undefined)}"
        target="${ifDefined(this.target ? this.target : undefined)}"
        @click=${ifDefined(this.role === 'button' || this.role === 'tab' ? this.anchorCallback : undefined)}"
        tabindex="${ifDefined(this.role === 'button' || this.role === 'tab' ? '0' : undefined)}"
      ><slot></slot>${this.targetIcon(this.target)}</a>
    `;
  }
}

// define the name of the custom component
customElements.define("ods-hyperlink", OdsHyperlink);
