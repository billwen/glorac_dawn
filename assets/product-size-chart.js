/* Render the product's multiline Markdown using bundled, versioned libraries. */
if (!customElements.get('glorac-size-chart')) {
  customElements.define('glorac-size-chart', class extends HTMLElement {
    connectedCallback() {
      if (this.rendered) return;
      const source = this.querySelector('[data-size-chart-markdown]');
      const content = this.querySelector('[data-size-chart-content]');
      if (!source || !content) return;

      const markdown = source.content.textContent.trim();
      if (window.marked && window.DOMPurify) {
        content.innerHTML = DOMPurify.sanitize(marked.parse(markdown, { gfm: true }), {
          USE_PROFILES: { html: true }
        });
        content.querySelectorAll('table').forEach((table) => {
          const scroll = document.createElement('div');
          scroll.className = 'product-size-chart__table-scroll';
          scroll.tabIndex = 0;
          table.replaceWith(scroll);
          scroll.appendChild(table);
        });
      } else {
        content.textContent = markdown;
        content.classList.add('product-size-chart__plain');
      }
      this.rendered = true;
    }
  });
}
