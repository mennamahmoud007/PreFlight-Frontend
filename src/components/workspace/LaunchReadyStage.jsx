function LaunchReadyStage({ project }) {
    return (
        <section className="launch-ready-stage">
            <div className="stage-label">
                LAUNCH READY
            </div>

            <h1>
                Your preflight is complete.
            </h1>

            <p>
                Your idea has made it through the preflight process.
            </p>

            <div className="launch-ready-actions">
                <button type="button">
                    VIEW YOUR PITCH
                </button>

                <button type="button">
                    START ANOTHER PREFLIGHT
                </button>
            </div>
        </section>
    );
}

export default LaunchReadyStage;