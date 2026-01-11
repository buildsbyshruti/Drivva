(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
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
      false
    );
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  // Like button handler: increment count and toggle liked state (client-side)
  document.querySelectorAll(".like-btn").forEach((btn) => {
    // initialize count from attribute
    let count = parseInt(btn.getAttribute("data-count") || "0", 10);

    btn.addEventListener("click", (e) => {
      // prevent the parent link navigation
      e.preventDefault();
      e.stopPropagation();

      const liked = btn.classList.toggle("liked");
      if (liked) count++;
      else count = Math.max(0, count - 1);

      btn.setAttribute("data-count", String(count));
      const span = btn.querySelector(".likes-num");
      if (span) span.textContent = String(count);
    });
  });
});
// Auto-scroll to listings when category is selected
window.addEventListener("load", () => {
  const shouldScrollByHash = window.location.hash === "#projects";
  const urlParams = new URLSearchParams(window.location.search);
  const hasCategoryParam = urlParams.has("category");
  const onListingsPath =
    window.location.pathname && window.location.pathname.includes("listings");

  if (shouldScrollByHash || hasCategoryParam || onListingsPath) {
    const section = document.getElementById("projects");
    if (!section) return;
    // small delay to ensure layout/DOM paints (helps with server-rendered pages)
    setTimeout(() => {
      const nav = document.querySelector(".airbnb-navbar");
      const navHeight = nav ? nav.offsetHeight : 84;
      const top =
        section.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }, 120);
  }
});
