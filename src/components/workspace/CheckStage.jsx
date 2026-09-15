import { useState } from 'react';
import api from '../../services/api';
function CheckStage({ project, onProjectUpdated, onStartAnalysis }) {

    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: project.name ?? '',
        description: project.description ?? '',
        target_audience: project.target_audience ?? '',
        industry: project.industry ?? '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };


    const handleEdit = () => {

        setError('');

        setForm({
            name: project.name ?? '',
            description: project.description ?? '',
            target_audience: project.target_audience ?? '',
            industry: project.industry ?? '',
        });

        setIsEditing(true);
    };


    const handleCancel = () => {

        setError('');

        setForm({
            name: project.name ?? '',
            description: project.description ?? '',
            target_audience: project.target_audience ?? '',
            industry: project.industry ?? '',
        });

        setIsEditing(false);
    };


    const handleSave = async () => {

        setError('');
        setSaving(true);

        try {

            const response = await api.patch(
                `/projects/${project.id}`,
                form
            );

            onProjectUpdated(response.data.data);

            setIsEditing(false);

        } catch (error) {

            console.error('Failed to update project:', error);

            setError(
                error.response?.data?.message ||
                'Failed to save project changes.'
            );

        } finally {

            setSaving(false);
        }
    };


    const checklist = getChecklist(form);


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


            {/* ================= PROJECT INFO ================= */}

            <section className="workspace-card">

                <div className="workspace-card-header project-info-header">

                    <span>
                        PROJECT INFORMATION
                    </span>

                    {project.status === 'checking' && (
                        <div className="project-info-actions">

                            {!isEditing && (
                                <button
                                    type="button"
                                    className="edit-project-button"
                                    onClick={handleEdit}
                                >
                                    EDIT
                                </button>
                            )}

                            {isEditing && (
                                <>
                                    <button
                                        type="button"
                                        className="cancel-edit-button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        CANCEL
                                    </button>

                                    <button
                                        type="button"
                                        className="done-edit-button"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? 'SAVING...' : 'DONE'}
                                    </button>
                                </>
                            )}

                        </div>
                    )}

                </div>


                <div className="project-information">

                    {isEditing ? (
                        <>
                            <EditField
                                label="PROJECT"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />

                            <EditField
                                label="IDEA"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                textarea
                            />

                            <EditField
                                label="TARGET AUDIENCE"
                                name="target_audience"
                                value={form.target_audience}
                                onChange={handleChange}
                            />

                            <EditField
                                label="INDUSTRY"
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <InfoRow
                                label="PROJECT"
                                value={project.name}
                            />

                            <InfoRow
                                label="IDEA"
                                value={project.description}
                            />

                            <InfoRow
                                label="TARGET AUDIENCE"
                                value={project.target_audience}
                            />

                            <InfoRow
                                label="INDUSTRY"
                                value={project.industry}
                            />
                        </>
                    )}

                </div>

            </section>


            {/* ================= ERROR ================= */}

            {error && (
                <div className="workspace-inline-error">
                    {error}
                </div>
            )}


            {/* ================= CHECKLIST ================= */}

            <section className="workspace-card">

                <div className="workspace-card-header">
                    PREFLIGHT CHECKLIST
                </div>

                <div className="checklist">

                    {checklist.map((item) => (
                        <ChecklistItem
                            key={item.text}
                            completed={item.completed}
                            review={item.review}
                            text={item.text}
                        />
                    ))}

                </div>

            </section>


            {/* ================= ACTION ================= */}

            <div className="check-action">

                <button
                    type="button"
                    className="workspace-primary-button"
                    onClick={onStartAnalysis}
                >
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


/* =========================
   EDIT FIELD
========================= */

function EditField({
    label,
    name,
    value,
    onChange,
    textarea = false,
}) {
    return (
        <div className="edit-field">

            <label htmlFor={name}>
                {label}
            </label>

            {textarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                />
            )}

        </div>
    );
}


/* =========================
   INFO ROW
========================= */

function InfoRow({ label, value }) {
    return (
        <div className="info-row">

            <div className="info-label">
                {label}
            </div>

            <div className="info-value">
                {value || 'Not provided'}
            </div>

        </div>
    );
}


/* =========================
   CHECKLIST
========================= */

function ChecklistItem({
    completed = false,
    review = false,
    text,
}) {
    return (
        <div className="checklist-item">

            <span
                className={`checklist-icon ${
                    completed ? 'completed' : ''
                } ${
                    review ? 'review' : ''
                }`}
            >
                {completed ? '✓' : '!'}
            </span>

            <span
                className={`checklist-text ${
                    review ? 'review' : ''
                }`}
            >
                {text}
            </span>

            {review && (
                <span className="review-badge">
                    NEEDS REVIEW
                </span>
            )}

        </div>
    );
}


/* =========================
   CHECKLIST LOGIC
========================= */

function getChecklist(form) {

    const hasName =
        form.name.trim().length > 0;

    const hasDescription =
        form.description.trim().length > 0;

    const hasTargetAudience =
        form.target_audience.trim().length > 0;

    return [
        {
            text: 'Idea clearly defined',
            completed: hasName && hasDescription,
            review: false,
        },
        {
            text: 'Problem identifiable',
            completed: hasDescription,
            review: false,
        },
        {
            text: 'Target audience specified',
            completed: hasTargetAudience,
            review: false,
        },
        {
            text: 'Value proposition needs review',
            completed: false,
            review: true,
        },
    ];
}

