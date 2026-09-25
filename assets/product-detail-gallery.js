function initializeProductGalleryProgress(root = document) {
  root.querySelectorAll('media-gallery').forEach((gallery) => {
    const viewer = gallery.querySelector('[id^="GalleryViewer-"]');
    const progress = gallery.querySelector('.product-detail-reference__progress');
    if (!viewer || !progress || viewer.dataset.progressInitialized) return;

    viewer.dataset.progressInitialized = 'true';
    viewer.addEventListener('slideChanged', (event) => {
      progress.querySelectorAll('span').forEach((segment, index) => {
        segment.classList.toggle('is-active', index === event.detail.currentPage - 1);
      });
    });
  });
}

function initializeVerticalGalleryTracking(root = document) {
  root.querySelectorAll('product-info.product-detail-reference media-gallery').forEach((gallery) => {
    const thumbnailList = gallery.querySelector('[id^="Slider-Thumbnails-"]');
    const mediaItems = [...gallery.querySelectorAll('.product__media-list .product__media-item')];
    if (!thumbnailList || mediaItems.length < 2 || gallery.dataset.verticalTrackingInitialized) return;

    gallery.dataset.verticalTrackingInitialized = 'true';
    let activeMediaId;
    let scheduled = false;

    const update = () => {
      scheduled = false;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;

      const galleryRect = gallery.getBoundingClientRect();
      if (galleryRect.bottom <= 0 || galleryRect.top >= window.innerHeight) return;

      const viewportCenter = window.innerHeight / 2;
      const currentMedia = mediaItems.reduce((closest, item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        return distance < closest.distance ? { item, distance } : closest;
      }, { item: null, distance: Infinity }).item;

      if (!currentMedia || currentMedia.dataset.mediaId === activeMediaId) return;
      activeMediaId = currentMedia.dataset.mediaId;

      gallery.querySelectorAll('[data-target] button').forEach((button) => {
        if (button.parentElement.dataset.target === activeMediaId) {
          button.setAttribute('aria-current', 'true');
        } else {
          button.removeAttribute('aria-current');
        }
      });

      const currentThumbnail = [...thumbnailList.querySelectorAll('[data-target]')].find(
        (thumbnail) => thumbnail.dataset.target === activeMediaId
      );
      if (currentThumbnail) {
        thumbnailList.scrollTo({
          top: currentThumbnail.offsetTop + currentThumbnail.offsetHeight / 2 - thumbnailList.clientHeight / 2,
          behavior: 'smooth',
        });
      }
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
  });
}

function positionProductHeader() {
  const announcement = document.querySelector('.announcement-bar-section');
  const update = () => {
    document.documentElement.style.setProperty(
      '--product-announcement-height', `${announcement?.getBoundingClientRect().height || 0}px`
    );
  };

  update();
  if (announcement) new ResizeObserver(update).observe(announcement);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeProductGalleryProgress();
    initializeVerticalGalleryTracking();
    positionProductHeader();
  });
} else {
  initializeProductGalleryProgress();
  initializeVerticalGalleryTracking();
  positionProductHeader();
}

document.addEventListener('shopify:section:load', (event) => {
  initializeProductGalleryProgress(event.target);
  initializeVerticalGalleryTracking(event.target);
});
