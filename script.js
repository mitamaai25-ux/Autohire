
const customCursor = document.querySelector('.custom-cursor');
if (customCursor) {
  document.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
  });
}

const storageKeys = {
  projects: 'autohiree_admin_projects',
  reservations: 'autohiree_reservations',
  talentLeads: 'autohiree_talent_leads',
};

const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => observer.observe(el));
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const animateCounter = (el) => {
    const target = Number(el.dataset.target);
    let value = 0;
    const step = Math.max(1, Math.floor(target / 55));

    const tick = () => {
      value += step;
      if (value >= target) {
        el.textContent = target.toLocaleString();
        return;
      }
      el.textContent = value.toLocaleString();
      requestAnimationFrame(tick);
    };

    tick();
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}


const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

if (tabButtons.length && tabPanels.length) {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.tab;

      tabButtons.forEach((btn) => {
        const active = btn.dataset.tab === selected;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === selected);
      });
    });
  });
}


const talentRows = document.querySelectorAll('#talentList li');
const flowLines = document.querySelectorAll('.flow-line');
const opsStatus = document.getElementById('opsStatus');
const opsFit = document.getElementById('opsFit');
const opsScore = document.getElementById('opsScore');

const liveUpdates = [
  { status: 'Reviewing freelancer readiness', fit: 'Noah Garcia — Growth Marketer', score: 91, line: 2, talent: 2 },
  { status: 'Checking onboarding documents', fit: 'Ava Thompson — Product Designer', score: 88, line: 0, talent: 0 },
  { status: 'Budget and timeline alignment', fit: 'Liam Chen — Full Stack Engineer', score: 93, line: 1, talent: 1 },
  { status: 'Final availability confirmation', fit: 'Sara Khan — UX Writer', score: 86, line: 3, talent: 3 },
  { status: 'Preparing proposal handoff', fit: 'Mia Lopez — Marketing Analyst', score: 89, line: 4, talent: 4 },
];

if (opsStatus && opsFit && opsScore && talentRows.length && flowLines.length) {
  let index = 0;

  const applyUpdate = () => {
    const item = liveUpdates[index];
    opsStatus.textContent = item.status;
    opsFit.innerHTML = `Current best fit: <strong>${item.fit}</strong>`;
    opsScore.textContent = `${item.score}%`;

    talentRows.forEach((row, i) => row.classList.toggle('active', i === item.talent));
    flowLines.forEach((line, i) => line.classList.toggle('active', i === item.line));

    index = (index + 1) % liveUpdates.length;
  };

  applyUpdate();
  setInterval(applyUpdate, 2600);
}

const feedItems = [
  'NovaCloud hired a Senior DevOps Engineer in 36 hours using AI shortlisting.',
  'DesignHub posted a project: Product Designer for Fintech onboarding revamp.',
  'Elena Carter earned 3 new endorsements in AI product strategy this week.',
  'Apex Retail is actively hiring freelance growth marketers across North America.',
];

const activityFeed = document.getElementById('activityFeed');
if (activityFeed) {
  feedItems.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    activityFeed.appendChild(li);
  });
}

const getProjects = () => JSON.parse(localStorage.getItem(storageKeys.projects) || '[]');
const featuredProjects = document.getElementById('featuredProjects');
if (featuredProjects) {
  const projects = getProjects();
  if (!projects.length) {
    featuredProjects.innerHTML = '<li class="feature">No community projects yet. Add one from admin portal.</li>';
  } else {
    projects
      .slice()
      .reverse()
      .slice(0, 4)
      .forEach((project) => {
        const li = document.createElement('li');
        li.className = 'case';
        li.innerHTML = `<h3>${project.name}</h3><p>${project.summary}</p>`;
        featuredProjects.appendChild(li);
      });
  }
}


const jobSearchForm = document.getElementById('jobSearchForm');
const searchBar = document.getElementById('search-bar');
const jobCards = document.querySelectorAll('#jobGrid .job-card');

if (jobSearchForm && searchBar && jobCards.length) {
  jobSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = searchBar.value.trim().toLowerCase();

    jobCards.forEach((card) => {
      const title = String(card.dataset.title || '').toLowerCase();
      const meta = String(card.dataset.meta || '').toLowerCase();
      const show = !term || title.includes(term) || meta.includes(term);
      card.style.display = show ? '' : 'none';
    });
  });
}

const contactForm = document.getElementById('contactForm');
const reservationStatus = document.getElementById('reservationStatus');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);

    const reservation = {
      clientName: String(formData.get('company')).trim(),
      email: String(formData.get('email')).trim().toLowerCase(),
      service: String(formData.get('service')),
      brief: String(formData.get('brief')).trim(),
      createdAt: new Date().toISOString(),
    };

    const reservations = JSON.parse(localStorage.getItem(storageKeys.reservations) || '[]');
    reservations.push(reservation);
    localStorage.setItem(storageKeys.reservations, JSON.stringify(reservations));

    reservationStatus.textContent = 'Success! We saved your hiring request and will send AI-matched talent suggestions.';
    contactForm.reset();
  });
}

const talentApplyForm = document.getElementById('talentApplyForm');
const talentStatus = document.getElementById('talentStatus');
if (talentApplyForm) {
  talentApplyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(talentApplyForm);

    const profile = {
      name: String(formData.get('name')).trim(),
      email: String(formData.get('email')).trim().toLowerCase(),
      role: String(formData.get('role')).trim(),
      summary: String(formData.get('summary')).trim(),
      createdAt: new Date().toISOString(),
    };

    const talentLeads = JSON.parse(localStorage.getItem(storageKeys.talentLeads) || '[]');
    talentLeads.push(profile);
    localStorage.setItem(storageKeys.talentLeads, JSON.stringify(talentLeads));

    talentStatus.textContent = 'Profile submitted! Your account is queued for network verification.';
    talentApplyForm.reset();
  });
}

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();
