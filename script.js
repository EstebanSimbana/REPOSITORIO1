const timelineContent = {
  sporting: {
    tag: "2002 · Sporting CP",
    title: "El debut profesional",
    text: "Ronaldo irrumpe en el primer equipo del Sporting CP con regate, velocidad y una personalidad difícil de ignorar. Esa primera temporada abre la puerta a su salto a Inglaterra."
  },
  united: {
    tag: "2003-2009 · Manchester United",
    title: "La transformación en estrella",
    text: "Con Sir Alex Ferguson, pasa de promesa explosiva a ganador total: Premier League, Champions League 2008 y su primer Balón de Oro. El número 7 se convierte en parte central de su identidad."
  },
  madrid: {
    tag: "2009-2018 · Real Madrid",
    title: "La etapa de los récords",
    text: "En Madrid alcanza su pico goleador: 451 goles oficiales, noches decisivas en Champions y una rivalidad histórica que elevó el listón competitivo del fútbol europeo."
  },
  juventus: {
    tag: "2018-2021 · Juventus",
    title: "Adaptación en Italia",
    text: "En la Serie A conserva su eficacia dentro del área, gana títulos locales y demuestra que su impacto no dependía de una sola liga ni de un único contexto táctico."
  },
  actualidad: {
    tag: "2021-hoy · United, Al-Nassr y Portugal",
    title: "Liderazgo y legado activo",
    text: "Tras volver a Manchester United, llega a Al-Nassr y mantiene el rol de capitán de Portugal. Su carrera sigue asociada al récord, la disciplina y la vigencia competitiva."
  }
};

const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const timelineButtons = document.querySelectorAll(".timeline-button");
const timelinePanel = document.querySelector("#timeline-panel");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const counters = document.querySelectorAll("[data-counter]");

function closeMenu() {
  document.body.classList.remove("menu-open");
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function updateTimeline(stage) {
  const content = timelineContent[stage];

  if (!content) {
    return;
  }

  timelineButtons.forEach((button) => {
    const isActive = button.dataset.stage === stage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  timelinePanel.innerHTML = `
    <p class="timeline-tag">${content.tag}</p>
    <h3>${content.title}</h3>
    <p>${content.text}</p>
  `;
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";
  const duration = 900;
  const startTime = performance.now();

  function tick(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * target);

    counter.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = `${target}${suffix}`;
    }
  }

  requestAnimationFrame(tick);
}

menuToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => updateTimeline(button.dataset.stage));
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);

      navLinks.forEach((link) => link.classList.remove("is-current"));

      if (activeLink) {
        activeLink.classList.add("is-current");
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.35 }
);

counters.forEach((counter) => counterObserver.observe(counter));
