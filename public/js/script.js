(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const listingId = btn.getAttribute("data-id");
      if (!listingId) return;

      try {
        const res = await fetch(`/listings/${listingId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401 || res.status === 302) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

        btn.setAttribute("data-count", String(data.likes));
        const span = btn.querySelector(".likes-num");
        if (span) span.textContent = String(data.likes);

        const icon = btn.querySelector("i");
        if (data.liked) {
          btn.classList.add("liked");
          if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
          }
        } else {
          btn.classList.remove("liked");
          if (icon) {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
          }
        }
      } catch (err) {
        console.error("Like toggle failed", err);
      }
    });
  });
});

window.addEventListener("load", () => {
  const shouldScrollByHash = window.location.hash === "#projects";
  const urlParams = new URLSearchParams(window.location.search);
  const hasCategoryParam = urlParams.has("category");
  const onListingsPath =
    window.location.pathname && window.location.pathname.includes("listings");

  if (shouldScrollByHash || hasCategoryParam || onListingsPath) {
    const section = document.getElementById("projects");
    if (!section) return;

    setTimeout(() => {
      const nav = document.querySelector(".airbnb-navbar");
      const navHeight = nav ? nav.offsetHeight : 84;
      const top =
        section.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }, 120);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".star-rating");
  if (!container) return;

  const stars = Array.from(container.querySelectorAll(".star-btn"));
  const input = document.getElementById("rating-input");
  let current = Math.max(
    1,
    Math.min(5, parseInt((input && input.value) || "5", 10)),
  );

  function paint(n) {
    stars.forEach((btn, idx) => {
      const filled = idx < n;
      btn.classList.toggle("filled", filled);
      btn.setAttribute("aria-checked", idx + 1 === n ? "true" : "false");
    });
  }

  function setRating(n) {
    current = n;
    if (input) input.value = String(n);
    paint(n);
  }

  paint(current);

  stars.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.getAttribute("data-value"), 10);
      setRating(val);
    });
    btn.addEventListener("mouseenter", () => {
      const val = parseInt(btn.getAttribute("data-value"), 10);
      paint(val);
    });
  });

  container.addEventListener("mouseleave", () => paint(current));
  container.tabIndex = 0;
  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRating(Math.min(5, current + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRating(Math.max(1, current - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setRating(1);
    } else if (e.key === "End") {
      e.preventDefault();
      setRating(5);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".flash-container");
  if (!container) return;
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".flash-close");
    if (!btn) return;
    const toast = btn.closest(".flash-toast");
    if (toast) toast.classList.add("flash-hide");
  });
  const toasts = Array.from(container.querySelectorAll(".flash-toast"));
  toasts.forEach((t) => {
    setTimeout(() => {
      t.classList.add("flash-hide");
      setTimeout(() => {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 420);
    }, 5000);
  });
});
