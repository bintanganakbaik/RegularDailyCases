document.addEventListener('DOMContentLoaded', async function () {

    const submitButton =
        document.getElementById('submit-conclusion');

    const resultPanel =
        document.getElementById('result-panel');

    const reasoningInput =
        document.getElementById('reasoning');

    const caseTitle =
        document.getElementById('case-title');

    if (!submitButton || !resultPanel) {
        return;
    }

    let caseData = null;

    try {

        const response =
            await fetch('../cases/case-001.json');

        if (!response.ok) {
            throw new Error('Unable to load case data.');
        }

        caseData =
            await response.json();

        if (caseTitle) {
            caseTitle.textContent =
                caseData.title;
        }

    } catch (error) {

        console.error(error);

        resultPanel.hidden = false;

        resultPanel.innerHTML = `
            <div class="mono-text">
                SYSTEM ERROR
            </div>

            <h2>
                Unable to Load Case
            </h2>

            <p>
                The case data could not be loaded.
            </p>
        `;

        return;
    }


    submitButton.addEventListener('click', function () {

        const selectedSuspect =
            document.querySelector(
                'input[name="suspect"]:checked'
            );

        const reasoning =
            reasoningInput.value.trim();


        if (!selectedSuspect) {

            showResult(
                resultPanel,
                'CONCLUSION INCOMPLETE',
                'You must select a suspect before submitting your conclusion.'
            );

            return;
        }


        if (!reasoning) {

            showResult(
                resultPanel,
                'REASONING REQUIRED',
                'Explain why you believe the selected suspect is responsible.'
            );

            return;
        }


        const correctSuspect =
            caseData.solution.suspect;

        const requiredEvidence =
            caseData.solution.requiredEvidence || [];

        const session =
            window.rdcSession
                ? window.rdcSession.getSession()
                : null;

        const collectedEvidence =
            session
                ? session.collectedEvidence
                : [];


        const missingEvidence =
            requiredEvidence.filter(function (evidenceId) {
                return !collectedEvidence.includes(evidenceId);
            });

        if (missingEvidence.length > 0) {

            showResult(
                resultPanel,
                'INSUFFICIENT EVIDENCE',
                'You have not collected enough required evidence to support a final conclusion.'
            );

            return;
        }


        if (
            selectedSuspect.value ===
            correctSuspect
        ) {

            showSuccess(
                resultPanel,
                caseData
            );

        } else {

            showFailure(
                resultPanel
            );
        }

    });

});


function showResult(
    container,
    title,
    message
) {

    container.hidden = false;

    container.innerHTML = `
        <div class="mono-text">
            INVESTIGATION STATUS
        </div>

        <h2>
            ${title}
        </h2>

        <p>
            ${message}
        </p>
    `;

    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


function showSuccess(
    container,
    caseData
) {

    const ending =
        caseData.solution.ending;


    container.hidden = false;

    container.innerHTML = `
        <div class="mono-text">
            CASE STATUS: SOLVED
        </div>

        <h2>
            CASE SOLVED
        </h2>

        <p>
            Your conclusion identifies the correct suspect.
        </p>

        <div class="paper-card">
            <div class="mono-text">
                ARREST REPORT
            </div>

            <h3>
                ${caseData.solution.suspect}
            </h3>

            <p>
                ${ending.summary}
            </p>
        </div>
    `;

    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


function showFailure(container) {

    container.hidden = false;

    container.innerHTML = `
        <div class="mono-text">
            CASE STATUS: UNSOLVED
        </div>

        <h2>
            CONCLUSION INCORRECT
        </h2>

        <p>
            The evidence does not support your current conclusion.
        </p>

        <p>
            The investigation remains open.
            Review the evidence, suspects, and timeline
            before trying again.
        </p>
    `;

    container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}