document.addEventListener('DOMContentLoaded', async function () {

    const boardArea =
        document.getElementById('board-area');

    const caseTitle =
        document.getElementById('case-title');

    if (!boardArea) {
        return;
    }

    try {

        const response =
            await fetch('../cases/case-001.json');

        if (!response.ok) {
            throw new Error('Unable to load case data.');
        }

        const caseData =
            await response.json();

        if (caseTitle) {
            caseTitle.textContent =
                caseData.title;
        }

        renderBoard(caseData, boardArea);

    } catch (error) {

        console.error(error);

        boardArea.innerHTML = `
            <article class="paper-card">
                <h3>Unable to Load Evidence Board</h3>
                <p>
                    The case data could not be loaded.
                </p>
            </article>
        `;
    }
});


function renderBoard(caseData, container) {

    const evidence =
        caseData.evidence || [];

    const suspects =
        caseData.suspects || [];

    const connections =
        caseData.solution?.importantConnections || [];

    container.innerHTML = '';


    // =========================
    // EVIDENCE
    // =========================

    const evidenceSection =
        document.createElement('section');

    evidenceSection.className =
        'paper-card';

    evidenceSection.innerHTML = `
        <div class="mono-text">
            EVIDENCE
        </div>

        <div class="board-list">
            ${evidence.map(function (item) {

                return `
                    <article class="paper-card">
                        <div class="mono-text">
                            ${item.id}
                        </div>

                        <h3>
                            ${formatText(item.type)}
                        </h3>

                        <p>
                            ${item.description}
                        </p>
                    </article>
                `;

            }).join('')}
        </div>
    `;


    // =========================
    // SUSPECTS
    // =========================

    const suspectSection =
        document.createElement('section');

    suspectSection.className =
        'paper-card';

    suspectSection.innerHTML = `
        <div class="mono-text">
            SUSPECTS
        </div>

        <div class="board-list">
            ${suspects.map(function (suspect) {

                return `
                    <article class="paper-card">
                        <div class="mono-text">
                            PERSON OF INTEREST
                        </div>

                        <h3>
                            ${suspect.name}
                        </h3>

                        <p>
                            ${suspect.description}
                        </p>
                    </article>
                `;

            }).join('')}
        </div>
    `;


    // =========================
    // CONNECTIONS
    // =========================

    const connectionSection =
        document.createElement('section');

    connectionSection.className =
        'paper-card';

    connectionSection.innerHTML = `
        <div class="mono-text">
            IMPORTANT CONNECTIONS
        </div>

        <p>
            Relationships between pieces of evidence
            identified by the case file.
        </p>

        <div class="board-list">
            ${connections.map(function (connection) {

                return `
                    <article class="paper-card">

                        <div class="mono-text">
                            ${connection.from}
                            →
                            ${connection.to}
                        </div>

                        <h3>
                            ${formatText(connection.relationship)}
                        </h3>

                        <p>
                            ${getEvidenceDescription(
                                connection.from,
                                evidence
                            )}
                        </p>

                        <p>
                            ${getEvidenceDescription(
                                connection.to,
                                evidence
                            )}
                        </p>

                    </article>
                `;

            }).join('')}
        </div>
    `;


    container.appendChild(evidenceSection);
    container.appendChild(suspectSection);
    container.appendChild(connectionSection);
}


function getEvidenceDescription(
    evidenceId,
    evidenceData
) {

    const evidence =
        evidenceData.find(function (item) {
            return item.id === evidenceId;
        });

    if (!evidence) {
        return evidenceId;
    }

    return `
        <strong>${evidence.id}</strong> —
        ${evidence.description}
    `;
}


function formatText(text) {

    return text
        .replace(/_/g, ' ')
        .replace(/\b\w/g, function (character) {
            return character.toUpperCase();
        });
}