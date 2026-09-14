function PitchStage({ project }) {
    return (
        <section className="stage-section">
            <div className="stage-label">
                05 / PITCH
            </div>

            <h1>
                Turn your idea into a pitch.
            </h1>

            <p className="stage-description">
                Build a clear, structured pitch from everything
                we've learned about your idea.
            </p>

            <div className="action-card">
                <div className="action-card-label">
                    READY TO BUILD
                </div>

                <button
                    type="button"
                    className="primary-stage-button"
                >
                    BUILD MY PITCH →
                </button>
            </div>
        </section>
    );
}

export default PitchStage;