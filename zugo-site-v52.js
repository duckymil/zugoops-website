
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menuToggle");
  const menu = document.querySelector(".mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    });
  }

  document.querySelectorAll("form[data-zugo-form]").forEach(form => {
    const status = form.querySelector(".formStatus");
    const button = form.querySelector('button[type="submit"]');

    form.querySelectorAll("input, select, textarea").forEach(el => {
      el.addEventListener("input", () => el.setCustomValidity(""));
      el.addEventListener("invalid", () => {
        if (el.validity.valueMissing) el.setCustomValidity("Uzupełnij to pole.");
        else if (el.validity.typeMismatch) el.setCustomValidity("Wpisz poprawny adres e-mail.");
        else el.setCustomValidity("Sprawdź wartość tego pola.");
      });
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      button.disabled = true;
      const original = button.textContent;
      button.textContent = "Wysyłamy…";
      if (status) { status.textContent = ""; status.className = "formStatus"; }

      try {
        const data = new FormData(form);
        data.set("_url", window.location.href);
        data.set("_captcha", "false");
        const res = await fetch("https://formsubmit.co/ajax/kontakt@zugoops.pl", {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });
        const json = await res.json();
        if (!res.ok || json.success === "false" || json.success === false) throw new Error("submit");
        window.location.href = "/dziekujemy.html";
      } catch (err) {
        if (status) {
          status.textContent = "Nie udało się wysłać formularza. Napisz bezpośrednio na kontakt@zugoops.pl.";
          status.className = "formStatus error";
        }
        button.disabled = false;
        button.textContent = original;
      }
    });
  });
});


/* Floating navigation scroll state */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const syncNavState = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  };

  syncNavState();
  window.addEventListener("scroll", syncNavState, { passive: true });
});
