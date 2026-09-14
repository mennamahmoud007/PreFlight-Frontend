function ChallengeStage({ project }) {
    return (
        <section className="stage-section">
            <div className="stage-label">
                03 / STRESS-TEST
            </div>

            <h1>
                Good ideas survive hard questions.
            </h1>

            <p className="stage-description">
                We'll challenge your assumptions with the hardest
                questions your idea will face.
            </p>

            <div className="action-card">
                <div className="action-card-label">
                    READY TO CHALLENGE
                </div>

                <button
                    type="button"
                    className="primary-stage-button"
                >
                    CHALLENGE MY IDEA →
                </button>
            </div>
        </section>
    );
}

export default ChallengeStage;