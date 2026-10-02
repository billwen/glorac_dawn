/* Render escaped product Markdown with the same libraries as the size chart. */
if (!customElements.get('glorac-product-markdown')) {
  customElements.define('glorac-product-markdown', class extends HTMLElement {
    connectedCallback() {
      if (this.rendered) return;
      const source = this.querySelector('[data-product-markdown]');
      const content = this.querySelector('[data-product-markdown-content]');
      if (!source || !content || !window.marked || !window.DOMPurify) return;

      content.innerHTML = DOMPurify.sanitize(marked.parse(source.content.textContent.trim(), { gfm: true }), {
        USE_PROFILES: { html: true }
      });
      this.rendered = true;
    }
  });
}
