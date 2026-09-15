function WorkspaceProgress({
    currentStage,
    activeStage,
    onStageChange,
}) {
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
                const current = index === activeStage;

                return (
                    <button
                        key={stage}
                        type="button"
                        className={`workspace-stage ${
                            completed ? 'completed' : ''
                        } ${
                            current ? 'current' : ''
                        }`}
                        onClick={() => onStageChange(index)}
                        disabled={index > currentStage}
                    >

                        <span className="workspace-stage-number">
                            {completed ? '✓' : String(index + 1).padStart(2, '0')}
                        </span>

                        <span>
                            {stage}
                        </span>

                    </button>
                );
            })}

        </nav>
    );
}

export default WorkspaceProgress;