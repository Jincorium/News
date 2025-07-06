document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (toggleBtn) {
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      toggleBtn.textContent = '☀️';
    }
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        toggleBtn.textContent = '☀️';
      } else {
        localStorage.setItem('darkMode', 'disabled');
        toggleBtn.textContent = '🌙';
      }
    });
  }

  // Warm mode toggle
  const warmBtn = document.getElementById('warm-mode-toggle');
  if (warmBtn) {
    if (localStorage.getItem('warmMode') === 'enabled') {
      document.body.classList.add('warm-mode');
      warmBtn.textContent = '🙈';
    }
    warmBtn.addEventListener('click', () => {
      document.body.classList.toggle('warm-mode');
      if (document.body.classList.contains('warm-mode')) {
        localStorage.setItem('warmMode', 'enabled');
        warmBtn.textContent = '🙈';
      } else {
        localStorage.setItem('warmMode', 'disabled');
        warmBtn.textContent = '🕶️';
      }
    });
  }

  // Video player click handler
  document.querySelectorAll('.video-card').forEach(card => {
    const wrapper = card.querySelector('.video-wrapper');
    const videoId = card.getAttribute('data-video-id');

    if (wrapper && videoId) {
      wrapper.addEventListener('click', () => {
        const iframeWrapper = document.createElement('div');
        iframeWrapper.className = 'video-iframe';
        iframeWrapper.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        `;
        wrapper.replaceWith(iframeWrapper);
      });
    }
  });

  // Tag filtering with event delegation on the grid
  const grid = document.querySelector('.grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const tag = e.target.closest('.tag');
      if (!tag) return; // clicked somewhere else

      const selectedTag = tag.textContent.toLowerCase().replace('#', '');
      console.log('Clicked tag:', selectedTag); // debug

      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        const tagsInCard = card.querySelectorAll('.tag');
        const tagList = Array.from(tagsInCard).map(span =>
          span.textContent.toLowerCase().replace('#', '')
        );

        if (tagList.includes(selectedTag)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  if (!grid) return;

  let activeTag = null; // track which tag is active

  grid.addEventListener('click', (e) => {
    const clickedTag = e.target.closest('.tag');
    if (!clickedTag) return;

    const selectedTag = clickedTag.textContent.toLowerCase().replace('#', '');
    const cards = document.querySelectorAll('.card');
    const allTags = document.querySelectorAll('.tag');

    if (activeTag === selectedTag) {
      // Second click on same tag - clear filter and highlights
      activeTag = null;
      cards.forEach(card => card.style.display = 'block');
      allTags.forEach(tag => tag.classList.remove('active'));
    } else {
      // New tag clicked - filter cards and highlight all matching tags
      activeTag = selectedTag;

      cards.forEach(card => {
        const tagSpans = card.querySelectorAll('.tag');
        const tagList = Array.from(tagSpans).map(span => span.textContent.toLowerCase().replace('#', ''));
        card.style.display = tagList.includes(selectedTag) ? 'block' : 'none';
      });

      // Remove active from all tags first
      allTags.forEach(tag => tag.classList.remove('active'));

      // Then add active class to every tag with the selected hashtag
      allTags.forEach(tag => {
        if (tag.textContent.toLowerCase().replace('#', '') === selectedTag) {
          tag.classList.add('active');
        }
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const article = document.getElementById('article-content');
  const readTimeContainer = document.getElementById('read-time');

  if (article && readTimeContainer) {
    const words = article.textContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    readTimeContainer.textContent = `🕒 ${minutes} min read`;
  } else {
    console.log("Article or read-time div not found");
  }
});

let lastScroll = window.scrollY;
const header = document.querySelector('header');
const sidebar = document.querySelector('aside');
const headerHeight = 80;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll) {
    // Scrolling down – hide both
    header.style.transform = `translateY(-${headerHeight}px)`;
    sidebar.style.top = '0px';
    sidebar.style.height = '100vh';
  } else {
    // Scrolling up – show both
    header.style.transform = 'translateY(0)';
    sidebar.style.top = `${headerHeight}px`;
    sidebar.style.height = `calc(100vh - ${headerHeight}px)`;
  }

  lastScroll = currentScroll;
});
