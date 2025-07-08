const articleId = window.location.pathname.replace(/\//g, '-');
// Constants for localStorage keys (unique per article)
const STORAGE_KEY = 'comments-manga';          // for comments
const LIKE_STORAGE_KEY = 'liked-manga-article'; // for likes

// VIDEO IFRAME CLICK TO PLAY
document.querySelectorAll('.video-card .video-wrapper').forEach(wrapper => {
  wrapper.addEventListener('click', () => {
    const article = wrapper.closest('.video-card');
    const videoId = article.dataset.videoId;
    if (!videoId) return;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.width = '100%';
    iframe.style.height = '180px';

    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
  });
});

// TAG FILTERING & HIGHLIGHTING
document.addEventListener('DOMContentLoaded', () => {
  const tags = document.querySelectorAll('.tag');
  let activeFilter = null;

  tags.forEach(tag => {
    tag.style.cursor = 'pointer';

    tag.addEventListener('click', () => {
      const clickedTag = tag.dataset.tag;

      if (activeFilter === clickedTag) {
        activeFilter = null;
        showAllArticles();
        clearTagHighlight(tags);
      } else {
        activeFilter = clickedTag;
        filterArticlesByTag(activeFilter);
        highlightActiveTag(tags, activeFilter);
      }
    });
  });
});

function clearTagHighlight(tags) {
  tags.forEach(tag => tag.classList.remove('active'));
}

function highlightActiveTag(tags, tagName) {
  tags.forEach(tag => {
    tag.classList.toggle('active', tag.dataset.tag === tagName);
  });
}

function showAllArticles() {
  const articles = document.querySelectorAll('.card');
  articles.forEach(article => article.style.display = '');
}

function filterArticlesByTag(tag) {
  const articles = document.querySelectorAll('.card');
  articles.forEach(article => {
    const articleTags = Array.from(article.querySelectorAll('.tag')).map(t => t.dataset.tag);
    if (articleTags.includes(tag)) {
      article.style.display = '';
    } else {
      article.style.display = 'none';
    }
  });
}

// DARK MODE TOGGLE
const toggleButton = document.getElementById("darkModeToggle");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  toggleButton.textContent = isDark ? "☀️" : "🌙";
});

// TEXT-TO-SPEECH
const listenButton = document.getElementById("listenButton");
const articleContent = document.getElementById("article-content");

let isSpeaking = false;
let utterance;

listenButton.addEventListener("click", () => {
  if (isSpeaking) {
    speechSynthesis.cancel();
    isSpeaking = false;
    listenButton.textContent = "🔊";
    return;
  }

  const text = articleContent.innerText || articleContent.textContent;
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  utterance.onend = () => {
    isSpeaking = false;
    listenButton.textContent = "🔊";
  };

  speechSynthesis.speak(utterance);
  isSpeaking = true;
  listenButton.textContent = "⏹";
});

// READING TIME CALCULATION
document.addEventListener("DOMContentLoaded", () => {
  const articleWrapper = document.getElementById("article-wrapper");

  if (articleWrapper) {
    const text = articleWrapper.innerText || articleWrapper.textContent;
    const words = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const readingTime = Math.ceil(words / wordsPerMinute);

    const readingTimeElement = document.getElementById("reading-time");
    if (readingTimeElement) {
      readingTimeElement.textContent = `⏱ ${readingTime} min read`;
    }
  }
});

// LIKE BUTTON WITH localStorage
document.addEventListener("DOMContentLoaded", () => {
  const likeButton = document.getElementById("likeButton");

  if (localStorage.getItem(LIKE_STORAGE_KEY) === "true") {
    likeButton.classList.add("liked");
  }

  likeButton.addEventListener("click", () => {
    const liked = likeButton.classList.toggle("liked");
    localStorage.setItem(LIKE_STORAGE_KEY, liked);
  });
});


// COMMENT SYSTEM WITH localStorage

const commentModal = document.getElementById('commentModal');
const commentButton = document.getElementById('commentButton');
const submitComment = document.getElementById('submitComment');
const cancelComment = document.getElementById('cancelComment');
const commentName = document.getElementById('commentName');
const commentText = document.getElementById('commentText');
const commentList = document.getElementById('commentList');

// Show comment modal
commentButton.addEventListener('click', () => {
  commentModal.classList.remove('hidden');
});

// Hide modal and clear inputs
cancelComment.addEventListener('click', () => {
  commentModal.classList.add('hidden');
  commentName.value = '';
  commentText.value = '';
});

// Load saved comments on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  savedComments.forEach(({ name, comment }) => {
    appendCommentToDOM(name, comment);
  });
});

// Submit comment: validate, save, append, clear, close
submitComment.addEventListener('click', () => {
  const name = commentName.value.trim();
  const comment = commentText.value.trim();

  if (!name || !comment) {
    alert('Please fill in both name and comment!');
    return;
  }

  appendCommentToDOM(name, comment);

  const savedComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  savedComments.push({ name, comment });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedComments));

  commentName.value = '';
  commentText.value = '';
  commentModal.classList.add('hidden');
});

// Append comment safely to the DOM
function appendCommentToDOM(name, comment) {
  const div = document.createElement('div');
  div.classList.add('comment-entry');
  div.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${escapeHtml(comment)}</p>`;
  commentList.appendChild(div);
}

// Simple HTML escape to avoid injection
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Warm mode toggle
const warmToggle = document.getElementById("warmModeToggle");
if (warmToggle) {
  warmToggle.addEventListener("click", () => {
    document.body.classList.toggle("warm-mode");
  });
}
