(() => {
  "use strict";

  /* ---------------------------------------------------------------------
   * CONFIG
   * -------------------------------------------------------------------*/
  // TODO: substitua pelo número oficial de WhatsApp da Estefani Sá
  // Formato: código do país + DDD + número, apenas dígitos. Ex: 5531999998888
  const WHATSAPP_NUMBER = "5500000000000";
  const LEAD_ENDPOINT = "/api/lead";

  document.getElementById("year").textContent = new Date().getFullYear();

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Olá! Vim pelo site e quero solicitar uma análise da minha operação."
  )}`;
  const waFloat = document.getElementById("waFloat");
  const footerWhats = document.getElementById("footerWhats");
  if (waFloat) waFloat.href = waLink;
  if (footerWhats) footerWhats.href = waLink;

  /* ---------------------------------------------------------------------
   * HEADER — solid on scroll
   * -------------------------------------------------------------------*/
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------------
   * MOBILE NAV
   * -------------------------------------------------------------------*/
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  mainNav.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* ---------------------------------------------------------------------
   * SCROLL REVEAL ANIMATIONS
   * -------------------------------------------------------------------*/
  const revealEls = document.querySelectorAll(".reveal, .stagger, .steps");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    // Safety net: caso algum elemento nunca entre no viewport observado
    // (ex.: geração automática de PDF/print, crawlers, ferramentas de QA),
    // garante que o conteúdo fique visível mesmo sem interseção real.
    window.setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }, 4000);
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------------------
   * PARALLAX — camadas de imagem das seções
   * -------------------------------------------------------------------*/
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layers = [
    { el: document.querySelector(".hero-media"), speed: 0.16 },
    { el: document.querySelector(".problema-media"), speed: 0.1 },
    { el: document.querySelector(".faixa-media"), speed: 0.14 },
    { el: document.querySelector(".autoridade-media"), speed: 0.08 },
  ].filter((l) => l.el);

  if (layers.length && !reduceMotion && window.matchMedia("(min-width: 861px)").matches) {
    let ticking = false;
    const update = () => {
      const viewportH = window.innerHeight;
      layers.forEach(({ el, speed }) => {
        const section = el.parentElement;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewportH + 200) return;
        // deslocamento relativo ao centro da viewport
        const offset = (rect.top + rect.height / 2 - viewportH / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const onParallaxScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    window.addEventListener("resize", onParallaxScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
   * PHONE MASK — (00) 00000-0000
   * -------------------------------------------------------------------*/
  function maskPhone(value) {
    let v = value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
      v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, (_, a, b, c) =>
        c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`
      );
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,5})/, (_, a, b) => (b ? `(${a}) ${b}` : `(${a}`));
    } else if (v.length > 0) {
      v = v.replace(/(\d{0,2})/, "($1");
    }
    return v;
  }
  document.querySelectorAll('input[name="whatsapp"]').forEach((input) => {
    input.addEventListener("input", (e) => {
      e.target.value = maskPhone(e.target.value);
    });
  });

  /* ---------------------------------------------------------------------
   * LEAD FORMS — validation + submit
   * -------------------------------------------------------------------*/
  function setInvalid(field, invalid) {
    field.classList.toggle("invalid", invalid);
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll(".field").forEach((field) => {
      const input = field.querySelector("input, select");
      if (!input || !input.hasAttribute("required")) return;
      const ok = input.value.trim().length > 0;
      setInvalid(field, !ok);
      if (!ok) valid = false;
    });
    const waInput = form.querySelector('input[name="whatsapp"]');
    if (waInput) {
      const digits = waInput.value.replace(/\D/g, "");
      const ok = digits.length >= 10;
      setInvalid(waInput.closest(".field"), !ok);
      if (!ok) valid = false;
    }
    return valid;
  }

  async function handleSubmit(form, successEl) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Honeypot spam-guard
      const honeypot = form.querySelector('input[name="empresa_site"]');
      if (honeypot && honeypot.value) return;

      if (!validateForm(form)) {
        const firstInvalid = form.querySelector(".field.invalid input, .field.invalid select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.style.opacity = ".7";
      submitBtn.textContent = "Enviando…";

      const data = Object.fromEntries(new FormData(form).entries());
      delete data.empresa_site;

      try {
        await fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).catch(() => null); // não bloqueia a UX caso a function ainda não esteja configurada

        form.classList.add("is-hidden");
        successEl.classList.add("is-visible");
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "";
        submitBtn.innerHTML = originalLabel;
      }
    });
  }

  const formHero = document.getElementById("formHero");
  const formFinal = document.getElementById("formFinal");
  if (formHero) handleSubmit(formHero, document.getElementById("successHero"));
  if (formFinal) handleSubmit(formFinal, document.getElementById("successFinal"));
})();
