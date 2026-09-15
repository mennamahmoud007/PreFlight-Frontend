import { useState, useEffect } from 'react';

import api from '../../services/api';

function AnalyzeStage({ project, onProjectUpdated}) {

    const [analysisState, setAnalysisState] = useState(
        project.analysis ? 'result' : 'ready'
    );

    const [analysis, setAnalysis] = useState(
        project.analysis ?? null
    );

    const [error, setError] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);

    useEffect(() => {
        if (analysisState !== 'loading') {
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
    }, [analysisState]);

    const handleRunAnalysis = async () => {

        setAnalysisState('loading');
        setError('');

        try {

            const response = await api.post(
                `/projects/${project.id}/analysis`
            );

            const analysisData = response.data.data;

            setAnalysis(analysisData);
            setAnalysisState('result');

            onProjectUpdated({
                ...project,
                analysis: analysisData,
                status: 'analyzed',
                score: analysisData.score.overall,
            });

        } catch (error) {

            console.error(
                'Failed to run analysis:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to analyze this project. Please try again.'
            );

            setAnalysisState('ready');
        }
    };


    if (analysisState === 'loading') {
        return (
            <section className="analyze-loading-state">

                <div className="analyze-loading-title">
                    RUNNING PREFLIGHT CHECK
                </div>

                <div className="analyze-loading-bar">
                    <span />
                </div>

                <div className="analyze-loading-subtitle">
                    SCANNING BLIND SPOTS....
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


    if (analysisState === 'result' && analysis) {

        const overallScore = analysis.score.overall;

        const scoreLabel =
            overallScore >= 80
                ? 'STRONG SIGNALS'
                : overallScore >= 60
                    ? 'NEEDS ATTENTION'
                    : 'HIGH RISK';

        return (
            <section className="analyze-stage">

                {/* ================= HEADING ================= */}

                <div className="analyze-heading-row">

                    <div className="workspace-stage-heading">

                        <p>
                            02 / ANALYZE
                        </p>

                        <h2>
                            Find the gaps before they find you.
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="analyze-secondary-button"
                        onClick={handleRunAnalysis}
                    >
                        RUN AGAIN
                    </button>

                </div>


                {/* ================= SCORE ================= */}

                <section className="analyze-score-card">

                    <div className="analyze-score-value">

                        <div className="analyze-card-label">
                            PREFLIGHT SCORE
                        </div>

                        <div className="analyze-score">
                            {overallScore}

                            <span>
                                / 100
                            </span>
                        </div>

                    </div>

                    <div className="analyze-score-summary">

                        <div className="analyze-score-bar">
                            <span
                                style={{
                                    width: `${overallScore}%`,
                                }}
                            />
                        </div>

                        <span className="analyze-score-label">
                            {scoreLabel}
                        </span>

                    </div>

                </section>


                {/* ================= MATRIX ================= */}

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        ANALYSIS MATRIX
                    </div>

                    <div className="analyze-card-body">

                        <div className="analysis-matrix">

                            <ScoreItem
                                label="PROBLEM"
                                value={analysis.score.problem}
                            />

                            <ScoreItem
                                label="TARGET"
                                value={analysis.score.target}
                            />

                            <ScoreItem
                                label="VALUE"
                                value={analysis.score.value}
                            />

                            <ScoreItem
                                label="FEASIBILITY"
                                value={analysis.score.feasibility}
                            />

                            <ScoreItem
                                label="DIFFERENTIATION"
                                value={analysis.score.differentiation}
                            />
                        </div>
                
                    </div>

                </section>


                {/* ================= SIGNALS ================= */}

                <div className="analyze-signal-grid">

                    <section className="analyze-card">
                        <div className="analyze-card-header">
                            SIGNALS — STRENGTHS
                        </div>

                        <div className="analyze-card-body">

                            <div className="analyze-list">

                                {analysis.strengths?.map(
                                    (strength, index) => (
                                        <div
                                            key={index}
                                            className="analyze-list-item strength"
                                        >
                                            <span>✓</span>

                                            <p>
                                                {strength}
                                            </p>

                                        </div>
                                    )
                                )}
                            </div>

                        </div>

                    </section>


                    <section className="analyze-card">
                        <div className="analyze-card-header">
                            WEAK SIGNALS
                        </div>

                        <div className="analyze-card-body">

                            <div className="analyze-list">

                                {analysis.weaknesses?.map(
                                    (weakness, index) => (
                                        <div
                                            key={index}
                                            className="analyze-list-item weakness"
                                        >
                                            <span>!</span>

                                            <p>
                                                {weakness}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>
                        </div>    

                    </section>

                </div>


                {/* ================= RISKS ================= */}

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        RISK REGISTER
                    </div>
                    <div className="analyze-card-body">

                        <div className="analyze-list">

                            {analysis.risks?.map(
                                (risk, index) => (
                                    <div
                                        key={index}
                                        className="analyze-list-item risk"
                                    >

                                        <span className="risk-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <div className="risk-content">

                                            <span className="risk-level">
                                                {risk.level}
                                            </span>

                                            <p>
                                                {risk.description}
                                            </p>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    </div>

                </section>


                {/* ================= SUMMARY ================= */}

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        EXECUTIVE SUMMARY
                    </div>
                    <div className="analyze-card-body">

                        <p className="analyze-summary">
                            {analysis.summary}
                        </p>
                    </div>

                </section>


                <button
                    type="button"
                    className="workspace-primary-button"
                    disabled
                >
                    STRESS-TEST THIS IDEA →
                </button>

            </section>
        );
    }


    /* =========================
       READY
    ========================= */

    return (
    <section className="analyze-stage">

        <div className="workspace-stage-heading">

            <p>
                02 / ANALYZE
            </p>

            <h2>
                Find the gaps before they find you.
            </h2>

        </div>


        <p className="analyze-description">
            Preflight will analyze your idea for signal strength,
            blind spots, and risk vectors.
        </p>


        {error && (
            <div className="workspace-inline-error">
                {error}
            </div>
        )}


        <div className="analyze-ready-card">

            <div className="analyze-card-label">
                READY TO ANALYZE
            </div>

            <p className="analyze-ready-text">
                Click below to run the full Preflight analysis on{' '}
                <strong>{project.name}.</strong>
            </p>

            <button
                type="button"
                className="workspace-primary-button"
                onClick={handleRunAnalysis}
            >
                RUN ANALYSIS →
            </button>

        </div>

    </section>
);

function ScoreItem({ label, value }) {
    return (
        <div className="analysis-score-item">

            <div className="analysis-score-label">
                {label}
            </div>

            <div className="analysis-score-bar">
                <span
                    style={{
                        width: `${value}%`,
                    }}
                />
            </div>

            <div className="analysis-score-value">
                {value}
            </div>

        </div>
    );
}
}
function LoadingStep({ text, index, currentStep }) {
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

export default AnalyzeStage;