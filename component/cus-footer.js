class CustomFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>&copy; 2024 My Notes App Piid. All rights reserved.</p>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);
