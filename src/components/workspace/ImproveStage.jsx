import { useEffect, useState } from 'react';

import api from '../../services/api';

function ImproveStage({
    project,
    onProjectUpdated,
}) {
    const existingImprovements =
        project.improvements ?? [];

    const hasImprovements =
        project.status === 'improving' &&
        existingImprovements.length > 0;

    const [improvementState, setImprovementState] = useState(
        hasImprovements ? 'result' : 'ready'
    );

    const [improvements, setImprovements] = useState(
        existingImprovements
    );

    const [error, setError] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);
    const [updatingId, setUpdatingId] = useState(null);


    /* =========================
       LOADING STEPS
    ========================= */

    useEffect(() => {
        if (improvementState !== 'loading') {
            setLoadingStep(0);
            return;
        }

        const interval = setInterval(() => {
            setLoadingStep((currentStep) => {
                if (currentStep >= 3) {
                    return currentStep;
                }

                return currentStep + 1;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [improvementState]);


    /* =========================
       GENERATE IMPROVEMENTS
    ========================= */

    const handleGenerateImprovements = async () => {
        setImprovementState('loading');
        setError('');

        try {
            const response = await api.post(
                `/projects/${project.id}/improvement`
            );

            const improvementData =
                response.data.data;

            setImprovements(improvementData);
            setImprovementState('result');

            onProjectUpdated({
                ...project,
                improvements: improvementData,
                status: 'improving',
            });

        } catch (error) {
            console.error(
                'Failed to generate improvements:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to generate improvements. Please try again.'
            );

            setImprovementState('ready');
        }
    };


    /* =========================
       APPLY / UNAPPLY
    ========================= */

    const handleToggleImprovement = async (improvement) => {
        setUpdatingId(improvement.id);
        setError('');

        try {
            const response = await api.patch(
                `/projects/${project.id}/improvement/${improvement.id}/status`
            );

            const updatedImprovement =
                response.data.data;

            const updatedImprovements =
                improvements.map((item) =>
                    item.id === updatedImprovement.id
                        ? updatedImprovement
                        : item
                );

            setImprovements(updatedImprovements);

            onProjectUpdated({
                ...project,
                improvements: updatedImprovements,
                status: 'improving',
            });

        } catch (error) {
            console.error(
                'Failed to update improvement:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to update improvement status.'
            );

        } finally {
            setUpdatingId(null);
        }
    };


    /* =========================
       LOADING
    ========================= */

    if (improvementState === 'loading') {
        return (
            <section className="analyze-loading-state">

                <div className="analyze-loading-title">
                    RUNNING PREFLIGHT CHECK
                </div>

                <div className="analyze-loading-bar">
                    <span />
                </div>

                <div className="analyze-loading-subtitle">
                    GENERATING IMPROVEMENTS....
                </div>

                <div className="analyze-loading-steps">

                    <LoadingStep
                        text="Parsing idea structure"
                        index={0}
                        currentStep={loadingStep}
                    />

                    <LoadingStep
                        text="Identifying target signals"
                        index={1}
                        currentStep={loadingStep}
                    />

                    <LoadingStep
                        text="Cross-referencing market data"
                        index={2}
                        currentStep={loadingStep}
                    />

                    <LoadingStep
                        text="Stress-testing assumptions"
                        index={3}
                        currentStep={loadingStep}
                    />

                </div>

            </section>
        );
    }


    /* =========================
       RESULT
    ========================= */

    if (
        improvementState === 'result' &&
        improvements.length > 0
    ) {
        const appliedCount =
            improvements.filter(
                (item) => item.status === 'applied'
            ).length;

        return (
            <section className="improve-stage">

                {/* =========================
                   HEADING
                ========================= */}

                <div className="improve-heading-row">

                    <div className="workspace-stage-heading">

                        <p>
                            04 / IMPROVE
                        </p>

                        <h2>
                            Turn weak signals into stronger decisions.
                        </h2>

                    </div>

                    <div className="improve-applied-summary">

                        <span className="analyze-card-label">
                            APPLIED
                        </span>

                        <div className="improve-applied-count">

                            <strong>
                                {appliedCount}
                            </strong>

                            <span>
                                / {improvements.length}
                            </span>

                        </div>

                    </div>

                </div>


                {error && (
                    <div className="workspace-inline-error">
                        {error}
                    </div>
                )}


                {/* =========================
                   IMPROVEMENTS
                ========================= */}

                <div className="improvements-list">

                    {improvements.map(
                        (improvement) => (
                            <ImprovementCard
                                key={improvement.id}
                                improvement={improvement}
                                updating={
                                    updatingId === improvement.id
                                }
                                onToggle={
                                    handleToggleImprovement
                                }
                            />
                        )
                    )}

                </div>


                <button
                    type="button"
                    className="workspace-primary-button"
                    disabled
                >
                    BUILD MY PITCH →
                </button>

            </section>
        );
    }


    /* =========================
       READY
    ========================= */

    return (
        <section className="improve-stage">

            <div className="workspace-stage-heading">

                <p>
                    04 / IMPROVE
                </p>

                <h2>
                    Turn weak signals into stronger decisions.
                </h2>

            </div>


            <p className="analyze-description">
                We'll turn the weaknesses found in your analysis
                into actionable opportunities.
            </p>


            {error && (
                <div className="workspace-inline-error">
                    {error}
                </div>
            )}


            <div className="analyze-ready-card">

                <div className="analyze-card-label">
                    READY TO IMPROVE
                </div>

                <p className="analyze-ready-text">
                    Turn the weaknesses found in{' '}
                    <strong>{project.name}</strong>
                    {' '}into actionable opportunities.
                </p>

                <button
                    type="button"
                    className="workspace-primary-button"
                    onClick={handleGenerateImprovements}
                >
                    GENERATE IMPROVEMENTS →
                </button>

            </div>

        </section>
    );
}


/* =========================
   IMPROVEMENT CARD
========================= */

function ImprovementCard({
    improvement,
    updating,
    onToggle,
}) {
    const applied =
        improvement.status === 'applied';

    return (
        <article className="improvement-card">

            {/* TOP: WEAKNESS → OPPORTUNITY */}

            <div className="improvement-top">

                <div className="improvement-box weakness-box">

                    <div className="improvement-label">
                        WEAKNESS
                    </div>

                    <p>
                        {improvement.weakness}
                    </p>

                </div>


                <div className="improvement-arrow">
                    →
                </div>


                <div className="improvement-box opportunity-box">

                    <div className="improvement-label">
                        OPPORTUNITY
                    </div>

                    <p>
                        {improvement.opportunity}
                    </p>

                </div>

            </div>


            {/* MIDDLE: WHY / ACTION */}

            <div className="improvement-details">

                <div className="improvement-detail">

                    <div className="improvement-label">
                        WHY IT MATTERS
                    </div>

                    <p>
                        {improvement.why_it_matters}
                    </p>

                </div>


                <div className="improvement-detail">

                    <div className="improvement-label">
                        SUGGESTED ACTION
                    </div>

                    <p>
                        {improvement.suggested_action}
                    </p>

                </div>

            </div>


            {/* FOOTER */}

            <div className="improvement-footer">

                <div className="improvement-status-group">

                    <div className="improvement-label">
                        STATUS
                    </div>

                    <span
                        className={`improvement-status ${
                            applied
                                ? 'applied'
                                : 'pending'
                        }`}
                    >
                        {applied
                            ? 'APPLIED'
                            : 'PENDING'}
                    </span>

                </div>


                <button
                    type="button"
                    className={`improvement-toggle-button ${
                        applied
                            ? 'unapply'
                            : ''
                    }`}
                    onClick={() =>
                        onToggle(improvement)
                    }
                    disabled={updating}
                >
                    {updating
                        ? 'UPDATING...'
                        : applied
                            ? 'UNAPPLY'
                            : 'APPLY'}
                </button>

            </div>

        </article>
    );
}


/* =========================
   LOADING STEP
========================= */

function LoadingStep({
    text,
    index,
    currentStep,
}) {
    const completed =
        index < currentStep;

    const current =
        index === currentStep;

    return (
        <div
            className={`analyze-loading-step ${
                completed ? 'completed' : ''
            } ${
                current ? 'current' : ''
            } ${
                index > currentStep ? 'pending' : ''
            }`}
        >

            <span className="step-dot">
                {completed ? '✓' : ''}
            </span>

            <span>
                {text}
            </span>

        </div>
    );
}


export default ImproveStage;