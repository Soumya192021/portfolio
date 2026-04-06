const glassSurface = document.getElementById("glassSurface");
const feImage = document.getElementById("feImage");
const redChannel = document.getElementById("redChannel");
const greenChannel = document.getElementById("greenChannel");
const blueChannel = document.getElementById("blueChannel");
const gaussianBlur = document.getElementById("gaussianBlur");

const config = {
  borderRadius: 9999,
  borderWidth: 0.07,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0,
  backgroundOpacity: 0.10,
  saturation: 1.8,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
  xChannel: "R",
  yChannel: "G",
  mixBlendMode: "difference"
};

function isDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function supportsBackdropFilter() {
  return CSS.supports("backdrop-filter", "blur(10px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(10px)");
}

function supportsSVGFilters() {
  const ua = navigator.userAgent;
  const isWebkit = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);

  if (isWebkit || isFirefox) return false;

  const div = document.createElement("div");
  div.style.backdropFilter = "url(#glass-filter)";
  return div.style.backdropFilter !== "";
}

function generateDisplacementMap() {
  const rect = glassSurface.getBoundingClientRect();
  const actualWidth = rect.width || 400;
  const actualHeight = rect.height || 200;
  const edgeSize = Math.min(actualWidth, actualHeight) * (config.borderWidth * 0.5);

  const svgContent = `
        <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="red-grad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${config.borderRadius}" fill="url(#red-grad)" />
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${config.borderRadius}" fill="url(#blue-grad)" style="mix-blend-mode:${config.mixBlendMode}" />
          <rect
            x="${edgeSize}"
            y="${edgeSize}"
            width="${actualWidth - edgeSize * 2}"
            height="${actualHeight - edgeSize * 2}"
            rx="${config.borderRadius}"
            fill="hsl(0 0% ${config.brightness}% / ${config.opacity})"
            style="filter:blur(${config.blur}px)"
          />
        </svg>
      `;

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

function updateDisplacementMap() {
  feImage.setAttribute("href", generateDisplacementMap());
}

function applyFilterSettings() {
  updateDisplacementMap();

  [
    { el: redChannel, offset: config.redOffset },
    { el: greenChannel, offset: config.greenOffset },
    { el: blueChannel, offset: config.blueOffset }
  ].forEach(({ el, offset }) => {
    el.setAttribute("scale", (config.distortionScale + offset).toString());
    el.setAttribute("xChannelSelector", config.xChannel);
    el.setAttribute("yChannelSelector", config.yChannel);
  });

  gaussianBlur.setAttribute("stdDeviation", config.displace.toString());
}

function applyContainerStyles() {
  const dark = isDarkMode();
  const svgSupported = supportsSVGFilters();
  const backdropSupported = supportsBackdropFilter();

  glassSurface.style.width = config.width + "px";
  glassSurface.style.height = config.height + "px";
  glassSurface.style.borderRadius = config.borderRadius + "px";

  if (svgSupported) {
    glassSurface.style.background = dark
      ? `hsl(0 0% 0% / ${config.backgroundOpacity})`
      : `hsl(0 0% 100% / ${config.backgroundOpacity})`;

    glassSurface.style.backdropFilter = `url(#glass-filter) saturate(${config.saturation})`;
    glassSurface.style.webkitBackdropFilter = `url(#glass-filter) saturate(${config.saturation})`;

    glassSurface.style.boxShadow = dark
      ? `
            0 0 2px 1px rgba(255,255,255,0.2) inset,
            0 0 10px 4px rgba(255,255,255,0.08) inset,
            0px 4px 16px rgba(17,17,26,0.05),
            0px 8px 24px rgba(17,17,26,0.05),
            0px 16px 56px rgba(17,17,26,0.05)
          `
      : `
            0 0 2px 1px rgba(0,0,0,0.12) inset,
            0 0 10px 4px rgba(0,0,0,0.08) inset,
            0px 4px 16px rgba(17,17,26,0.05),
            0px 8px 24px rgba(17,17,26,0.05),
            0px 16px 56px rgba(17,17,26,0.05)
          `;
  } else {
    if (dark) {
      if (!backdropSupported) {
        glassSurface.style.background = "rgba(0,0,0,0.4)";
        glassSurface.style.border = "1px solid rgba(255,255,255,0.2)";
        glassSurface.style.boxShadow = `
              inset 0 1px 0 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 0 rgba(255,255,255,0.1)
            `;
      } else {
        glassSurface.style.background = "rgba(255,255,255,0.1)";
        glassSurface.style.backdropFilter = "blur(12px) saturate(1.8) brightness(1.2)";
        glassSurface.style.webkitBackdropFilter = "blur(12px) saturate(1.8) brightness(1.2)";
        glassSurface.style.border = "1px solid rgba(255,255,255,0.2)";
        glassSurface.style.boxShadow = `
              inset 0 1px 0 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 0 rgba(255,255,255,0.1)
            `;
      }
    } else {
      if (!backdropSupported) {
        glassSurface.style.background = "rgba(255,255,255,0.4)";
        glassSurface.style.border = "1px solid rgba(255,255,255,0.3)";
        glassSurface.style.boxShadow = `
              inset 0 1px 0 0 rgba(255,255,255,0.5),
              inset 0 -1px 0 0 rgba(255,255,255,0.3)
            `;
      } else {
        glassSurface.style.background = "rgba(255,255,255,0.25)";
        glassSurface.style.backdropFilter = "blur(12px) saturate(1.8) brightness(1.1)";
        glassSurface.style.webkitBackdropFilter = "blur(12px) saturate(1.8) brightness(1.1)";
        glassSurface.style.border = "1px solid rgba(255,255,255,0.3)";
        glassSurface.style.boxShadow = `
              0 8px 32px 0 rgba(31,38,135,0.2),
              0 2px 16px 0 rgba(31,38,135,0.1),
              inset 0 1px 0 0 rgba(255,255,255,0.4),
              inset 0 -1px 0 0 rgba(255,255,255,0.2)
            `;
      }
    }
  }
}

function initGlassSurface() {
  applyContainerStyles();
  applyFilterSettings();
}

const resizeObserver = new ResizeObserver(() => {
  setTimeout(() => {
    applyContainerStyles();
    updateDisplacementMap();
  }, 0);
});

resizeObserver.observe(glassSurface);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  initGlassSurface();
});

window.addEventListener("load", initGlassSurface);
window.addEventListener("resize", initGlassSurface);

const scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true
});