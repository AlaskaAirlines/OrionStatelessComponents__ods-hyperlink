// Copyright (c) Alaska Air. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

import { LitElement, html } from "lit-element";
import 'focus-visible/dist/focus-visible.min.js';

// build the component class
export default class ComponentBase extends LitElement {
  constructor() {
    super();
    this.ariapressed = 'false';
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
  }

  // function to define props used within the scope of thie component
  static get properties() {
    return {
      href:             { type: String },
      rel:              { type: String },
      role:             { type: String },
      target:           { type: String },
      download:         { type: Boolean }
    };
  }

  targetIcon(target){
    if(target === '_blank') {
      return this.svg;
    }
  }

  getTabState(tabisactive) {
    return tabisactive === true ? "is-active" : ''
  }

  getReltype(target, rel) {
    if(target === '_blank') {
      return 'noopener noreferrer'
    } else if (rel) {
      return rel
    }
  }

  ariaPressedState(ariapressed) {
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
          ariaPressedNode.setAttribute("aria-pressed", 'true')
        }
      }

      if(event.type == 'keyup') {
        if(event.keyCode === 13 || event.keyCode === 32) {
          ariaPressedNode.setAttribute("aria-pressed", 'false')
        }
      }
    };

    // Add our event listeners
    this.addEventListener('mousedown', ariaToggle, false);
    this.addEventListener('keydown', ariaToggle, false);
    this.addEventListener('mouseup', ariaToggle, false);
    this.addEventListener('keyup', ariaToggle, false);

    return ariapressed
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    return html`
      ${this.getButtonStyles()}

      ${this.getMarkup()}
    `;
  }
}
