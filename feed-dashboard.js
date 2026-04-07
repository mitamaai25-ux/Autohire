const feedForm = document.getElementById('feedPostForm');
const feedInput = document.getElementById('feedPostInput');
const feedList = document.getElementById('feedList');
const feedSearchInput = document.getElementById('feedSearchInput');
const feedFilterChips = document.querySelectorAll('#feedFilterChips .chip');
const harvestCards = document.querySelectorAll('#skillHarvestGrid .harvest-card');

const feedKey = 'autohiree_feed_posts';

const normalize = (value) => value.trim().toLowerCase();

const createPostCard = (text, createdAtLabel) => {
  const article = document.createElement('article');
  article.className = 'feed-card post-card';
  article.innerHTML = `
    <div class="post-head">
      <div class="avatar-mini">Y</div>
      <div>
        <h3>You <span>· Posted now</span></h3>
        <p>${createdAtLabel}</p>
      </div>
    </div>
    <p>${text}</p>
    <div class="post-actions"><span><i class="fa-regular fa-heart"></i> 0</span><span><i class="fa-regular fa-comment"></i> 0</span><span><i class="fa-solid fa-share-nodes"></i> 0</span><span><i class="fa-regular fa-bookmark"></i> Save</span></div>
  `;
  return article;
};

const renderFeedPosts = () => {
  if (!feedList) return;

  const posts = JSON.parse(localStorage.getItem(feedKey) || '[]');

  posts
    .slice()
    .reverse()
    .forEach((post) => {
      const article = createPostCard(post.text, new Date(post.createdAt).toLocaleString());
      feedList.prepend(article);
    });
};

const applyHarvestFilter = (filter) => {
  harvestCards.forEach((card) => {
    const type = card.dataset.type || '';
    const visible = filter === 'all' || filter === type;
    card.style.display = visible ? '' : 'none';
  });
};

if (feedFilterChips.length && harvestCards.length) {
  feedFilterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const selected = chip.dataset.filter || 'all';
      feedFilterChips.forEach((button) => button.classList.toggle('active', button === chip));
      applyHarvestFilter(selected);
    });
  });
}

if (feedSearchInput && harvestCards.length) {
  feedSearchInput.addEventListener('input', () => {
    const term = normalize(feedSearchInput.value);

    harvestCards.forEach((card) => {
      const text = normalize(card.textContent || '');
      card.style.display = !term || text.includes(term) ? '' : 'none';
    });
  });
}

if (feedForm && feedInput && feedList) {
  feedForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = feedInput.value.trim();
    if (!text) return;

    const posts = JSON.parse(localStorage.getItem(feedKey) || '[]');
    posts.push({ text, createdAt: new Date().toISOString() });
    localStorage.setItem(feedKey, JSON.stringify(posts));

    feedList.prepend(createPostCard(text, 'Just now'));
    feedInput.value = '';
  });

  renderFeedPosts();
}
