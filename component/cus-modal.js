class CustomModal extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <aside class="modal-bg" id="modalBgNote">
          <div class="modal-content">
            <button class="close-button" id="closeButtonBg">&times;</button>
            <h2 id="modalBgTitle"></h2>
            <hr></hr>
            <p id="modalBgBody"></p>
          </div>
        </aside>
      `;
    }
  }
  
  customElements.define('custom-modal', CustomModal);
  