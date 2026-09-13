import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import './Overview.css';

function Overview() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');

                setProjects(response.data.data);
            } catch (error) {
                console.error('Failed to load projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="overview-page">
                <p className="overview-loading">
                    LOADING WORKSPACE...
                </p>
            </div>
        );
    }

    const hasProjects = projects.length > 0;

    const latestProject = projects[0];

    const averageScore = getAverageScore(projects);

    return (
        <div className="overview-page">

            <div className="overview-container">

                {/* ================= HEADER ================= */}

                <header className="overview-header">

                    <div>
                        <p className="overview-label">
                            PREFLIGHT CONTROL
                        </p>

                        <h1>
                            Your ideas, before takeoff.
                        </h1>

                        <p className="overview-count">
                            {projects.length}{' '}
                            {projects.length === 1 ? 'project' : 'projects'}
                            {' '}in workspace
                        </p>
                    </div>

                    <Link
                        to="/projects/new"
                        className="overview-new-button"
                    >
                        + NEW PROJECT
                    </Link>

                </header>


                {hasProjects ? (
                    <Dashboard
                        latestProject={latestProject}
                        projectCount={projects.length}
                        averageScore={averageScore}
                    />
                ) : (
                    <EmptyWorkspace />
                )}

            </div>

        </div>
    );
}


/* =========================
   DASHBOARD
========================= */

function Dashboard({
    latestProject,
    projectCount,
    averageScore,
}) {
    const stages = [
        'CHECK',
        'ANALYZE',
        'STRESS-TEST',
        'IMPROVE',
        'PITCH',
    ];

    const completedStages = getCompletedStages(
        latestProject.status
    );

    return (
        <main className="overview-dashboard">

            {/* ================= CURRENT READINESS ================= */}

            <section className="readiness-section">

                <div className="section-heading">
                    <p> CURRENT READINESS </p>
                </div>

                <div className="readiness-card">

                    <div className="readiness-top">

                        <div>
                            <p className="project-id">
                                PROJECT{' '}
                                {String(latestProject.id).padStart(4, '0')}
                            </p>

                            <h2>
                                {latestProject.name}
                            </h2>
                        </div>

                        <div className="readiness-score">

                            <strong>
                                {latestProject.score ?? '--'}
                            </strong>

                            <span>
                                / 100
                            </span>

                        </div>

                    </div>


                    <div className="readiness-bottom">

                        <div>

                            <p className="readiness-status">
                                {getReadinessLabel(latestProject)}
                            </p>

                            <div className="readiness-bar">
                                <span
                                    style={{
                                        width: `${latestProject.score ?? 0}%`,
                                    }}
                                />
                            </div>

                        </div>

                        <Link
                            to={`/project/${latestProject.id}`}
                            className="open-project-button"
                        >
                            OPEN PROJECT →
                        </Link>

                    </div>


                    <div className="readiness-stages">

                        {stages.map((stage, index) => {

                            const completed =
                                index < completedStages;

                            return (
                                <div
                                    key={stage}
                                    className={`readiness-stage ${
                                        completed ? 'completed' : ''
                                    }`}
                                >
                                    <span className="stage-number">
                                        {completed
                                            ? '✓'
                                            : `0${index + 1}`}
                                    </span>

                                    <span>
                                        {stage}
                                    </span>
                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>


            {/* ================= WORKSPACE STATS ================= */}

            <section className="workspace-stats">

                <div className="section-heading">
                    <p> WORKSPACE STATS </p>
                </div>

                <div className="stats-grid">

                    <div className="stat-card">
                        <strong>
                            {projectCount}
                        </strong>

                        <span>
                            PROJECTS
                        </span>
                    </div>

                    <div className="stat-card">
                        <strong>
                            {averageScore}
                        </strong>

                        <span>
                            AVG SCORE
                        </span>
                    </div>

                </div>

            </section>

        </main>
    );
}


/* =========================
   EMPTY WORKSPACE
========================= */

function EmptyWorkspace() {
    return (
        <main className="empty-workspace">

            <section className="empty-intro">

                <p className="overview-label">
                    YOUR FIRST IDEA
                </p>

                <h2>
                    IS READY FOR
                    <br />
                    PREFLIGHT.
                </h2>

                <p>
                    Start with your idea and let Preflight
                    pressure-test it before you give it your time.
                </p>

                <Link
                    to="/projects/new"
                    className="empty-primary-button"
                >
                    RUN YOUR FIRST PREFLIGHT →
                </Link>

            </section>


            <section className="empty-workflow">

                <p className="section-heading-text">
                    BEFORE YOU LAUNCH, KNOW WHAT YOU'RE LAUNCHING.

                </p>

                <div className="empty-workflow-list">

                    <WorkflowItem
                        number="01"
                        title="FIND THE GAPS"
                        description="See what's weak before you spend time building."
                    />

                    <WorkflowItem
                        number="02"
                        title="CHALLENGE THE IDEA"
                        description="Stress-test assumptions with AI."
                    />

                    <WorkflowItem
                        number="03"
                        title="LEAVE WITH A PLAN"
                        description="Turn insights into improvements and a ready-to-use pitch."
                    />
                </div>

            </section>


            <section className="empty-stats">

                <p className="section-heading-text">
                    WORKSPACE STATS
                </p>

                <div className="empty-stat-values">

                    <div>
                        <strong>0</strong>
                        <span>PROJECTS</span>
                    </div>

                    <div>
                        <strong>--</strong>
                        <span>AVG SCORE</span>
                    </div>

                </div>

            </section>

        </main>
    );
}


/* =========================
   WORKFLOW ITEM
========================= */

function WorkflowItem({
    number,
    title,
    description,
}) {
    return (
        <div className="empty-workflow-item">

            <span>
                {number}
            </span>

            <div>
                <strong>
                    {title}
                </strong>

                <p>
                    {description}
                </p>
            </div>

        </div>
    );
}


/* =========================
   HELPERS
========================= */

function getAverageScore(projects) {
    const scoredProjects = projects.filter(
        project => project.score !== null && project.score !== undefined
    );

    if (scoredProjects.length === 0) {
        return '--';
    }

    const total = scoredProjects.reduce(
        (sum, project) => sum + Number(project.score),
        0
    );

    return Math.round(total / scoredProjects.length);
}


function getCompletedStages(status) {
    const stages = {
        checked: 1,
        analyzed: 2,
        'stress-tested': 3,
        improving: 4,
        pitching: 5,
    };

    return stages[status] ?? 0;
}


function getReadinessLabel(project) {
    if (project.score === null || project.score === undefined) {
        return 'READY FOR FIRST CHECK';
    }

    const nextStage = {
        checked: 'ANALYZE',
        analyzed: 'STRESS-TEST',
        'stress-tested': 'IMPROVE',
        improving: 'PITCH',
        pitching: 'LAUNCH',
    };

    const next = nextStage[project.status];

    if (!next) {
        return 'READY FOR NEXT CHECK';
    }

    return `READY FOR ${next}`;
}


export default Overview;