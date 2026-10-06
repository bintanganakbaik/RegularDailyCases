javascript
document.addEventListener('DOMContentLoaded', async function () {

    const timelineList =
        document.getElementById('timeline-list');

    const caseTitle =
        document.getElementById('case-title');

    if (!timelineList) {
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

        renderTimeline(
            caseData.timeline,
            timelineList
        );

    } catch (error) {

        console.error(error);

        timelineList.innerHTML = `
            <article class="paper-card">
                <h3>Unable to Load Timeline</h3>
                <p>
                    The case timeline could not be loaded.
                </p>
            </article>
        `;
    }
});


function renderTimeline(timelineData, container) {

    container.innerHTML = '';

    timelineData.forEach(function (event) {

        const item =
            document.createElement('article');

        item.className =
            'paper-card timeline-item';

        item.innerHTML = `
            <div class="mono-text">
                ${event.time}
            </div>

            <h3>
                ${event.event}
            </h3>
        `;

        container.appendChild(item);
    });
}
