import { useNavigate } from 'react-router';

function LaunchReadyStage({
    project,
    onViewPitch,
}) {
    const navigate = useNavigate();

    const analysis =
        project.analysis;

    const improvements =
        project.improvements ?? [];

    const pitchSections =
        project.pitch_sections ?? [];


    /* =========================
       READINESS
    ========================= */

    const analysisScore =
        analysis?.score?.overall ?? 0;

    const stressRisk =
        analysis?.stress_test?.risk_level?.toLowerCase();

    const stressScore =
        stressRisk === 'low'
            ? 100
            : stressRisk === 'medium'
                ? 70
                : stressRisk === 'high'
                    ? 40
                    : 0;

    const appliedCount =
        improvements.filter(
            (improvement) =>
                improvement.status === 'applied'
        ).length;

    const improvementScore =
        improvements.length > 0
            ? (appliedCount / improvements.length) * 100
            : 0;

    const pitchComplete =
        pitchSections.length === 8 &&
        pitchSections.every(
            (section) => section.content?.trim()
        );

    const pitchScore =
        pitchComplete ? 100 : 0;

    const finalReadiness = Math.round(
        (analysisScore * 0.5) +
        (stressScore * 0.2) +
        (improvementScore * 0.1) +
        (pitchScore * 0.2)
    );


    /* =========================
       HIGHLIGHTS
    ========================= */

    const topStrength =
        analysis?.strengths?.[0] ||
        'Your idea has a clearly defined direction.';

    const mainRisk =
        analysis?.risks?.find(
            (risk) =>
                risk.level?.toLowerCase() === 'high'
        ) ||
        analysis?.risks?.[0];

    const appliedImprovement =
        improvements.find(
            (improvement) =>
                improvement.status === 'applied'
        );


    return (
        <section className="launch-ready-stage">

            {/* =========================
               HEADING
            ========================= */}

            <div className="launch-ready-heading">

                <div className="launch-ready-accent" />

                <p className="launch-ready-kicker">
                    PREFLIGHT COMPLETE
                </p>

                <h2>
                    READY FOR
                    <br />
                    <span>TAKEOFF.</span>
                </h2>

            </div>


            {/* =========================
               SCORE
            ========================= */}

            <section className="launch-score-card">

                <div className="launch-score-value">
                    {finalReadiness}
                </div>

                <div className="launch-score-out-of">
                    / 100
                </div>

                <div className="launch-score-label">
                    FINAL READINESS SCORE
                </div>

            </section>


            {/* =========================
               CHECKLIST
            ========================= */}

            <section className="analyze-card launch-checklist-card">

                <div className="analyze-card-header">
                    PREFLIGHT CHECKLIST
                </div>

                <div className="launch-checklist">

                    <ChecklistItem
                        completed
                        text="Idea defined"
                    />

                    <ChecklistItem
                        completed
                        text="Idea analyzed"
                    />

                    <ChecklistItem
                        completed
                        text="Assumptions stress-tested"
                    />

                    <ChecklistItem
                        completed={
                            appliedCount > 0
                        }
                        text="Improvements applied"
                    />

                    <ChecklistItem
                        completed={
                            pitchComplete
                        }
                        text="Pitch completed"
                    />

                </div>

            </section>


            {/* =========================
               HIGHLIGHTS
            ========================= */}

            <div className="launch-highlight-grid">

                <section className="analyze-card">

                    <div className="analyze-card-header">
                        TOP STRENGTH
                    </div>

                    <div className="analyze-card-body">

                        <p className="launch-highlight-text">
                            {topStrength}
                        </p>

                    </div>

                </section>


                <section className="analyze-card">

                    <div className="analyze-card-header launch-risk-header">
                        MAIN RISK
                    </div>

                    <div className="analyze-card-body">

                        <p className="launch-highlight-text">
                            {mainRisk
                                ? mainRisk.description
                                : 'No major risk identified.'}
                        </p>

                    </div>

                </section>


                <section className="analyze-card">

                    <div className="analyze-card-header">
                        KEY IMPROVEMENT
                    </div>

                    <div className="analyze-card-body">

                        <p className="launch-highlight-text">
                            {appliedImprovement
                                ? appliedImprovement.opportunity
                                : 'No improvement has been applied yet.'}
                        </p>

                    </div>

                </section>

            </div>


            {/* =========================
               ACTIONS
            ========================= */}

            <div className="launch-actions">

                <button
                    type="button"
                    className="launch-view-button"
                    onClick={onViewPitch}
                >
                    VIEW PITCH DECK →
                </button>

                <button
                    type="button"
                    className="launch-another-button"
                    onClick={() => navigate('/projects/new')}
                >
                    START ANOTHER PREFLIGHT
                </button>

            </div>

        </section>
    );
}


/* =========================
   CHECKLIST ITEM
========================= */

function ChecklistItem({
    completed,
    text,
}) {
    return (
        <div className="launch-checklist-item">

            <span
                className={`launch-check-icon ${
                    completed
                        ? 'completed'
                        : 'pending'
                }`}
            >
                {completed ? '✓' : '○'}
            </span>

            <span>
                {text}
            </span>

        </div>
    );
}


export default LaunchReadyStage;