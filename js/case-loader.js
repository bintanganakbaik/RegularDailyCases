const CASE_PATH = '../cases/case-001.json';

let currentCase = null;

async function loadCase() {
    try {
        const response = await fetch(CASE_PATH);

        if (!response.ok) {
            throw new Error(`Failed to load case: ${response.status}`);
        }

        const caseData = await response.json();

        currentCase = caseData;

        return caseData;
    } catch (error) {
        console.error('Case loading error:', error);

        return null;
    }
}

function getCurrentCase() {
    return currentCase;
}

window.caseLoader = {
    loadCase,
    getCurrentCase
};