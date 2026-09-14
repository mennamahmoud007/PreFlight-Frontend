function WorkspaceProgress({ currentStage }) {
    const stages = [
        'CHECK',
        'ANALYZE',
        'STRESS-TEST',
        'IMPROVE',
        'PITCH',
    ];

    return (
        <nav className="workspace-stage-nav">

            {stages.map((stage, index) => {

                const completed = index < currentStage;
                const current = index === currentStage;

                return (
                    <div
                        key={stage}
                        className={`workspace-stage ${
                            completed ? 'completed' : ''
                        } ${
                            current ? 'current' : ''
                        }`}
                    >

                        <span className="workspace-stage-number">
                            {completed
                                ? '✓'
                                : String(index + 1).padStart(2, '0')}
                        </span>

                        <span>
                            {stage}
                        </span>

                    </div>
                );
            })}

        </nav>
    );
}

export default WorkspaceProgress;