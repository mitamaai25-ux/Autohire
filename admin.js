const storageKeys = {
  user: 'mitama_admin_user',
  projects: 'mitama_admin_projects',
  loggedIn: 'mitama_admin_logged_in',
  reservations: 'mitama_reservations',
};

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const forgotForm = document.getElementById('forgotForm');
const recoveryMessage = document.getElementById('recoveryMessage');
const projectManager = document.getElementById('projectManager');
const projectForm = document.getElementById('projectForm');
const projectList = document.getElementById('projectList');
const reservationList = document.getElementById('reservationList');

const getUser = () => JSON.parse(localStorage.getItem(storageKeys.user) || 'null');
const getProjects = () => JSON.parse(localStorage.getItem(storageKeys.projects) || '[]');
const getReservations = () => JSON.parse(localStorage.getItem(storageKeys.reservations) || '[]');

const renderProjects = () => {
  const projects = getProjects();
  projectList.innerHTML = '';
  projects.forEach((project) => {
    const li = document.createElement('li');
    li.className = 'case';
    li.innerHTML = `<h3>${project.name}</h3><p>${project.summary}</p>`;
    projectList.appendChild(li);
  });
};

const renderReservations = () => {
  reservationList.innerHTML = '';
  const reservations = getReservations();

  if (!reservations.length) {
    const empty = document.createElement('li');
    empty.className = 'feature';
    empty.textContent = 'No client reservations yet.';
    reservationList.appendChild(empty);
    return;
  }

  reservations
    .slice()
    .reverse()
    .forEach((reservation) => {
      const li = document.createElement('li');
      li.className = 'case';
      li.innerHTML = `
        <h3>${reservation.service}</h3>
        <p><strong>Client:</strong> ${reservation.clientName}</p>
        <p><strong>Email:</strong> ${reservation.email}</p>
        <p><strong>Brief:</strong> ${reservation.brief}</p>
      `;
      reservationList.appendChild(li);
    });
};

const setLoggedInState = (isLoggedIn) => {
  localStorage.setItem(storageKeys.loggedIn, isLoggedIn ? 'true' : 'false');
  projectManager.classList.toggle('hidden', !isLoggedIn);
  if (isLoggedIn) {
    renderProjects();
    renderReservations();
  }
};

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  localStorage.setItem(storageKeys.user, JSON.stringify({ email, password }));
  alert('Login created successfully. You can now sign in.');
  registerForm.reset();
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const user = getUser();

  if (user && user.email === email && user.password === password) {
    setLoggedInState(true);
    alert('Signed in successfully. You can now add projects and view reservations.');
    loginForm.reset();
    return;
  }

  alert('Invalid credentials. Please try again or create a login.');
});

forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
  const user = getUser();
  recoveryMessage.textContent =
    user && user.email === email
      ? `Recovery hint: your password is "${user.password}"`
      : 'No account found for this email.';
});

projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('projectName').value.trim();
  const summary = document.getElementById('projectSummary').value.trim();
  const projects = getProjects();
  projects.push({ name, summary });
  localStorage.setItem(storageKeys.projects, JSON.stringify(projects));
  projectForm.reset();
  renderProjects();
});

setLoggedInState(localStorage.getItem(storageKeys.loggedIn) === 'true');
