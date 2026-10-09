const projects = [
  { src: "images/kitchen.webp", label: "KITCHEN REMODEL" },
  { src: "images/primary-bathroom.webp", label: "PRIMARY BATHROOM" },
  { src: "images/custom-shower.webp", label: "CUSTOM SHOWER" },
  { src: "images/bathroom-renovation.webp", label: "BATHROOM RENOVATION" },
  { src: "images/living-room.webp", label: "LIVING ROOM REMODEL" },
  { src: "images/residential-exterior.webp", label: "RESIDENTIAL EXTERIOR" },
];

function toggleMenu(button) {
  const nav = document.getElementById("nav");
  nav.classList.toggle("open");
  button.setAttribute("aria-expanded", String(nav.classList.contains("open")));
}

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("open");
  });
});

function openProject(index) {
  const project = projects[index];
  const image = document.getElementById("modalImg");
  image.src = project.src;
  image.alt = project.label;
  document.getElementById("modalCaption").textContent = project.label;
  document.getElementById("modal").classList.add("open");
}

function closeProject() {
  document.getElementById("modal").classList.remove("open");
}

document.getElementById("modal").addEventListener("click", (event) => {
  if (event.target.id === "modal") closeProject();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProject();
});

document.getElementById("year").textContent = new Date().getFullYear();
