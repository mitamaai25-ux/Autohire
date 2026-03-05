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
    const step = Math.max(1, Math.floor(target / 50));

    const tick = () => {
      value += step;
      if (value >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = value;
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
      const targetId = button.dataset.tab;
      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach((panel) => panel.classList.remove('active'));

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

const reservationForms = document.querySelectorAll('.reservation-form');
const reservationStatus = document.getElementById('reservationStatus');
if (reservationForms.length) {
  reservationForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const reservation = {
        service: form.dataset.service,
        clientName: formData.get('clientName')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        brief: formData.get('brief')?.toString().trim(),
        submittedAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem('mitama_reservations') || '[]');
      existing.push(reservation);
      localStorage.setItem('mitama_reservations', JSON.stringify(existing));

      if (reservationStatus) {
        reservationStatus.textContent = `Reservation received for ${reservation.service}. Our team will contact you shortly.`;
      }

      form.reset();
    });
  });
}
