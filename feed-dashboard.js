const feedForm = document.getElementById('feedPostForm');
const feedInput = document.getElementById('feedPostInput');
const feedList = document.getElementById('feedList');

const feedKey = 'autohiree_feed_posts';

const renderFeedPosts = () => {
  const posts = JSON.parse(localStorage.getItem(feedKey) || '[]');

  posts
    .slice()
    .reverse()
    .forEach((post) => {
      const article = document.createElement('article');
      article.className = 'feed-card post-card';
      article.innerHTML = `
        <div class="post-head">
          <div class="avatar-mini">Y</div>
          <div>
            <h3>You <span>· Posted now</span></h3>
            <p>${new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <p>${post.text}</p>
        <div class="post-actions"><span><i class="fa-regular fa-heart"></i> 0</span><span><i class="fa-regular fa-comment"></i> 0</span><span><i class="fa-solid fa-share-nodes"></i> 0</span><span><i class="fa-regular fa-bookmark"></i> Save</span></div>
      `;
      feedList.prepend(article);
    });
};

if (feedForm && feedInput && feedList) {
  feedForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = feedInput.value.trim();
    if (!text) return;

    const posts = JSON.parse(localStorage.getItem(feedKey) || '[]');
    posts.push({ text, createdAt: new Date().toISOString() });
    localStorage.setItem(feedKey, JSON.stringify(posts));

    const article = document.createElement('article');
    article.className = 'feed-card post-card';
    article.innerHTML = `
      <div class="post-head">
        <div class="avatar-mini">Y</div>
        <div>
          <h3>You <span>· Posted now</span></h3>
          <p>Just now</p>
        </div>
      </div>
      <p>${text}</p>
      <div class="post-actions"><span><i class="fa-regular fa-heart"></i> 0</span><span><i class="fa-regular fa-comment"></i> 0</span><span><i class="fa-solid fa-share-nodes"></i> 0</span><span><i class="fa-regular fa-bookmark"></i> Save</span></div>
    `;

    feedList.prepend(article);
    feedInput.value = '';
  });

  renderFeedPosts();
}
