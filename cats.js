// ==========================================
// CATÁLOGO DE GATITOS PIXEL ART
// ==========================================

const CAT_CATALOG = [
    {
        id: 'pink_basic',
        name: 'Gatito Rosa',
        unlockLevel: 1,
        description: 'El clásico gatito rosa',
        svg: `
            <rect x="4" y="8" width="8" height="6" fill="#ffb8dd"/>
            <rect x="3" y="4" width="10" height="6" fill="#ffb8dd"/>
            <rect x="3" y="2" width="2" height="3" fill="#ffb8dd"/>
            <rect x="11" y="2" width="2" height="3" fill="#ffb8dd"/>
            <rect x="4" y="3" width="1" height="1" fill="#ff8fca"/>
            <rect x="11" y="3" width="1" height="1" fill="#ff8fca"/>
            <rect x="5" y="5" width="2" height="2" fill="#6b2d4d"/>
            <rect x="9" y="5" width="2" height="2" fill="#6b2d4d"/>
            <rect x="5" y="5" width="1" height="1" fill="white"/>
            <rect x="9" y="5" width="1" height="1" fill="white"/>
            <rect x="7" y="7" width="2" height="1" fill="#d65c9a"/>
            <rect x="6" y="8" width="1" height="1" fill="#d65c9a"/>
            <rect x="9" y="8" width="1" height="1" fill="#d65c9a"/>
            <rect x="4" y="7" width="1" height="1" fill="#ff8fca"/>
            <rect x="11" y="7" width="1" height="1" fill="#ff8fca"/>
            <rect x="4" y="13" width="2" height="1" fill="#ffb8dd"/>
            <rect x="10" y="13" width="2" height="1" fill="#ffb8dd"/>
            <rect x="12" y="10" width="3" height="2" fill="#ffb8dd"/>
            <rect x="14" y="8" width="1" height="2" fill="#ffb8dd"/>
        `
    },
    {
        id: 'orange_cat',
        name: 'Gatito Naranja',
        unlockLevel: 2,
        description: 'Desbloqueable al nivel 2',
        svg: `
            <rect x="4" y="8" width="8" height="6" fill="#ffb366"/>
            <rect x="3" y="4" width="10" height="6" fill="#ffb366"/>
            <rect x="3" y="2" width="2" height="3" fill="#ffb366"/>
            <rect x="11" y="2" width="2" height="3" fill="#ffb366"/>
            <rect x="4" y="3" width="1" height="1" fill="#ff9933"/>
            <rect x="11" y="3" width="1" height="1" fill="#ff9933"/>
            <rect x="5" y="5" width="2" height="2" fill="#2d1a00"/>
            <rect x="9" y="5" width="2" height="2" fill="#2d1a00"/>
            <rect x="5" y="5" width="1" height="1" fill="white"/>
            <rect x="9" y="5" width="1" height="1" fill="white"/>
            <rect x="7" y="7" width="2" height="1" fill="#ff6600"/>
            <rect x="6" y="8" width="1" height="1" fill="#ff6600"/>
            <rect x="9" y="8" width="1" height="1" fill="#ff6600"/>
            <rect x="4" y="7" width="1" height="1" fill="#ff9933"/>
            <rect x="11" y="7" width="1" height="1" fill="#ff9933"/>
            <rect x="4" y="13" width="2" height="1" fill="#ffb366"/>
            <rect x="10" y="13" width="2" height="1" fill="#ffb366"/>
            <rect x="12" y="10" width="3" height="2" fill="#ffb366"/>
            <rect x="14" y="8" width="1" height="2" fill="#ffb366"/>
        `
    },
    {
        id: 'white_cat',
        name: 'Gatito Blanco',
        unlockLevel: 3,
        description: 'Desbloqueable al nivel 3',
        svg: `
            <rect x="4" y="8" width="8" height="6" fill="#ffffff"/>
            <rect x="3" y="4" width="10" height="6" fill="#ffffff"/>
            <rect x="3" y="2" width="2" height="3" fill="#ffffff"/>
            <rect x="11" y="2" width="2" height="3" fill="#ffffff"/>
            <rect x="4" y="3" width="1" height="1" fill="#ffe4f0"/>
            <rect x="11" y="3" width="1" height="1" fill="#ffe4f0"/>
            <rect x="5" y="5" width="2" height="2" fill="#6b2d4d"/>
            <rect x="9" y="5" width="2" height="2" fill="#6b2d4d"/>
            <rect x="5" y="5" width="1" height="1" fill="white"/>
            <rect x="9" y="5" width="1" height="1" fill="white"/>
            <rect x="7" y="7" width="2" height="1" fill="#ff8fca"/>
            <rect x="6" y="8" width="1" height="1" fill="#ff8fca"/>
            <rect x="9" y="8" width="1" height="1" fill="#ff8fca"/>
            <rect x="4" y="7" width="1" height="1" fill="#ffe4f0"/>
            <rect x="11" y="7" width="1" height="1" fill="#ffe4f0"/>
            <rect x="4" y="13" width="2" height="1" fill="#ffffff"/>
            <rect x="10" y="13" width="2" height="1" fill="#ffffff"/>
            <rect x="12" y="10" width="3" height="2" fill="#ffffff"/>
            <rect x="14" y="8" width="1" height="2" fill="#ffffff"/>
        `
    },
    {
        id: 'black_cat',
        name: 'Gatito Negro',
        unlockLevel: 4,
        description: 'Desbloqueable al nivel 4',
        svg: `
            <rect x="4" y="8" width="8" height="6" fill="#4a4a4a"/>
            <rect x="3" y="4" width="10" height="6" fill="#4a4a4a"/>
            <rect x="3" y="2" width="2" height="3" fill="#4a4a4a"/>
            <rect x="11" y="2" width="2" height="3" fill="#4a4a4a"/>
            <rect x="4" y="3" width="1" height="1" fill="#2d2d2d"/>
            <rect x="11" y="3" width="1" height="1" fill="#2d2d2d"/>
            <rect x="5" y="5" width="2" height="2" fill="#00ff00"/>
            <rect x="9" y="5" width="2" height="2" fill="#00ff00"/>
            <rect x="5" y="5" width="1" height="1" fill="white"/>
            <rect x="9" y="5" width="1" height="1" fill="white"/>
            <rect x="7" y="7" width="2" height="1" fill="#333333"/>
            <rect x="6" y="8" width="1" height="1" fill="#333333"/>
            <rect x="9" y="8" width="1" height="1" fill="#333333"/>
            <rect x="4" y="7" width="1" height="1" fill="#2d2d2d"/>
            <rect x="11" y="7" width="1" height="1" fill="#2d2d2d"/>
            <rect x="4" y="13" width="2" height="1" fill="#4a4a4a"/>
            <rect x="10" y="13" width="2" height="1" fill="#4a4a4a"/>
            <rect x="12" y="10" width="3" height="2" fill="#4a4a4a"/>
            <rect x="14" y="8" width="1" height="2" fill="#4a4a4a"/>
        `
    },
    {
        id: 'purple_cat',
        name: 'Gatito Morado',
        unlockLevel: 5,
        description: 'Desbloqueable al nivel 5',
        svg: `
            <rect x="4" y="8" width="8" height="6" fill="#d4a5ff"/>
            <rect x="3" y="4" width="10" height="6" fill="#d4a5ff"/>
            <rect x="3" y="2" width="2" height="3" fill="#d4a5ff"/>
            <rect x="11" y="2" width="2" height="3" fill="#d4a5ff"/>
            <rect x="4" y="3" width="1" height="1" fill="#b17dff"/>
            <rect x="11" y="3" width="1" height="1" fill="#b17dff"/>
            <rect x="5" y="5" width="2" height="2" fill="#5a2d82"/>
            <rect x="9" y="5" width="2" height="2" fill="#5a2d82"/>
            <rect x="5" y="5" width="1" height="1" fill="white"/>
            <rect x="9" y="5" width="1" height="1" fill="white"/>
            <rect x="7" y="7" width="2" height="1" fill="#9d5cff"/>
            <rect x="6" y="8" width="1" height="1" fill="#9d5cff"/>
            <rect x="9" y="8" width="1" height="1" fill="#9d5cff"/>
            <rect x="4" y="7" width="1" height="1" fill="#b17dff"/>
            <rect x="11" y="7" width="1" height="1" fill="#b17dff"/>
            <rect x="4" y="13" width="2" height="1" fill="#d4a5ff"/>
            <rect x="10" y="13" width="2" height="1" fill="#d4a5ff"/>
            <rect x="12" y="10" width="3" height="2" fill="#d4a5ff"/>
            <rect x="14" y="8" width="1" height="2" fill="#d4a5ff"/>
        `
    },
    {
        id: 'blue_cat',
        name: 'Gatito Azul',
        unlockLevel: 7,
        description: 'Desbloqueable al nivel 7',
        svg: `
            <rect x="4" y="8" width="8" height="6" fill="#a5d4ff"/>
            <rect x="3" y="4" width="10" height="6" fill="#a5d4ff"/>
            <rect x="3" y="2" width="2" height="3" fill="#a5d4ff"/>
            <rect x="11" y="2" width="2" height="3" fill="#a5d4ff"/>
            <rect x="4" y="3" width="1" height="1" fill="#7db1ff"/>
            <rect x="11" y="3" width="1" height="1" fill="#7db1ff"/>
            <rect x="5" y="5" width="2" height="2" fill="#2d5a82"/>
            <rect x="9" y="5" width="2" height="2" fill="#2d5a82"/>
            <rect x="5" y="5" width="1" height="1" fill="white"/>
            <rect x="9" y="5" width="1" height="1" fill="white"/>
            <rect x="7" y="7" width="2" height="1" fill="#5c9dff"/>
            <rect x="6" y="8" width="1" height="1" fill="#5c9dff"/>
            <rect x="9" y="8" width="1" height="1" fill="#5c9dff"/>
            <rect x="4" y="7" width="1" height="1" fill="#7db1ff"/>
            <rect x="11" y="7" width="1" height="1" fill="#7db1ff"/>
            <rect x="4" y="13" width="2" height="1" fill="#a5d4ff"/>
            <rect x="10" y="13" width="2" height="1" fill="#a5d4ff"/>
            <rect x="12" y="10" width="3" height="2" fill="#a5d4ff"/>
            <rect x="14" y="8" width="1" height="2" fill="#a5d4ff"/>
        `
    },
    {
        id: 'rainbow_cat',
        name: 'Gatito Arcoíris',
        unlockLevel: 10,
        description: 'Gatito legendario - Nivel 10',
        svg: `
            <rect x="4" y="8" width="2" height="6" fill="#ff6b6b"/>
            <rect x="6" y="8" width="2" height="6" fill="#ffd93d"/>
            <rect x="8" y="8" width="2" height="6" fill="#6bcf7f"/>
            <rect x="10" y="8" width="2" height="6" fill="#6b9cff"/>
            <rect x="3" y="4" width="2" height="6" fill="#ff6b6b"/>
            <rect x="5" y="4" width="2" height="6" fill="#ffd93d"/>
            <rect x="7" y="4" width="2" height="6" fill="#6bcf7f"/>
            <rect x="9" y="4" width="2" height="6" fill="#6b9cff"/>
            <rect x="11" y="4" width="2" height="6" fill="#d46bff"/>
            <rect x="3" y="2" width="2" height="3" fill="#ff6b6b"/>
            <rect x="11" y="2" width="2" height="3" fill="#d46bff"/>
            <rect x="5" y="5" width="2" height="2" fill="#ffffff"/>
            <rect x="9" y="5" width="2" height="2" fill="#ffffff"/>
            <rect x="5" y="6" width="1" height="1" fill="#6b2d4d"/>
            <rect x="9" y="6" width="1" height="1" fill="#6b2d4d"/>
            <rect x="7" y="7" width="2" height="1" fill="#ff1493"/>
            <rect x="6" y="8" width="1" height="1" fill="#ff1493"/>
            <rect x="9" y="8" width="1" height="1" fill="#ff1493"/>
            <rect x="4" y="13" width="2" height="1" fill="#ff6b6b"/>
            <rect x="10" y="13" width="2" height="1" fill="#6b9cff"/>
            <rect x="12" y="10" width="3" height="2" fill="#d46bff"/>
            <rect x="14" y="8" width="1" height="2" fill="#d46bff"/>
        `
    }
];

// ==========================================
// CAT SELECTOR MANAGER
// ==========================================

class CatSelector {
    constructor() {
        this.selectedCat = 'pink_basic';
        this.loadSelectedCat();
    }

    loadSelectedCat() {
        const saved = localStorage.getItem('selectedCat');
        if (saved) {
            this.selectedCat = saved;
        }
    }

    saveSelectedCat(catId) {
        this.selectedCat = catId;
        localStorage.setItem('selectedCat', catId);
    }

    getCurrentCat() {
        return CAT_CATALOG.find(cat => cat.id === this.selectedCat) || CAT_CATALOG[0];
    }

    getUnlockedCats(currentLevel) {
        return CAT_CATALOG.filter(cat => cat.unlockLevel <= currentLevel);
    }

    selectCat(catId, currentLevel) {
        const cat = CAT_CATALOG.find(c => c.id === catId);

        if (!cat) {
            return { success: false, message: 'Gatito no encontrado' };
        }

        if (cat.unlockLevel > currentLevel) {
            return {
                success: false,
                message: `Necesitas nivel ${cat.unlockLevel} para desbloquear este gatito`
            };
        }

        this.saveSelectedCat(catId);
        this.updateMainCat();

        return { success: true, message: `${cat.name} seleccionado` };
    }

    updateMainCat() {
        const cat = this.getCurrentCat();
        const catSvg = document.querySelector('.pixel-cat svg');

        if (catSvg) {
            catSvg.innerHTML = cat.svg;
        }
    }

    renderCatGallery(containerEl, currentLevel) {
        if (!containerEl) return;

        containerEl.innerHTML = '';

        CAT_CATALOG.forEach(cat => {
            const isUnlocked = cat.unlockLevel <= currentLevel;
            const isSelected = cat.id === this.selectedCat;

            const card = document.createElement('div');
            card.className = `cat-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`;

            card.innerHTML = `
                <div class="cat-preview">
                    <svg viewBox="0 0 16 16" fill="none">
                        ${isUnlocked ? cat.svg : this.getLockedSvg()}
                    </svg>
                </div>
                <div class="cat-info">
                    <div class="cat-name">${cat.name}</div>
                    <div class="cat-desc">${cat.description}</div>
                    ${isUnlocked ?
                        `<button class="pixel-btn tiny ${isSelected ? 'active' : ''}" data-cat-id="${cat.id}">
                            ${isSelected ? 'Seleccionado' : 'Seleccionar'}
                        </button>` :
                        `<div class="locked-badge">🔒 Nivel ${cat.unlockLevel}</div>`
                    }
                </div>
            `;

            if (isUnlocked && !isSelected) {
                const btn = card.querySelector('button');
                btn.addEventListener('click', () => {
                    const result = this.selectCat(cat.id, currentLevel);
                    if (result.success && window.app) {
                        window.app.renderCatGallery();
                    }
                });
            }

            containerEl.appendChild(card);
        });
    }

    getLockedSvg() {
        return `
            <rect x="4" y="8" width="8" height="6" fill="#cccccc"/>
            <rect x="3" y="4" width="10" height="6" fill="#cccccc"/>
            <rect x="3" y="2" width="2" height="3" fill="#cccccc"/>
            <rect x="11" y="2" width="2" height="3" fill="#cccccc"/>
            <text x="8" y="10" font-size="8" text-anchor="middle" fill="#666">?</text>
        `;
    }
}

// Instancia global
const catSelector = new CatSelector();
