function WorkspaceHeader({ project }) {
    const labels = {
        checking: 'CHECKING',
        analyzed: 'ANALYZING',
        'stress-tested': 'STRESS-TESTED',
        improving: 'IMPROVING',
        pitching: 'PITCHING',
    };

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

                    <span className="workspace-status">
                        {labels[project.status]}
                    </span>

                </div>
            </div>

        </header>
    );
}

export default WorkspaceHeader;