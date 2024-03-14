class CustomHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const appName = this.getAttribute('app-name') || 'My Notes';
    this.innerHTML = `
      <header>
        <h1>${appName}</h1>
      </header>
    `;
  }
}

customElements.define('custom-header', CustomHeader);
