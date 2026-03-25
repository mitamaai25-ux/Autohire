const storageKeys = {
  projects: 'autohiree_admin_projects',
  reservations: 'autohiree_reservations',
};

const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
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

const getProjects = () => JSON.parse(localStorage.getItem(storageKeys.projects) || '[]');

const featuredProjects = document.getElementById('featuredProjects');
if (featuredProjects) {
  const projects = getProjects();

  if (!projects.length) {
    featuredProjects.innerHTML = '<li class="feature">No community projects yet. Be the first to add one from admin.</li>';
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

    reservationStatus.textContent = 'Thanks! Your consultation request was saved and sent to AutoHiree admin.';
    contactForm.reset();
  });
}

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
