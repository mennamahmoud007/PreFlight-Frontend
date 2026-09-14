function CheckStage({ project, onProjectUpdated }) {
    return (
        <section className="check-stage">

            <div className="workspace-stage-heading">

                <p>
                    01 / CHECK
                </p>

                <h2>
                    Let's make sure we understand what you're building.
                </h2>
                <br />

            </div>

            <section className="workspace-card">

                <div className="workspace-card-header project-info-header">

                    <span>
                        PROJECT INFORMATION
                    </span>
                </div>

            </section>

            <div className="check-action">

                <button className="workspace-primary-button">
                    RUN ANALYSIS →
                </button>

                <span>
                    SYSTEM CHECK COMPLETE
                </span>

            </div>

        </section>
    );
}
export default CheckStage;