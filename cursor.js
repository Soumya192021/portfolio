const lineHorizontal = document.getElementById("lineHorizontal");
const lineVertical = document.getElementById("lineVertical");
const filterX = document.getElementById("filterX");
const filterY = document.getElementById("filterY");

const color = "white";

lineHorizontal.style.background = color;
lineVertical.style.background = color;

const lerp = (a, b, n) => (1 - n) * a + n * b;

let mouse = { x: 0, y: 0 };

const renderedStyles = {
    tx: { previous: 0, current: 0, amt: 0.15 },
    ty: { previous: 0, current: 0, amt: 0.15 }
};

const isDesktopWidth = () => {
    return window.innerWidth >= 768;
}

gsap.set([lineHorizontal, lineVertical], { opacity: 0 });

function handleMouseMove(ev) {
    if (!isDesktopWidth()) return;

    mouse = {
        x: ev.clientX,
        y: ev.clientY
    };
}

window.addEventListener("mousemove", handleMouseMove);

function firstMouseMove() {
    if (!isDesktopWidth()) return;
    renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x;
    renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y;

    gsap.to([lineHorizontal, lineVertical], {
        duration: 0.9,
        ease: "power3.out",
        opacity: 1
    });

    requestAnimationFrame(render);
    window.removeEventListener("mousemove", firstMouseMove);
}

window.addEventListener("mousemove", firstMouseMove);

const primitiveValues = { turbulence: 0 };

const tl = gsap.timeline({
    paused: true,
    onStart: () => {
        lineHorizontal.style.filter = "url(#filter-noise-x)";
        lineVertical.style.filter = "url(#filter-noise-y)";
    },
    onUpdate: () => {
        filterX.setAttribute("baseFrequency", primitiveValues.turbulence);
        filterY.setAttribute("baseFrequency", primitiveValues.turbulence);
    },
    onComplete: () => {
        lineHorizontal.style.filter = "none";
        lineVertical.style.filter = "none";
    }
});

tl.to(primitiveValues, {
    duration: 0.5,
    ease: "power1",
    startAt: { turbulence: 1 },
    turbulence: 0
});

function enter() {
    tl.restart();
}

function leave() {
    tl.progress(1).kill();
}

function render() {
    if (!isDesktopWidth()) return;
    renderedStyles.tx.current = mouse.x;
    renderedStyles.ty.current = mouse.y;

    for (const key in renderedStyles) {
        renderedStyles[key].previous = lerp(
            renderedStyles[key].previous,
            renderedStyles[key].current,
            renderedStyles[key].amt
        );
    }

    gsap.set(lineVertical, { x: renderedStyles.tx.previous });
    gsap.set(lineHorizontal, { y: renderedStyles.ty.previous });

    requestAnimationFrame(render);
}

const links = document.querySelectorAll("a");

links.forEach(link => {
    link.addEventListener("mouseenter", enter);
    link.addEventListener("mouseleave", leave);
});