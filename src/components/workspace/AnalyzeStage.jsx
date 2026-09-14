function AnalyzeStage({ project }) {
    return (
        <section className="stage-section">
            <div className="stage-label">
                02 / ANALYZE
            </div>

            <h1>
                Find the gaps before they find you.
            </h1>

            <p className="stage-description">
                Preflight will analyze your idea for signal strength,
                blind spots, and risk vectors.
            </p>

            <div className="action-card">
                <div className="action-card-label">
                    READY TO ANALYZE
                </div>

                <button
                    type="button"
                    className="primary-stage-button"
                >
                    RUN ANALYSIS →
                </button>
            </div>
        </section>
    );
}

export default AnalyzeStage;