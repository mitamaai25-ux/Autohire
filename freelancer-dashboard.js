const dashboardKeys = {
  profile: 'autohiree_freelancer_profile',
  proposals: 'autohiree_freelancer_proposals',
  projects: 'autohiree_admin_projects',
};

const dashboardNav = document.getElementById('freelancerNav');
const dashboardViews = document.querySelectorAll('[data-dashboard-view]');

const showView = (view) => {
  dashboardViews.forEach((section) => {
    section.classList.toggle('active', section.dataset.dashboardView === view);
  });

  dashboardNav.querySelectorAll('a[data-view]').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === view);
  });
};

if (dashboardNav) {
  dashboardNav.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-view]');
    if (!link) return;
    event.preventDefault();
    showView(link.dataset.view);
  });
}

const defaultProfile = {
  name: 'Alex Morgan',
  headline: 'Product Designer & UX Specialist',
  completion: 90,
};

const getProfile = () => JSON.parse(localStorage.getItem(dashboardKeys.profile) || 'null') || defaultProfile;
const setProfile = (profile) => localStorage.setItem(dashboardKeys.profile, JSON.stringify(profile));
const getProjects = () => JSON.parse(localStorage.getItem(dashboardKeys.projects) || '[]');
const getProposals = () => JSON.parse(localStorage.getItem(dashboardKeys.proposals) || '[]');
const setProposals = (list) => localStorage.setItem(dashboardKeys.proposals, JSON.stringify(list));

const profileNameInput = document.getElementById('profileName');
const profileHeadlineInput = document.getElementById('profileHeadline');
const profileCompletionInput = document.getElementById('profileCompletion');
const profileStatus = document.getElementById('profileStatus');

const welcomeName = document.getElementById('welcomeName');
const profileInitial = document.getElementById('profileInitial');
const profilePercentLabel = document.getElementById('profilePercentLabel');
const profileProgressBar = document.getElementById('profileProgressBar');

const hydrateProfile = () => {
  const profile = getProfile();
  welcomeName.textContent = `Welcome, ${profile.name}`;
  profileInitial.textContent = profile.name.charAt(0).toUpperCase();
  profilePercentLabel.textContent = `${profile.completion}%`;
  profileProgressBar.style.width = `${profile.completion}%`;

  profileNameInput.value = profile.name;
  profileHeadlineInput.value = profile.headline;
  profileCompletionInput.value = profile.completion;
};

hydrateProfile();

const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const profile = {
    name: profileNameInput.value.trim(),
    headline: profileHeadlineInput.value.trim(),
    completion: Math.min(100, Math.max(30, Number(profileCompletionInput.value))),
  };

  setProfile(profile);
  hydrateProfile();
  profileStatus.textContent = 'Profile updated successfully.';
  setActionStatus('Profile updated and synced in dashboard.');
});

document.getElementById('openProfileBtn').addEventListener('click', () => {
  showView('profile');
});


const dashboardActionStatus = document.getElementById('dashboardActionStatus');
const setActionStatus = (message) => {
  if (dashboardActionStatus) dashboardActionStatus.textContent = message;
};

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  if (action === 'view-projects') {
    showView('browse');
    setActionStatus('Opened Browse Projects.');
  } else if (action === 'submit-proposal') {
    showView('proposals');
    setActionStatus('Opened Proposals section.');
  } else if (action === 'open-workspace') {
    setActionStatus('Workspace opened successfully.');
  } else if (action === 'add-payout') {
    setActionStatus('Payout method modal opened (demo).');
  } else if (action === 'generate-invoice') {
    setActionStatus('Invoice generated successfully (demo).');
  } else if (action === 'schedule-call') {
    setActionStatus('Call scheduler opened (demo).');
  } else if (action === 'save-settings') {
    setActionStatus('Account settings saved.');
  }
});

const sampleBrowseProjects = [
  { id: 'b1', title: 'AI Consulting', budget: 'USD 200–700' },
  { id: 'b2', title: 'UX Writing', budget: 'USD 40/hr' },
  { id: 'b3', title: 'Growth Strategy', budget: 'USD 500 fixed' },
];

const browseProjects = document.getElementById('browseProjects');
const proposalList = document.getElementById('proposalList');
const myProjectsList = document.getElementById('myProjectsList');
const newProjectsSummary = document.getElementById('newProjectsSummary');

const renderProposals = () => {
  const proposals = getProposals();
  proposalList.innerHTML = '';

  if (!proposals.length) {
    proposalList.innerHTML = '<li class="feature">No proposals submitted yet.</li>';
    return;
  }

  proposals.slice().reverse().forEach((proposal) => {
    const li = document.createElement('li');
    li.className = 'case';
    li.innerHTML = `<h3>${proposal.title}</h3><p><strong>Budget:</strong> ${proposal.budget}</p><p><strong>Status:</strong> Submitted</p>`;
    proposalList.appendChild(li);
  });
};

const renderBrowseProjects = () => {
  browseProjects.innerHTML = '';

  sampleBrowseProjects.forEach((project) => {
    const li = document.createElement('li');
    li.className = 'case';
    li.innerHTML = `<h3>${project.title}</h3><p><strong>Budget:</strong> ${project.budget}</p><button class="btn apply-button btn-outline" data-proposal-id="${project.id}">Submit Proposal</button>`;
    browseProjects.appendChild(li);
  });
};

browseProjects.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-proposal-id]');
  if (!button) return;

  const project = sampleBrowseProjects.find((item) => item.id === button.dataset.proposalId);
  const proposals = getProposals();
  proposals.push({ title: project.title, budget: project.budget, createdAt: new Date().toISOString() });
  setProposals(proposals);
  renderProposals();
  showView('proposals');
  setActionStatus('Proposal submitted successfully.');
});

const renderMyProjects = () => {
  const projects = getProjects();
  myProjectsList.innerHTML = '';

  if (!projects.length) {
    myProjectsList.innerHTML = '<li class="feature">No assigned projects yet. Check Browse Projects.</li>';
    return;
  }

  projects.slice().reverse().forEach((project) => {
    const li = document.createElement('li');
    li.className = 'case';
    li.innerHTML = `<h3>${project.name}</h3><p>${project.summary}</p>`;
    myProjectsList.appendChild(li);
  });
};

const renderRightSummary = () => {
  newProjectsSummary.innerHTML = sampleBrowseProjects
    .slice(0, 2)
    .map((project) => `<p><strong>${project.title}</strong> • Budget: ${project.budget}</p>`)
    .join('');
  newProjectsSummary.innerHTML += '<p><a href="#" id="viewProjectsLink">View Projects</a> | <a href="#" id="submitProposalLink">Submit Proposal</a></p>';
};

newProjectsSummary.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  event.preventDefault();
  if (link.id === 'viewProjectsLink') showView('browse');
  if (link.id === 'submitProposalLink') showView('proposals');
});

renderBrowseProjects();
renderMyProjects();
renderProposals();
renderRightSummary();
showView('dashboard');
