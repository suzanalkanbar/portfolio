const canvas = document.getElementById("bgCanvas");


// Shrink navbar on scroll
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const navbar = document.getElementById("navbar");
if (navbar) {
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
}
document.querySelectorAll('.dropdown > .dropdown-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const parent = btn.closest('.dropdown');
    parent.classList.toggle('open');
    // aria voor screenreaders
    const expanded = parent.classList.contains('open');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
});

// cv download

// document.addEventListener("DOMContentLoaded", () => {
//     const cvButton = document.getElementById("downloadCV");
//     if (cvButton) {
//         cvButton.addEventListener("click", function (e) {
//             e.preventDefault();
//             const confirmDownload = confirm("Wil je mijn CV (PDF) downloaden?");
//             if (confirmDownload) {
//                 const link = document.createElement("a");
//                 link.href = "/CV.pdf";   // jouw bestand in de rootmap
//                 link.download = "Suzan_Alkanbar_CV.pdf"; // naam bij het downloaden
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             }
//         });
//     }
// });

const sections = document.querySelectorAll(".case-section, .cover");
const navLinks = document.querySelectorAll(".sidebar-timeline a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});


// Simple slider
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelector(".slides");
    const images = document.querySelectorAll(".slides img");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    let index = 0;

    function showSlide(i) {
        if (i >= images.length) index = 0;
        if (i < 0) index = images.length - 1;
        slides.style.transform = `translateX(${-index * 100}%)`;
    }

    next.addEventListener("click", () => {
        index++;
        showSlide(index);
    });

    prev.addEventListener("click", () => {
        index--;
        showSlide(index);
    });
});


// const canvas = document.getElementById("bgCanvas");



document.addEventListener("DOMContentLoaded", () => {
    const theCanvas = document.getElementById('myCanvas')
    if (!theCanvas) return
    const theContext = theCanvas.getContext('2d')

    function canvasX(numChildren) { return 30 + numChildren * 100 }
    function canvasY(age) { return 510 - age * 5 }

    function drawDisc(ctx, x, y, radius, color) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2, false)
        ctx.fillStyle = color
        ctx.fill()
        ctx.lineWidth = 0;
        ctx.stroke()
    }

    function bubbleRadiusForPopulation(population) {
        return (0.56419 * Math.sqrt(population)) / 500
    }

    function regionColor(region) {
        if (region === "africa") return "rgb(0, 213, 233)"
        if (region === "americas") return "rgb(255, 88, 114)"
        if (region === "asia") return "rgb(127, 235, 0)"
        if (region === "europe") return "rgb(255, 231, 0)"
        return "lightgrey"
    }

    function drawCountry(country, year) {
        let i = year - 1800
        let x = canvasX(country.birthsPerWoman[i])
        let y = canvasY(country.lifeExpectancy[i])
        let r = bubbleRadiusForPopulation(country.population[i])
        let color = regionColor(country.region, country.country)
        drawDisc(theContext, x, y, r, color)
    }

    function drawAxes() {
        theContext.font = "normal 10px sans-serif"
        theContext.fillStyle = "black"
        theContext.beginPath()
        theContext.moveTo(canvasX(0), canvasY(0))
        theContext.lineTo(canvasX(9), canvasY(0))
        theContext.strokeStyle = "black"
        theContext.stroke()
        for (let children = 0; children <= 9; children++) {
            let x = canvasX(children)
            theContext.beginPath()
            theContext.moveTo(x, canvasY(0))
            theContext.lineTo(x, canvasY(100))
            theContext.strokeStyle = "#ccc"
            theContext.stroke()
            theContext.fillText(children, x - 3, canvasY(0) + 15)
        }
        theContext.beginPath()
        theContext.moveTo(canvasX(0), canvasY(0))
        theContext.lineTo(canvasX(0), canvasY(100))
        theContext.strokeStyle = "black"
        theContext.stroke()
        for (let age = 0; age <= 100; age += 10) {
            let y = canvasY(age)
            theContext.beginPath()
            theContext.moveTo(canvasX(0), y)
            theContext.lineTo(canvasX(9), y)
            theContext.strokeStyle = "#ccc"
            theContext.stroke()
            theContext.fillText(age, canvasX(0) - 25, y + 3)
        }
    }

    function drawYear(year) {
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height)
        drawAxes()
        for (let c of countryData) {
            drawCountry(c, year)
        }
        theContext.font = "bold 150px sans-serif"
        theContext.fillStyle = "rgba(200,200,200,0.25)"
        theContext.textAlign = "center"
        theContext.textBaseline = "middle"
        theContext.fillText(year, theCanvas.width / 2, theCanvas.height / 2)
    }

    let currentYear = 1800
    let timerId = null

    function doYearStep() {
        if (currentYear > 2018) {
            clearInterval(timerId)
            timerId = null
            return
        }
        drawYear(currentYear)
        currentYear += 1
    }

    window.startAnimation = function () {
        if (!timerId) timerId = setInterval(doYearStep, 100)
    }

    window.pauseAnimation = function () {
        clearInterval(timerId)
        timerId = null
    }

    window.restartAnimation = function () {
        window.pauseAnimation()
        currentYear = 1800
        window.startAnimation()
    }


    drawYear(currentYear)
    startAnimation()
})


const cards = document.querySelectorAll('.category-card');

function showOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            card.classList.add('show');   // kaart zichtbaar maken
        }
    });
}

window.addEventListener('scroll', showOnScroll);
showOnScroll(); // meteen uitvoeren bij laden


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    function resizeCanvas() {
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
        "rgba(185,124,94,0.25)",   // terracotta
        "rgba(31,63,76,0.25)",     // deep teal-blue (#1F3F4C)
        "rgba(200,180,120,0.25)"   // sand
    ];
    const bgColor = "#fef7ee";

    function drawHexagon(x, y, size, color) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            let angle = (Math.PI / 3) * i;
            let px = x + size * Math.cos(angle);
            let py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawPattern(offsetX = 0, offsetY = 0, scale = 1, color = "rgba(0,0,0,0.15)") {
        // Vul achtergrond volledig (iets groter dan canvas om randen te maskeren)
        ctx.fillStyle = bgColor;
        ctx.fillRect(-5, -5, canvas.width + 10, canvas.height + 10);

        // Clip alle tekening binnen het canvas zodat niets buiten zichtbaar is
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.clip();

        const size = 40 * scale;
        const dx = size * Math.sqrt(3);
        const dy = size * 1.5;

        for (let row = -1; row < canvas.height / dy + 2; row++) {
            for (let col = -1; col < canvas.width / dx + 2; col++) {
                let x = col * dx + ((row % 2) * dx) / 2 + offsetX;
                let y = row * dy + offsetY;
                drawHexagon(x, y, size, color);
            }
        }

        ctx.restore();
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // floating movement
        let offsetX = Math.sin(t * 0.001) * 20;
        let offsetY = Math.cos(t * 0.001) * 20;

        // breathing zoom
        let scale = 1 + Math.sin(t * 0.002) * 0.05;

        let color = "rgba(185,124,94,0.25)"; // kies hier je vaste kleur


        drawPattern(offsetX, offsetY, scale, color);

        t++;
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
);
