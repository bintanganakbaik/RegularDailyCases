const SESSION_KEY = 'rdc_case_session';

function createSession(caseId) {

    const existingSession = getSession();

    if (existingSession && existingSession.caseId === caseId) {
        return existingSession;
    }

    const newSession = {
        caseId: caseId,
        collectedEvidence: [],
        visitedSuspects: [],
        conclusionSubmitted: false
    };

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(newSession)
    );

    return newSession;
}


function getSession() {

    const storedSession =
        sessionStorage.getItem(SESSION_KEY);

    if (!storedSession) {
        return null;
    }

    try {

        return JSON.parse(storedSession);

    } catch (error) {

        console.error(
            'Session data could not be read.',
            error
        );

        sessionStorage.removeItem(SESSION_KEY);

        return null;
    }
}


function saveSession(session) {

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );
}


function collectEvidence(evidenceId) {

    const session = getSession();

    if (!session) {
        return;
    }

    if (
        !session.collectedEvidence.includes(evidenceId)
    ) {

        session.collectedEvidence.push(
            evidenceId
        );

        saveSession(session);
    }
}


function hasEvidence(evidenceId) {

    const session = getSession();

    if (!session) {
        return false;
    }

    return session.collectedEvidence.includes(
        evidenceId
    );
}


function visitSuspect(suspectName) {

    const session = getSession();

    if (!session) {
        return;
    }

    if (
        !session.visitedSuspects.includes(suspectName)
    ) {

        session.visitedSuspects.push(
            suspectName
        );

        saveSession(session);
    }
}


function hasVisitedSuspect(suspectName) {

    const session = getSession();

    if (!session) {
        return false;
    }

    return session.visitedSuspects.includes(
        suspectName
    );
}


function clearSession() {

    sessionStorage.removeItem(
        SESSION_KEY
    );
}


window.rdcSession = {
    createSession,
    getSession,
    saveSession,
    collectEvidence,
    hasEvidence,
    visitSuspect,
    hasVisitedSuspect,
    clearSession
};