const levels = [
    { theme: "Gamme & Sodas Choucoune", words: ["CHOUCOUNE", "KOLA", "BANANE", "LIMONADE", "CHAMPAGNE", "CANNE", "SUCRE", "FRAIS", "SAVEUR", "HAITI"] },
    { theme: "Jus & Nectars Tropicaux", words: ["COROSSOL", "GUAYAVA", "PASSION", "ANANAS", "MANGUE", "CITRON", "ORANGE", "PAPAYE", "NECTAR", "JUS"] },
    { theme: "Ingrédients du Terroir", words: ["AKASAN", "GINGEMBRE", "ALOE", "VERA", "COCO", "VANILLE", "MENTHE", "SIROP", "PULPE", "EAU"] },
    { theme: "Épices & Assaisonnements", words: ["EPICES", "PIMENT", "AIL", "OIGNON", "PERSIL", "POIVRE", "THYM", "CLOU", "SAUCE", "GOUT"] },
    { theme: "Plaisir & Rafraîchissement", words: ["GLACON", "BOISSON", "SOIF", "PAUSE", "GOUTER", "ENERGY", "CANETTE", "VERRE", "FRAIS", "PETILLE"] },
    { theme: "Plantes & Récoltes", words: ["VERGER", "JARDIN", "RECOLTE", "TERROIR", "CHAMPS", "NATUREL", "BIO", "PAYSAN", "LAKOU", "FERME"] },
    { theme: "Culture & Fêtes", words: ["CARNAVAL", "AMBIANCE", "KONPA", "FETE", "SOLEIL", "PLAGE", "PARTAGE", "FAMILLE", "AMIS", "PLAISIR"] },
    { theme: "Spécialités Gourmandes", words: ["DOUCE", "KASAV", "TABLETTE", "CONFITURE", "MIEL", "CACAO", "CHOCOLAT", "CREME", "BEURRE", "PAIN"] },
    { theme: "Fraîcheur des Îles", words: ["TROPICAL", "CARAIBES", "SUD", "NORD", "ANTILLES", "CHALEUR", "COCOTIER", "BRISE", "MER", "ESCALE"] },
    { theme: "Fierté & Tradition", words: ["MARQUE", "QUALITE", "TRADITION", "PRESTIGE", "FIERTE", "LOCAL", "ORIGINE", "EXCELLENT", "SUCCES", "PUR"] },
    { theme: "Riz & Céréales Choucoune", words: ["RIZ", "GRAIN", "BLANC", "HARICOT", "POIS", "MAIS", "FARINE", "SEMOULE", "CEREALE", "DORE"] },
    { theme: "Beurre & Laiterie Choucoune", words: ["BEURRE", "LAIT", "CREME", "MARGARINE", "DART", "TARTINE", "ONCTUEUX", "LAITIER", "BOITE", "FRAIS"] },
    { theme: "Condiments & Huiles", words: ["HUILE", "FRITURE", "VINAIGRE", "MOUTARDE", "KETCHUP", "EPICE", "SEL", "CUBE", "AIL", "PIMENT"] },
    { theme: "Pâtes & Féculents", words: ["SPAGHETTI", "MACARONI", "PATES", "MANIOC", "PATATE", "YAM", "BANANE", "RIZ", "MAIS", "FEE"] },
    { theme: "Déjeuner & Matinée", words: ["CAFE", "CHOCOLAT", "LAIT", "PAIN", "BEURRE", "CONFITURE", "OEUF", "OMELETTE", "JUS", "SUCRE"] },
    { theme: "Cuisine Traditionnelle Haïtienne", words: ["GRIOT", "BANANE", "PIKLIZ", "DIRIS", "LALO", "SOUP", "JUMU", "TASSOT", "BOUILLON", "PULPE"] },
    { theme: "Emballages & Rayons", words: ["SACHET", "BOITE", "FLACON", "EMBALLAGE", "RAYON", "MARCHE", "PANIER", "ACHAT", "PRIX", "STOCK"] },
    { theme: "Goûters & Snacks", words: ["BISCUIT", "BONBON", "SNACK", "CHIPS", "CRAQUELIN", "GAUFRE", "GALETTE", "FRUIT", "CROQUANT", "DOUX"] },
    { theme: "Énergie & Vitalité", words: ["VITALITE", "FORCE", "ENERGIE", "FORTE", "PROTEINE", "NUTRITION", "FORME", "SANTE", "TONIC", "VITAMINE"] },
    { theme: "La Table Haïtienne", words: ["REPAS", "TABLE", "ASSIETTE", "CONVIVIAL", "DINER", "DEJEUNER", "CUISINE", "CHEF", "FESTIN", "GOUT"] }
];

let currentLevelIndex = 0;
let gridMatrix = [];
let selectedCells = [];
let isSelecting = false;
let startCell = null;

const selectLevel = document.getElementById("select-level");
const levelTitle = document.getElementById("level-title");
const gridContainer = document.getElementById("grid-container");
const wordsList = document.getElementById("words-list");
const themeToggleBtn = document.getElementById("theme-toggle");

// --- GESTION DU MODE CLAIR / SOMBRE ---
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.classList.toggle("dark-mode", prefersDark);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }
}

// --- INITIALISATION DU JEU ---
function initGame() {
    initTheme();

    levels.forEach((lvl, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = `${idx + 1}. ${lvl.theme}`;
        selectLevel.appendChild(option);
    });

    selectLevel.addEventListener("change", (e) => {
        currentLevelIndex = parseInt(e.target.value);
        loadLevel(currentLevelIndex);
    });

    loadLevel(0);
}

function loadLevel(index) {
    const level = levels[index];
    levelTitle.textContent = `CHOUCOUNE - ${level.theme}`;
    
    wordsList.innerHTML = "";
    level.words.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        li.id = `word-${word}`;
        wordsList.appendChild(li);
    });

    generateGrid(level.words);
}

function generateGrid(words) {
    let allPlaced = false;
    let globalAttempts = 0;
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    while (!allPlaced && globalAttempts < 100) {
        globalAttempts++;
        gridMatrix = Array(10).fill(null).map(() => Array(10).fill(''));
        let placedCount = 0;

        for (let word of sortedWords) {
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 300) {
                attempts++;
                const dir = Math.floor(Math.random() * 3); // 0: Horizontale, 1: Verticale, 2: Diagonale
                
                let rowMax = 10, colMax = 10;
                if (dir === 1 || dir === 2) rowMax = 10 - word.length + 1;
                if (dir === 0 || dir === 2) colMax = 10 - word.length + 1;

                if (rowMax <= 0 || colMax <= 0) continue;

                const row = Math.floor(Math.random() * rowMax);
                const col = Math.floor(Math.random() * colMax);

                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    const r = row + (dir === 1 || dir === 2 ? i : 0);
                    const c = col + (dir === 0 || dir === 2 ? i : 0);
                    if (gridMatrix[r][c] !== '' && gridMatrix[r][c] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        const r = row + (dir === 1 || dir === 2 ? i : 0);
                        const c = col + (dir === 0 || dir === 2 ? i : 0);
                        gridMatrix[r][c] = word[i];
                    }
                    placed = true;
                    placedCount++;
                }
            }
        }

        if (placedCount === sortedWords.length) {
            allPlaced = true;
        }
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (gridMatrix[r][c] === '') {
                gridMatrix[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    renderGrid();
}

function renderGrid() {
    gridContainer.innerHTML = "";
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = gridMatrix[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("mousedown", startSelection);
            cell.addEventListener("mouseenter", continueSelection);
            cell.addEventListener("mouseup", endSelection);

            cell.addEventListener("touchstart", handleTouchStart, { passive: false });
            cell.addEventListener("touchmove", handleTouchMove, { passive: false });
            cell.addEventListener("touchend", endSelection);

            gridContainer.appendChild(cell);
        }
    }
}

function getLineCells(r1, c1, r2, c2) {
    const dr = r2 - r1;
    const dc = c2 - c1;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    if (steps === 0) return [getCellElement(r1, c1)];

    const stepR = dr === 0 ? 0 : dr / steps;
    const stepC = dc === 0 ? 0 : dc / steps;

    if (stepR !== 0 && stepC !== 0 && Math.abs(dr) !== Math.abs(dc)) {
        return [];
    }

    const line = [];
    for (let i = 0; i <= steps; i++) {
        const r = Math.round(r1 + i * stepR);
        const c = Math.round(c1 + i * stepC);
        line.push(getCellElement(r, c));
    }
    return line;
}

function getCellElement(r, c) {
    return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

function clearSelectionHighlight() {
    document.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
}

function startSelection(e) {
    isSelecting = true;
    startCell = e.target;
    selectedCells = [startCell];
    startCell.classList.add("selected");
}

function continueSelection(e) {
    if (!isSelecting || !startCell) return;
    const currentCell = e.target;
    if (!currentCell.classList.contains("cell")) return;

    const r1 = parseInt(startCell.dataset.row);
    const c1 = parseInt(startCell.dataset.col);
    const r2 = parseInt(currentCell.dataset.row);
    const c2 = parseInt(currentCell.dataset.col);

    const line = getLineCells(r1, c1, r2, c2);
    if (line.length > 0) {
        clearSelectionHighlight();
        selectedCells = line;
        selectedCells.forEach(c => c.classList.add("selected"));
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    isSelecting = true;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.classList.contains("cell")) {
        startCell = elem;
        selectedCells = [startCell];
        startCell.classList.add("selected");
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isSelecting || !startCell) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.classList.contains("cell")) {
        const r1 = parseInt(startCell.dataset.row);
        const c1 = parseInt(startCell.dataset.col);
        const r2 = parseInt(elem.dataset.row);
        const c2 = parseInt(elem.dataset.col);

        const line = getLineCells(r1, c1, r2, c2);
        if (line.length > 0) {
            clearSelectionHighlight();
            selectedCells = line;
            selectedCells.forEach(c => c.classList.add("selected"));
        }
    }
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    const selectedWord = selectedCells.map(c => c ? c.textContent : "").join("");
    const reversedWord = selectedWord.split("").reverse().join("");
    const levelWords = levels[currentLevelIndex].words;

    let foundWord = null;
    if (levelWords.includes(selectedWord)) foundWord = selectedWord;
    else if (levelWords.includes(reversedWord)) foundWord = reversedWord;

    if (foundWord) {
        selectedCells.forEach(c => {
            if (c) {
                c.classList.remove("selected");
                c.classList.add("found");
            }
        });
        const wordElem = document.getElementById(`word-${foundWord}`);
        if (wordElem) wordElem.classList.add("found-word");
    } else {
        clearSelectionHighlight();
    }
    selectedCells = [];
    startCell = null;
}

window.onload = initGame;