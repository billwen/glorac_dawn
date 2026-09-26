class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.hoverMenu = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    this.addEventListener('mouseenter', () => {
      if (!this.hoverMenu.matches) return;
      this.header.querySelectorAll('header-menu').forEach((menu) => {
        if (menu !== this) menu.close();
      });
      this.mainDetailsToggle.open = true;
      this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', 'true');
    });
    this.addEventListener('mouseleave', () => {
      if (this.hoverMenu.matches) this.close();
    });
    this.mainDetailsToggle.querySelector('summary').addEventListener('click', (event) => {
      // Keep pointer clicks from pinning the submenu open; keyboard activation remains available.
      if (this.hoverMenu.matches && event.detail > 0) event.preventDefault();
    });
    this.hoverMenu.addEventListener('change', () => this.close());
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
