import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import './Home.css';

function Home() {
    const [latestProject, setLatestProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');

                const projects = response.data.data;

                if (projects.length > 0) {
                    setLatestProject(projects[0]);
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="home">

            {/* ================= NAVBAR ================= */}

            <header className="home-navbar">
                <div className="home-container home-navbar-inner">

                    <Link to="/" className="home-logo">
                        <span className="logo-mark">↗</span>
                        PRELIGHT
                    </Link>

                    <nav className="home-nav">
                        <a href="#how-it-works">
                            How It Works
                        </a>

                        <Link to="/overview" className="home-nav-button">
                            RUN YOUR PREFLIGHT →
                        </Link>
                    </nav>

                </div>
            </header>


            {/* ================= HERO ================= */}

            <section className="home-section hero-section">
                <div
                    className={`home-container hero ${
                        latestProject ? 'has-project' : 'no-project'
                    }`}
                >

                    <div
                        className={`hero-content ${
                            latestProject ? 'has-project' : 'no-project'
                        }`}
                    >

                        <div className="hero-main-copy">

                            <p className="section-label">
                                PRE-FLIGHT IDEA VALIDATION SYSTEM
                            </p>

                            <h1>
                                DON' T
                                <br />
                                LAUNCH
                                <br />
                                <span>BLIND.</span>
                            </h1>

                        </div>

                        <div className="hero-support">

                            <p className="hero-subtitle">
                                Pressure-test your idea before you build it.
                            </p>

                            <p className="hero-description">
                                Preflight helps you check, analyze, stress-test,
                                improve, and pitch your idea before you launch.
                            </p>

                            <div className="hero-actions">

                                <Link
                                    to="/overview"
                                    className="primary-button"
                                >
                                    RUN YOUR PREFLIGHT →
                                </Link>

                                <a
                                    href="#how-it-works"
                                    className="secondary-button"
                                >
                                    SEE HOW IT WORKS
                                </a>

                            </div>

                        </div>

                    </div>

                    {latestProject && (
                        <LatestProjectPanel project={latestProject} />
                    )}

                </div>
            </section>


            {/* ================= THE PROBLEM ================= */}

            <section className="home-section problem-section">

                <div className="home-container">

                    <div className="problem-heading">

                        <p className="section-label">
                            THE PROBLEM
                        </p>

                        <h2>
                            YOUR IDEA ISN'T READY
                            <br />
                            JUST BECAUSE IT SOUNDS
                            <br />
                            GOOD.
                        </h2>

                        <p>
                            Every idea comes with assumptions. Preflight helps
                            you find them before the market does.
                        </p>

                    </div>


                    <div className="insight-grid">

                        <InsightCard
                            number="01"
                            title="ASSUMPTIONS"
                            description="What are you taking for granted?"
                        />

                        <InsightCard
                            number="02"
                            title="BLIND SPOTS"
                            description="What are you missing?"
                        />

                        <InsightCard
                            number="03"
                            title="RISKS"
                            description="What could break the idea?"
                        />

                    </div>

                </div>

            </section>


            {/* ================= SYSTEM ================= */}

            <section
                className="home-section system-section"
                id="how-it-works"
            >

                <div className="home-container">

                    <p className="section-label">
                        THE PREFLIGHT SYSTEM
                    </p>

                    <h2>
                        HOW PREFLIGHT WORKS
                    </h2>


                    <div className="workflow">

                        <WorkflowStep
                            number="01"
                            title="CHECK"
                            description="Understand your idea."
                        />

                        <WorkflowStep
                            number="02"
                            title="ANALYZE"
                            description="Find the gaps."
                        />

                        <WorkflowStep
                            number="03"
                            title="STRESS-TEST"
                            description="Challenge your assumptions."
                        />

                        <WorkflowStep
                            number="04"
                            title="IMPROVE"
                            description="Turn weaknesses into opportunities."
                        />

                        <WorkflowStep
                            number="05"
                            title="PITCH"
                            description="Get launch-ready."
                        />

                    </div>

                </div>

            </section>


            {/* ================= AI POSITIONING ================= */}

            <section className="home-section ai-section">

                <div className="home-container">

                    <div className="ai-heading">

                        <p className="section-label">
                            NOT ANOTHER AI CHAT
                        </p>

                        <h2>
                            NOT ANOTHER AI CHAT.
                        </h2>

                        <p>
                            Preflight isn't here to tell you your idea is
                            great. It's here to help you figure out whether
                            it can become stronger.
                        </p>

                    </div>


                    <div className="ai-comparison">

                        <div className="ai-panel generic-ai">

                            <p className="panel-label">
                                GENERIC AI
                            </p>

                            <div>Ask</div>
                            <div>Answer</div>
                            <div>Done</div>

                        </div>


                        <div className="ai-panel prelight-ai">

                            <p className="panel-label">
                                PRELIGHT
                            </p>

                            <div>01 &nbsp; CHECK</div>
                            <div>02 &nbsp; ANALYZE</div>
                            <div>03 &nbsp; STRESS-TEST</div>
                            <div>04 &nbsp; IMPROVE</div>
                            <div>05 &nbsp; PITCH</div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FINAL CTA ================= */}

            <section className="home-section final-cta">

                <div className="home-container">

                    <p className="section-label">
                        READY?
                    </p>

                    <h2>
                        READY FOR TAKEOFF?
                    </h2>

                    <p>
                        Give your idea a pre-flight check before you give it
                        your time.
                    </p>

                    <Link
                        to="/overview"
                        className="primary-button"
                    >
                        START YOUR PREFLIGHT →
                    </Link>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="home-footer">

                <div className="home-container footer-inner">

                    <Link to="/" className="home-logo">
                        <span className="logo-mark">↗</span>
                        PRELIGHT
                    </Link>

                    <span>
                        DON'T LAUNCH BLIND.
                    </span>

                    <span>
                        © 2026 Preflight
                    </span>

                </div>

            </footer>

        </div>
    );
}


/* ================= PROJECT PANEL ================= */

function LatestProjectPanel({ project }) {

    const stages = [
        'CHECK',
        'ANALYZE',
        'STRESS-TEST',
        'IMPROVE',
        'PITCH',
    ];

    return (
        <div className="project-panel">

            <div className="panel-browser-bar">
                <span></span>
                <span></span>
                <span></span>
                <small>preflight.app</small>
            </div>

            <div className="project-panel-content">

                <div className="project-panel-header">

                    <div>
                        <p>PROJECT {String(project.id).padStart(4, '0')}</p>

                        <strong>
                            {project.name}
                        </strong>
                    </div>

                    <div className="project-status">
                        <p>PREFLIGHT STATUS</p>

                        <span>
                            {formatStatus(project.status)}
                        </span>
                    </div>

                </div>


                <div className="score-panel">

                    <div className="score-value">
                        <strong>
                            {project.score ?? '--'}
                        </strong>

                        <small>
                            / 100
                        </small>
                    </div>

                    <div className="score-info">

                        <span>
                            PREFLIGHT SCORE
                        </span>

                        <div className="score-line">
                            <span
                                style={{
                                    width: `${project.score ?? 0}%`,
                                }}
                            />
                        </div>

                        <small>
                            {getScoreLabel(project.score)}
                        </small>

                    </div>

                </div>


                <div className="project-stages">

                {stages.map((stage, index) => {

                    const completedCount = getCompletedStages(project.status);
                    const isCompleted = index < completedCount;

                    return (
                        <div
                            className={`project-stage ${
                                isCompleted ? 'completed' : ''
                            }`}
                            key={stage}
                        >

                            <small>
                                {isCompleted ? '✓' : `0${index + 1}`}
                            </small>

                            <span>
                                {stage}
                            </span>

                        </div>
                    );
                })}

                </div>

            </div>

        </div>
    );
}


/* ================= SMALL COMPONENTS ================= */

function InsightCard({ number, title, description }) {
    return (
        <div className="insight-card">

            <span>{number}</span>

            <strong>{title}</strong>

            <p>{description}</p>

        </div>
    );
}


function WorkflowStep({ number, title, description }) {
    return (
        <div className="workflow-step">

            <div className="workflow-node">
                <span></span>
            </div>

            <small>{number}</small>

            <strong>{title}</strong>

            <p>{description}</p>

        </div>
    );
}


/* ================= HELPERS ================= */

function formatStatus(status) {
    if (!status) {
        return 'NOT CHECKED';
    }

    return status
        .replaceAll('-', ' ')
        .replace(/\b\w/g, letter => letter.toUpperCase());
}


function getScoreLabel(score) {
    if (score === null || score === undefined) {
        return 'NOT CHECKED';
    }

    if (score >= 80) {
        return 'STRONG SIGNALS';
    }

    if (score >= 60) {
        return 'NEEDS ATTENTION';
    }

    return 'HIGH RISK';
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


export default Home;