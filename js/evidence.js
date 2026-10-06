
document.addEventListener('DOMContentLoaded', async function () {

    const evidenceList = document.getElementById('evidence-list');
    const evidenceDetail = document.getElementById('evidence-detail');
    const caseTitle = document.getElementById('case-title');

    if (!evidenceList || !evidenceDetail) {
        return;
    }

    try {

        const response = await fetch('../cases/case-001.json');

        if (!response.ok) {
            throw new Error('Unable to load case data.');
        }

        const caseData = await response.json();

        if (caseTitle) {
            caseTitle.textContent = caseData.title;
        }

        renderEvidence(
            caseData.evidence,
            evidenceList,
            evidenceDetail
        );

    } catch (error) {

        console.error(error);

        evidenceList.innerHTML = `
            <article class="paper-card">
                <h3>Unable to Load Evidence</h3>
                <p>
                    The case data could not be loaded.
                </p>
            </article>
        `;
    }
});


function renderEvidence(
    evidenceData,
    container,
    detailContainer
) {

    container.innerHTML = '';

    evidenceData.forEach(function (evidence) {

        const card = document.createElement('article');

        card.className = 'paper-card evidence-card';

        card.innerHTML = `
            <div class="mono-text">
                ${evidence.id}
            </div>

            <h3>
                ${formatEvidenceType(evidence.type)}
            </h3>

            <p>
                ${evidence.description}
            </p>

            <button
                type="button"
                class="button evidence-inspect"
                data-evidence-id="${evidence.id}"
            >
                INSPECT EVIDENCE
            </button>
        `;

        container.appendChild(card);
    });


    container.addEventListener('click', function (event) {

        const button =
            event.target.closest('.evidence-inspect');

        if (!button) {
            return;
        }

        const evidenceId =
            button.dataset.evidenceId;

        const selectedEvidence =
            evidenceData.find(function (evidence) {
                return evidence.id === evidenceId;
            });

        if (!selectedEvidence) {
            return;
        }

        if (window.rdcSession) {
            window.rdcSession.createSession('case-001');
            window.rdcSession.collectEvidence(evidenceId);
        }

        showEvidenceDetail(
            selectedEvidence,
            detailContainer
        );
    });
}


function showEvidenceDetail(
    evidence,
    container
) {

    container.innerHTML = `
        <div class="paper-card">

            <div class="mono-text">
                ${evidence.id}
            </div>

            <h3>
                ${formatEvidenceType(evidence.type)}
            </h3>

            <p>
                ${evidence.description}
            </p>

            <p class="mono-text">
                EVIDENCE STATUS: AVAILABLE
            </p>

        </div>
    `;

    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


function formatEvidenceType(type) {

    return type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, function (character) {
            return character.toUpperCase();
        });

}

