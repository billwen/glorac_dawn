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
    positionProductHeader();
  });
} else {
  initializeProductGalleryProgress();
  positionProductHeader();
}

document.addEventListener('shopify:section:load', (event) => initializeProductGalleryProgress(event.target));
