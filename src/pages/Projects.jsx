import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import './Projects.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const filteredProjects = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesFilter =
                activeFilter === 'all' ||
                getFilterStatus(project.status) === activeFilter;

            if (!matchesFilter) {
                return false;
            }

            if (!query) {
                return true;
            }

            const searchableText = [
                project.name,
                project.industry,
                project.target_audience,
                project.status,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [projects, activeFilter, searchQuery]);

    const handleDelete = async () => {
        if (!projectToDelete) {
            return;
        }

        try {
            await api.delete(`/projects/${projectToDelete.id}`);

            setProjects((currentProjects) =>
                currentProjects.filter(
                    (project) => project.id !== projectToDelete.id
                )
            );

            setProjectToDelete(null);
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    return (
        <div className="projects-page">

            {/* ================= HEADER ================= */}

            <div className="projects-header">

                <div className="projects-header-copy">

                    <p className="projects-label">
                        WORKSPACE
                    </p>

                    <h1>
                        YOUR PROJECTS
                    </h1>

                    <p className="projects-subtitle">
                        Every idea has a flight plan.
                    </p>

                </div>

                <Link
                    to="/projects/new"
                    className="new-project-button"
                >
                    + NEW PROJECT
                </Link>

            </div>


            {/* ================= FILTERS ================= */}

            <div className="projects-filters">

                <label className="projects-search">

                    <svg
                        className="projects-search-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            cx="11"
                            cy="11"
                            r="6.5"
                        />
                        <path d="M16 16L21 21" />
                    </svg>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                        placeholder="Search projects..."
                        aria-label="Search projects"
                    />

                </label>

                <FilterButton
                    label="ALL"
                    value="all"
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                <FilterButton
                    label="CHECKING"
                    value="checking"
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                <FilterButton
                    label="ANALYZED"
                    value="analyzed"
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                <FilterButton
                    label="STRESS-TESTED"
                    value="stress-tested"
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                <FilterButton
                    label="IMPROVED"
                    value="improved"
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                <FilterButton
                    label="LAUNCH-READY"
                    value="launch-ready"
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

            </div>


            {/* ================= PROJECTS ================= */}

            {loading ? (
                <div className="projects-loading">
                    LOADING PROJECTS...
                </div>
            ) : projects.length === 0 ? (
                <EmptyProjects />
            ) : filteredProjects.length === 0 ? (
                <div className="no-filter-results">
                    NO PROJECTS MATCH YOUR SEARCH.
                </div>
            ) : (
                <div className="projects-table">

                    <div className="projects-table-header">

                        <span>PROJECT</span>
                        <span>STATUS</span>
                        <span>SCORE</span>
                        <span>LAST CHECK</span>
                        <span>ACTIONS</span>

                    </div>

                    {filteredProjects.map((project) => (
                        <ProjectRow
                            key={project.id}
                            project={project}
                            onDelete={() =>
                                setProjectToDelete(project)
                            }
                        />
                    ))}

                </div>
            )}


            {/* ================= DELETE MODAL ================= */}

            {projectToDelete && (
                <DeleteModal
                    project={projectToDelete}
                    onCancel={() => setProjectToDelete(null)}
                    onDelete={handleDelete}
                />
            )}

        </div>
    );
}


/* ================= FILTER BUTTON ================= */

function FilterButton({
    label,
    value,
    activeFilter,
    setActiveFilter,
}) {
    return (
        <button
            type="button"
            className={`filter-button ${
                activeFilter === value ? 'active' : ''
            }`}
            onClick={() => setActiveFilter(value)}
        >
            {label}
        </button>
    );
}


/* ================= PROJECT ROW ================= */

function ProjectRow({ project, onDelete }) {
    return (
        <div className="project-row">

            <div className="project-info">

                <span className="project-number">
                    PROJECT {String(project.id).padStart(4, '0')}
                </span>

                <Link
                    to={`/project/${project.id}`}
                    className="project-name"
                >
                    {project.name}
                </Link>

                <p>
                    {project.industry || 'General'} ·{' '}
                    {project.target_audience ||
                        'No target audience specified'}
                </p>

            </div>


            <div className="project-status-cell">
                <span className="project-status-badge">
                    {formatStatus(project.status)}
                </span>
            </div>


            <div className="project-score">

                <strong>
                    {project.score ?? '--'}
                </strong>

                <span>
                    / 100
                </span>

            </div>


            <div className="project-date">
                {formatDate(project.last_checked_at)}
            </div>


            <div className="project-actions">

                <Link
                    to={`/project/${project.id}`}
                    className="open-project"
                >
                    OPEN
                </Link>

                <button
                    type="button"
                    className="delete-project"
                    onClick={onDelete}
                    aria-label={`Delete ${project.name}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M5 7h14" />
                        <path d="M9 7V5h6v2" />
                        <path d="M8 10v8" />
                        <path d="M12 10v8" />
                        <path d="M16 10v8" />
                        <path d="M6.5 7l1 13h9l1-13" />
                    </svg>
                </button>

            </div>

        </div>
    );
}


/* ================= EMPTY STATE ================= */

function EmptyProjects() {
    return (
        <div className="empty-projects">

            <div className="empty-projects-header">

                <p className="empty-label">
                    PROJECTS
                </p>

                <p className="empty-message">
                    No ideas have gone through preflight yet.
                </p>

            </div>


            <div className="empty-projects-body">

                <div className="empty-accent-line"></div>

                <h2>
                    YOUR FIRST PREFLIGHT
                    <br />
                    <span>STARTS HERE.</span>
                </h2>

                <p className="empty-description">
                    Run your first idea through the five-stage
                    <br />
                    check.
                </p>

                <Link
                    to="/projects/new"
                    className="empty-button"
                >
                    + NEW PROJECT
                </Link>

            </div>

        </div>
    );
}


/* ================= DELETE MODAL ================= */

function DeleteModal({
    project,
    onCancel,
    onDelete,
}) {
    return (
        <div className="delete-overlay">

            <div className="delete-modal">

                <p className="delete-label">
                    DELETE PROJECT?
                </p>

                <h2>
                    {project.name}
                </h2>

                <p className="delete-warning">
                    This will permanently remove this project
                    and its analysis.
                </p>

                <div className="delete-actions">

                    <button
                        type="button"
                        className="cancel-delete"
                        onClick={onCancel}
                    >
                        CANCEL
                    </button>

                    <button
                        type="button"
                        className="confirm-delete"
                        onClick={onDelete}
                    >
                        DELETE PROJECT
                    </button>

                </div>

            </div>

        </div>
    );
}


/* ================= HELPERS ================= */

function formatStatus(status) {
    if (!status) {
        return 'NOT CHECKED';
    }

    const labels = {
        checked: 'CHECKING',
        analyzed: 'ANALYZED',
        'stress-tested': 'STRESS-TESTED',
        improving: 'IMPROVED',
        pitching: 'LAUNCH-READY',
    };

    return (
        labels[status] ||
        status
            .replaceAll('-', ' ')
            .toUpperCase()
    );
}


function getFilterStatus(status) {
    const statusMap = {
        checking: 'checking',
        analyzed: 'analyzed',
        'stress-tested': 'stress-tested',
        improving: 'improved',
        pitching: 'launch-ready',
    };

    return statusMap[status] || '';
}


function formatDate(date) {
    if (!date) {
        return '—';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}


export default Projects;