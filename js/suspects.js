
document.addEventListener('DOMContentLoaded', async function () {

    const suspectList =
        document.getElementById('suspect-list');

    const suspectDetail =
        document.getElementById('suspect-detail');

    const caseTitle =
        document.getElementById('case-title');

    if (!suspectList || !suspectDetail) {
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

        renderSuspects(
            caseData.suspects,
            suspectList,
            suspectDetail
        );

    } catch (error) {

        console.error(error);

        suspectList.innerHTML = `
            <article class="paper-card">
                <h3>Unable to Load Suspects</h3>
                <p>
                    The case data could not be loaded.
                </p>
            </article>
        `;
    }
});


function renderSuspects(
    suspects,
    container,
    detailContainer
) {

    container.innerHTML = '';

    suspects.forEach(function (suspect, index) {

        const suspectId =
            'suspect-' +
            String(index + 1).padStart(3, '0');

        const card =
            document.createElement('article');

        card.className =
            'paper-card suspect-card';

        card.dataset.suspectId =
            suspectId;

        card.innerHTML = `
            <div class="mono-text">
                ${suspectId}
            </div>

            <h3>
                ${suspect.name}
            </h3>

            <p>
                ${suspect.description}
            </p>

            <p class="mono-text">
                STATUS: PERSON OF INTEREST
            </p>

            <button
                type="button"
                class="button suspect-view"
                data-suspect-id="${suspectId}"
            >
                VIEW DOSSIER
            </button>
        `;

        container.appendChild(card);
    });


    container.addEventListener(
        'click',
        function (event) {

            const button =
                event.target.closest('.suspect-view');

            if (!button) {
                return;
            }

            const suspectId =
                button.dataset.suspectId;

            const suspectIndex =
                Number(
                    suspectId.replace('suspect-', '')
                ) - 1;

            const selectedSuspect =
                suspects[suspectIndex];

            if (!selectedSuspect) {
                return;
            }

            showSuspectDetail(
                selectedSuspect,
                suspectId,
                detailContainer
            );
        }
    );
}


function showSuspectDetail(
    suspect,
    suspectId,
    container
) {

    container.innerHTML = `
        <div class="paper-card">

            <div class="mono-text">
                ${suspectId}
            </div>

            <h3>
                ${suspect.name}
            </h3>

            <p>
                ${suspect.description}
            </p>

            <p class="mono-text">
                DOSSIER STATUS: PERSON OF INTEREST
            </p>

        </div>
    `;

    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

