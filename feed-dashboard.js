const feedForm = document.getElementById('feedPostForm');
const feedInput = document.getElementById('feedPostInput');
const feedList = document.getElementById('feedList');
const feedSearchInput = document.getElementById('feedSearchInput');
const feedFilterChips = document.querySelectorAll('#feedFilterChips .chip');
const skillHarvestGrid = document.getElementById('skillHarvestGrid');
const weeklyProgressList = document.getElementById('weeklyProgressList');
const trendingSkillsList = document.getElementById('trendingSkillsList');
const mentorList = document.getElementById('mentorList');

const feedKey = 'autohiree_feed_posts';
const activeSkillKey = 'autohiree_skill_harvest_items';

const normalize = (value) => value.trim().toLowerCase();

const skillHarvestSeed = [
  { type: 'skills', title: 'Prompt Engineering Sprint', description: '2-week live cohort with project review and badge unlock.', cta: 'Join Track', tone: 'outline' },
  { type: 'jobs', title: 'Remote AI Content Strategist', description: 'Match score 92% · Paid pilot role · Immediate onboarding.', cta: 'Apply Now', tone: 'primary' },
  { type: 'projects', title: 'Skill-to-Project Challenge', description: 'Complete one client-style case study and collect endorsements.', cta: 'Start Challenge', tone: 'outline' },
  { type: 'mentors', title: 'Mentor Office Hour', description: '20-min portfolio review with hiring managers and top freelancers.', cta: 'Book Slot', tone: 'outline' },
  { type: 'skills', title: 'RAG Fundamentals Path', description: 'Hands-on retrieval pipeline exercises with checkpoint scoring.', cta: 'Start Learning', tone: 'outline' },
  { type: 'jobs', title: 'Freelance AI QA Tester', description: 'Contract role · Async collaboration · 88% fit.', cta: 'Apply Now', tone: 'primary' },
];

const weeklyProgressSeed = [
  'Skill quests done: 4',
  'Opportunities unlocked: 7',
  'Interviews scheduled: 2',
];

const trendingSkillsSeed = ['AI Product Design', 'RAG Systems', 'Growth Analytics', 'LLM QA', 'Prompt Ops'];

const mentorSeed = [
  'Nina Brooks — Product Mentor (4.9 ★)',
  'Omar Patel — Growth Mentor (4.8 ★)',
  'Lia Gomez — UX Mentor (5.0 ★)',
];

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

const renderSkillHarvest = (items) => {
  if (!skillHarvestGrid) return;

  skillHarvestGrid.innerHTML = '';
  items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'feed-card harvest-card';
    article.dataset.type = item.type;
    article.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <button class="btn apply-button ${item.tone === 'primary' ? 'btn-primary' : 'btn-outline'}" type="button">${item.cta}</button>
    `;
    skillHarvestGrid.appendChild(article);
  });
};

const renderRailLists = () => {
  if (weeklyProgressList) {
    weeklyProgressSeed.forEach((entry) => {
      const li = document.createElement('li');
      const [label, value] = entry.split(':');
      li.innerHTML = `<strong>${label}:</strong>${value}`;
      weeklyProgressList.appendChild(li);
    });
  }

  if (trendingSkillsList) {
    trendingSkillsSeed.forEach((skill) => {
      const span = document.createElement('span');
      span.className = 'chip-label';
      span.textContent = skill;
      trendingSkillsList.appendChild(span);
    });
  }

  if (mentorList) {
    mentorSeed.forEach((mentor) => {
      const li = document.createElement('li');
      li.textContent = mentor;
      mentorList.appendChild(li);
    });
  }
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
  const harvestCards = document.querySelectorAll('#skillHarvestGrid .harvest-card');
  harvestCards.forEach((card) => {
    const type = card.dataset.type || '';
    const visible = filter === 'all' || filter === type;
    card.style.display = visible ? '' : 'none';
  });
 };

const initializeHarvestData = () => {
  const existing = JSON.parse(localStorage.getItem(activeSkillKey) || 'null');
  const data = Array.isArray(existing) && existing.length ? existing : skillHarvestSeed;
  if (!existing) localStorage.setItem(activeSkillKey, JSON.stringify(skillHarvestSeed));
  renderSkillHarvest(data);
};

initializeHarvestData();
renderRailLists();

if (feedFilterChips.length) {
  feedFilterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const selected = chip.dataset.filter || 'all';
      feedFilterChips.forEach((button) => button.classList.toggle('active', button === chip));
      applyHarvestFilter(selected);
    });
  });
}

if (feedSearchInput) {
  feedSearchInput.addEventListener('input', () => {
    const term = normalize(feedSearchInput.value);
    const harvestCards = document.querySelectorAll('#skillHarvestGrid .harvest-card');

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
