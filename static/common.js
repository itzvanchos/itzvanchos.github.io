const themeAssets = {
    light: {
        themeIcon: "static/theme.png"
    },
    dark: {
        themeIcon: "static/dark-theme.png"
    }
};

const PUBLIC_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTEa81BMSgRUYsuECeyeZ8u-xMuS0G65CV_eMnAYm2mkFH1YVKNto6seC14nO3if9jwYaEqzGLaus02/pub?output=csv';

const navbarLogo = document.getElementById('navbarLogo');
const themeIcon = document.getElementById('themeIcon');
const favicon = document.getElementById('favicon');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');

let generalTheme;
let generalLanguage;

function getSavedTheme() {
    try {
        return localStorage.getItem('theme');
    } catch {
        return null;
    }
}

function getSavedLanguage() {
    try {
        return localStorage.getItem('language');
    } catch {
        return null;
    }
}

function getSystemTheme() {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
        return null;
    }
}

function getSystemLanguage() {
    try {
        return navigator.language.startsWith('ru') ? 'ru' : 'en';
    } catch {
        return null;
    }
}

function parseCSVRow(csvRow) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < csvRow.length; i++) {
        const char = csvRow[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result.map(value => value.replace(/^"|"$/g, ''));
}

async function loadLogoFromGoogleSheets() {
    const response = await fetch(PUBLIC_SHEETS_URL);
    const csvText = await response.text();
    const rows = csvText.trim().split('\n');

    const firstRow = parseCSVRow(rows[0]);
    themeAssets.light.logo = firstRow[0].trim();
    themeAssets.dark.logo = firstRow[1].trim();
}

function applyBodyTheme() {
    document.body.classList.toggle('dark-theme', generalTheme === 'dark');
    const assets = generalTheme === 'dark' ? themeAssets.dark : themeAssets.light;
    themeIcon.src = assets.themeIcon;
    themeIcon.alt = generalTheme === 'dark' ? "Light theme" : "Dark theme";
}

function applyLogoTheme() {
    const assets = generalTheme === 'dark' ? themeAssets.dark : themeAssets.light;
    if (assets.logo) {
        navbarLogo.src = assets.logo;
        favicon.href = assets.logo;
    }
}

function applyLanguage() {
    langToggle.textContent = generalLanguage === 'ru' ? "EN" : "РУ";
}

function loadSettings() {
    const savedTheme = getSavedTheme();
    const savedLanguage = getSavedLanguage();

    generalTheme = savedTheme === null ? (getSystemTheme() === 'dark' ? 'dark' : 'light') : savedTheme;
    generalLanguage = savedLanguage === null ? (getSystemLanguage() === 'ru' ? 'ru' : 'en') : savedLanguage;
}

function saveTheme() {
    try {
        localStorage.setItem('theme', generalTheme);
    } catch {}
}

function saveLanguage() {
    try {
        localStorage.setItem('language', generalLanguage);
    } catch {}
}

themeToggle.addEventListener('click', () => {
    generalTheme = generalTheme === 'light' ? 'dark' : 'light';
    applyBodyTheme();
    applyLogoTheme();
    saveTheme();
});

langToggle.addEventListener('click', () => {
    generalLanguage = generalLanguage === 'en' ? 'ru' : 'en';
    applyLanguage();
    saveLanguage();
});