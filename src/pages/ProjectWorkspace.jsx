import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import api from '../services/api';

import WorkspaceHeader from '../components/workspace/WorkspaceHeader';
import WorkspaceProgress from '../components/workspace/WorkspaceProgress';
import CheckStage from '../components/workspace/CheckStage';
import AnalyzeStage from '../components/workspace/AnalyzeStage';
import ChallengeStage from '../components/workspace/ChallengeStage';
import ImproveStage from '../components/workspace/ImproveStage';
import PitchStage from '../components/workspace/PitchStage';

import './ProjectWorkspace.css';

function getCurrentStage(status) {
    const stages = {
        checking: 0,
        analyzed: 1,
        'stress-tested': 2,
        improving: 3,
        pitching: 4,
    };

    return stages[status] ?? 0;
}

function ProjectWorkspace() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [activeStage, setActiveStage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);

                const projectData = response.data.data;

                setProject(projectData);
                setActiveStage(getCurrentStage(projectData.status));
            } catch (error) {
                console.error('Failed to fetch project:', error);
                setError('Failed to load project.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="workspace-page">
                <div className="workspace-loading">
                    Loading project...
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="workspace-page">
                <div className="workspace-error">
                    {error || 'Project not found.'}
                </div>
            </div>
        );
    }

    const currentStage = getCurrentStage(project.status);

    const handleStageChange = (stage) => {
        if (stage <= currentStage) {
            setActiveStage(stage);
        }
    };

    const handleProjectUpdated = (updatedProject) => {
        setProject(updatedProject);
    };

    return (
        <div className="workspace-page">

            <header className="workspace-topbar">

                <WorkspaceHeader
                    project={project}
                />

                <WorkspaceProgress
                    currentStage={currentStage}
                    activeStage={activeStage}
                    onStageChange={handleStageChange}
                />

            </header>


            <main className="workspace-content">

                {activeStage === 0 && (
                    <CheckStage
                        project={project}
                        onProjectUpdated={handleProjectUpdated}
                        onStartAnalysis={() => setActiveStage(1)}
                    />
                )}

                {activeStage === 1 && (
                    <AnalyzeStage
                        project={project}
                        onProjectUpdated={handleProjectUpdated}
                        onStartStressTest={() => setActiveStage(2)}

                    />
                )}

                {activeStage === 2 && (
                    <ChallengeStage
                        project={project}
                        onProjectUpdated={handleProjectUpdated}

                    />
                )}

                {activeStage === 3 && (
                    <ImproveStage
                        project={project}
                    />
                )}

                {activeStage === 4 && (
                    <PitchStage
                        project={project}
                    />
                )}

            </main>

        </div>
    );
}

export default ProjectWorkspace;