// === CONFIGURACIÓN ===
const START_DATE = new Date(2025, 10, 5, 21, 52); 
const COLORS = ['#ff0054', '#ff5400', '#ffbd00', '#f72585', '#7209b7', '#b5179e', '#e01e37', '#d90429'];

// === 1. LÓGICA DEL CONTADOR ===
function updateTimer() {
    const now = new Date();
    const diff = now - START_DATE;

    if (diff < 0) {
        document.getElementById("love-timer").innerText = "La historia está por comenzar...";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("love-timer").innerText = 
        `Han pasado ${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos de amor.`;
}
setInterval(updateTimer, 1000);
updateTimer();

// === 2. LÓGICA DEL ÁRBOL ===
const treeContainer = document.getElementById('treeContainer');
const snoopy = document.getElementById('snoopy');

function getHeartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x, y };
}

function createTree() {
    const isMobile = window.innerWidth < 768;
    
    const totalHearts = isMobile ? 220 : 450; 
    const scaleBase = isMobile ? 9 : 13; // Un poco más grande para llenar huecos
    const trunkHeight = isMobile ? 130 : 160;
    const trunkBottom = isMobile ? 30 : 40;
    
    const fragment = document.createDocumentFragment();
    const heartsArray = [];

    for (let i = 0; i < totalHearts; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];

        let t = Math.random() * Math.PI * 2;
        let r = Math.sqrt(Math.random());
        
        // Más relleno en el centro
        if (Math.random() < 0.15) r = 1; 
        else r = r * 0.9 + 0.1;

        const point = getHeartPoint(t);

        let finalX = point.x * scaleBase * r + (Math.random() - 0.5) * 10;
        let finalY = point.y * scaleBase * r + (Math.random() - 0.5) * 10;

        // Normalizar altura del corazón (offset)
        const yOffset = -(-17 * scaleBase); 

        heart.style.left = `calc(50% + ${finalX}px)`;
        
        // === AJUSTE DE ALTURA ===
        // Subimos el follaje 15px extra para que no tape el tronco arriba
        heart.style.bottom = `${trunkBottom + trunkHeight + finalY + yOffset - 15}px`;

        const size = 0.5 + Math.random() * 0.8;
        heart.style.setProperty('--scale', size);
        
        fragment.appendChild(heart);
        heartsArray.push({ element: heart, size: size, index: i });
    }

    treeContainer.appendChild(fragment);

    // === 3. ANIMACIÓN ===
    const delayMultiplier = 3; // Un poco más rápido

    heartsArray.forEach((item) => {
        setTimeout(() => {
            item.element.classList.add('placed');
            item.element.style.transform = `scale(${item.size}) rotate(45deg)`;
            setTimeout(() => {
                item.element.style.animation = `pulse ${1.5 + Math.random()}s infinite alternate`;
            }, 500);
        }, item.index * delayMultiplier);
    });

    // Snoopy aparece al final
    const totalTime = totalHearts * delayMultiplier + 600;
    setTimeout(() => {
        snoopy.classList.add('visible');
    }, totalTime);
}

window.onload = createTree;