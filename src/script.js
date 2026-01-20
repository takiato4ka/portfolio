// активная секция
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 150;
    if (top >= offset) current = sec.id;
  });

  links.forEach(a => {
    a.classList.remove("active");
    if (a.getAttribute("href") === "#" + current) {
      a.classList.add("active");
    }
  });
});

// форма
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Сообщение отправлено!");
});
