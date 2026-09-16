function WorkspaceHeader({ project, launchReady }) {
    const labels = {
        checking: 'CHECKING',
        analyzed: 'ANALYZING',
        'stress-tested': 'STRESS-TESTED',
        improving: 'IMPROVING',
        pitching: 'PITCHING',
    };
    const statusLabel = launchReady ? 'LAUNCH READY' : labels[project.status];

    return (
        <header className="workspace-header">

            <div>
                <div className="workspace-project-id">
                    PROJECT {String(project.id).padStart(4, '0')}
                </div>

                <div className="workspace-project-title-row">

                    <h1>
                        {project.name}
                    </h1>

                    <span
                        className={`workspace-status ${
                            launchReady
                                ? 'launch-ready-status'
                                : ''
                        }`}
                    >
                        {statusLabel}
                    </span>

                </div>
            </div>

        </header>
    );
}

export default WorkspaceHeader;