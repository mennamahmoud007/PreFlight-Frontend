import { useEffect, useState } from 'react';

import api from '../../services/api';

function ChallengeStage({
    project,
    onProjectUpdated,
}) {

    const existingStressTest =
        project.analysis?.stress_test;

    const hasStressTest =
        existingStressTest?.primary_concern;

    const [stressTestState, setStressTestState] = useState(
        hasStressTest ? 'result' : 'ready'
    );

    const [stressTest, setStressTest] = useState(
        existingStressTest ?? null
    );

    const [error, setError] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);


    /* =========================
       LOADING STEPS
    ========================= */

    useEffect(() => {

        if (stressTestState !== 'loading') {
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

    }, [stressTestState]);


    /* =========================
       RUN STRESS TEST
    ========================= */

    const handleRunStressTest = async () => {

        setStressTestState('loading');
        setError('');

        try {

            const response = await api.post(
                `/projects/${project.id}/stress-test`
            );

            const analysisData = response.data.data;

            const stressTestData =
                analysisData.stress_test;

            setStressTest(stressTestData);
            setStressTestState('result');

            onProjectUpdated({
                ...project,
                analysis: analysisData,
                status: 'stress-tested',
            });

        } catch (error) {

            console.error(
                'Failed to run stress-test:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to stress-test this project. Please try again.'
            );

            setStressTestState('ready');
        }
    };


    /* =========================
       RUNNING
    ========================= */

    if (stressTestState === 'loading') {

        return (
            <section className="analyze-loading-state">

                <div className="analyze-loading-title">
                    RUNNING PREFLIGHT CHECK
                </div>

                <div className="analyze-loading-bar">
                    <span />
                </div>

                <div className="analyze-loading-subtitle">
                    STRESS-TESTING ASSUMPTIONS....
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

    if (stressTestState === 'result' && stressTest) {

        const riskLevel =
            stressTest.risk_level?.toLowerCase() || 'medium';

        return (
            <section className="challenge-stage">

                {/* ================= HEADING ================= */}

                <div className="analyze-heading-row">

                    <div className="workspace-stage-heading">

                        <p>
                            03 / STRESS-TEST
                        </p>

                        <h2>
                            Good ideas survive hard questions.
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="analyze-secondary-button"
                        onClick={handleRunStressTest}
                    >
                        RUN AGAIN
                    </button>

                </div>


                {/* ================= PRIMARY CONCERN ================= */}

                <section className="stress-primary-concern">

                    <div className="stress-primary-header">
                        <span className="stress-primary-icon">
                            !
                        </span>

                        <span>
                            PRIMARY CONCERN
                        </span>
                    </div>

                    <p>
                        {stressTest.primary_concern}
                    </p>

                </section>


                {/* ================= CRITICAL QUESTIONS ================= */}

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        CRITICAL QUESTIONS
                    </div>

                    <div className="analyze-card-body challenge-list-body">

                        <div className="analyze-list">

                            {stressTest.critical_questions?.map(
                                (question, index) => (

                                    <div
                                        key={index}
                                        className="analyze-list-item challenge-question"
                                    >

                                        <span className="challenge-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <p>
                                            {question}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </section>


                {/* ================= ASSUMPTIONS ================= */}

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        ASSUMPTIONS UNDER REVIEW
                    </div>

                    <div className="analyze-card-body challenge-list-body">

                        <div className="analyze-list">

                            {stressTest.assumptions?.map(
                                (assumption, index) => (

                                    <div
                                        key={index}
                                        className="analyze-list-item challenge-assumption"
                                    >

                                        <span className="assumption-dot">
                                            •
                                        </span>

                                        <p>
                                            {assumption}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </section>


                {/* ================= RISK LEVEL ================= */}

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        RISK LEVEL
                    </div>

                    <div className="analyze-card-body">

                        <div className="risk-level-grid">

                            <RiskLevelCard
                                level="high"
                                selected={riskLevel === 'high'}
                            />

                            <RiskLevelCard
                                level="medium"
                                selected={riskLevel === 'medium'}
                            />

                            <RiskLevelCard
                                level="low"
                                selected={riskLevel === 'low'}
                            />

                        </div>

                    </div>

                </section>


                <button
                    type="button"
                    className="workspace-primary-button"
                    disabled
                >
                    IMPROVE THIS IDEA →
                </button>

            </section>
        );
    }


    /* =========================
       READY
    ========================= */

    return (
        <section className="challenge-stage">

            <div className="workspace-stage-heading">

                <p>
                    03 / STRESS-TEST
                </p>

                <h2>
                    Good ideas survive hard questions.
                </h2>

            </div>


            <p className="analyze-description">
                We'll challenge your assumptions with the hardest
                questions your idea will face.
            </p>


            {error && (
                <div className="workspace-inline-error">
                    {error}
                </div>
            )}


            <div className="analyze-ready-card">

                <div className="analyze-card-label">
                    READY TO STRESS-TEST
                </div>

                <p className="analyze-ready-text">
                    Put <strong>{project.name}</strong> through
                    the hardest questions it needs to survive.
                </p>

                <button
                    type="button"
                    className="workspace-primary-button"
                    onClick={handleRunStressTest}
                >
                    CHALLENGE MY IDEA →
                </button>

            </div>

        </section>
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

    const completed = index < currentStep;
    const current = index === currentStep;

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


/* =========================
   RISK LEVEL CARD
========================= */

function RiskLevelCard({
    level,
    selected,
}) {

    const messages = {
        high: 'Significant risks require immediate attention.',
        medium: 'Notable risks present — manageable with attention.',
        low: 'Low-risk profile with limited concerns.',
    };

    return (
        <div
            className={`stress-risk-card ${
                selected ? 'selected' : ''
            } ${level}`}
        >

            <div className="stress-risk-level">
                {level.toUpperCase()}
            </div>

            {selected && (
                <p>
                    {messages[level]}
                </p>
            )}

        </div>
    );
}


export default ChallengeStage;