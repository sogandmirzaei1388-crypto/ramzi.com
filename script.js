const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

const servicesViewport = document.querySelector(".services-viewport");
const servicesTrack = document.querySelector(".services-grid");
const previousServiceButton = document.querySelector(".services-control--previous");
const nextServiceButton = document.querySelector(".services-control--next");

if (servicesViewport && servicesTrack && previousServiceButton && nextServiceButton) {
  function updateServiceControls() {
    const maxScroll = servicesViewport.scrollWidth - servicesViewport.clientWidth;
    previousServiceButton.disabled = servicesViewport.scrollLeft <= 1;
    nextServiceButton.disabled = servicesViewport.scrollLeft >= maxScroll - 1;
  }

  function moveServices(direction) {
    const card = servicesTrack.querySelector(".service-card");
    if (!card) return;

    const gap = Number.parseFloat(getComputedStyle(servicesTrack).columnGap) || 0;
    servicesViewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  previousServiceButton.addEventListener("click", () => moveServices(-1));
  nextServiceButton.addEventListener("click", () => moveServices(1));
  servicesViewport.addEventListener("scroll", updateServiceControls, { passive: true });
  window.addEventListener("resize", updateServiceControls);
  window.addEventListener("load", updateServiceControls, { once: true });
  updateServiceControls();
}

const featureVideoCard = document.querySelector(".feature-card--video");
const featureVideo = featureVideoCard?.querySelector(".feature-video");
let featureVideoPinned = false;

function playFeatureVideo() {
  featureVideo.play().catch(() => {});
}

function toggleFeatureVideo() {
  if (featureVideo.paused) {
    featureVideoPinned = true;
    playFeatureVideo();
    featureVideoCard.setAttribute("aria-pressed", "true");
    return;
  }

  if (featureVideoPinned) {
    featureVideo.pause();
    featureVideoPinned = false;
    featureVideoCard.setAttribute("aria-pressed", "false");
  } else {
    featureVideoPinned = true;
    featureVideoCard.setAttribute("aria-pressed", "true");
  }
}

if (featureVideoCard && featureVideo) {
  featureVideo.addEventListener("play", () => featureVideoCard.setAttribute("aria-pressed", "true"));
  featureVideo.addEventListener("pause", () => featureVideoCard.setAttribute("aria-pressed", "false"));
  featureVideoCard.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && !featureVideoPinned) playFeatureVideo();
  });
  featureVideoCard.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !featureVideoPinned) {
      featureVideo.pause();
      featureVideo.currentTime = 0;
    }
  });
  featureVideoCard.addEventListener("click", toggleFeatureVideo);
  featureVideoCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFeatureVideo();
    }
  });
}
