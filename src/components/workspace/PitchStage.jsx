import { useEffect, useState } from 'react';

import api from '../../services/api';

function PitchStage({
    project,
    onProjectUpdated,
}) {

    const existingSections =
        project.pitch_sections ?? [];

    const hasPitch =
        existingSections.length > 0;

    const [pitchState, setPitchState] = useState(
        hasPitch ? 'result' : 'ready'
    );

    const [sections, setSections] = useState(
        existingSections
    );

    const [error, setError] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);

    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [savingId, setSavingId] = useState(null);
    const [regeneratingId, setRegeneratingId] = useState(null);


    /* =========================
       LOADING STEPS
    ========================= */

    useEffect(() => {

        if (pitchState !== 'loading') {
            setLoadingStep(0);
            return;
        }

        const interval = setInterval(() => {

            setLoadingStep((currentStep) => {

                if (currentStep >= 3) {
                    return currentStep;
                }

                return currentStep + 1;
            });

        }, 1500);

        return () => clearInterval(interval);

    }, [pitchState]);


    /* =========================
       BUILD PITCH
    ========================= */

    const handleBuildPitch = async () => {

        setPitchState('loading');
        setError('');

        try {

            const response = await api.post(
                `/projects/${project.id}/pitch`
            );

            const pitchData =
                response.data.data;

            setSections(pitchData);
            setPitchState('result');

            onProjectUpdated({
                ...project,
                pitch_sections: pitchData,
                status: 'pitching',
            });

        } catch (error) {

            console.error(
                'Failed to build pitch:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to build your pitch. Please try again.'
            );

            setPitchState('ready');
        }
    };


    /* =========================
       EDIT
    ========================= */

    const handleEdit = (section) => {

        setError('');

        setEditingId(section.id);
        setEditContent(section.content ?? '');
    };


    const handleCancelEdit = () => {

        setError('');
        setEditingId(null);
        setEditContent('');
    };


    /* =========================
       SAVE SECTION
    ========================= */

    const handleSaveSection = async (section) => {

        setSavingId(section.id);
        setError('');

        try {

            const response = await api.patch(
                `/projects/${project.id}/pitch/${section.id}`,
                {
                    content: editContent,
                }
            );

            const updatedSection =
                response.data.data;

            const updatedSections =
                sections.map((item) =>
                    item.id === updatedSection.id
                        ? updatedSection
                        : item
                );

            setSections(updatedSections);

            onProjectUpdated({
                ...project,
                pitch_sections: updatedSections,
                status: 'pitching',
            });

            setEditingId(null);
            setEditContent('');

        } catch (error) {

            console.error(
                'Failed to save pitch section:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to save this section.'
            );

        } finally {

            setSavingId(null);
        }
    };


    /* =========================
       REGENERATE
    ========================= */

    const handleRegenerate = async (section) => {

        setRegeneratingId(section.id);
        setError('');

        try {

            const response = await api.post(
                `/projects/${project.id}/pitch/${section.id}/regenerate`
            );

            const updatedSection =
                response.data.data;

            const updatedSections =
                sections.map((item) =>
                    item.id === updatedSection.id
                        ? updatedSection
                        : item
                );

            setSections(updatedSections);

            onProjectUpdated({
                ...project,
                pitch_sections: updatedSections,
                status: 'pitching',
            });

        } catch (error) {

            console.error(
                'Failed to regenerate pitch section:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to regenerate this section.'
            );

        } finally {

            setRegeneratingId(null);
        }
    };


    /* =========================
       LOADING
    ========================= */

    if (pitchState === 'loading') {

        return (
            <section className="analyze-loading-state">

                <div className="analyze-loading-title">
                    RUNNING PREFLIGHT CHECK
                </div>

                <div className="analyze-loading-bar">
                    <span />
                </div>

                <div className="analyze-loading-subtitle">
                    BUILDING YOUR PITCH....
                </div>

                <div className="analyze-loading-steps">

                    <LoadingStep
                        text="Parsing idea structure"
                        index={0}
                        currentStep={loadingStep}
                    />

                    <LoadingStep
                        text="Identifying target signals"
                        index={1}
                        currentStep={loadingStep}
                    />

                    <LoadingStep
                        text="Cross-referencing market data"
                        index={2}
                        currentStep={loadingStep}
                    />

                    <LoadingStep
                        text="Structuring pitch narrative"
                        index={3}
                        currentStep={loadingStep}
                    />

                </div>

            </section>
        );
    }


    /* =========================
       RESULT
    ========================= */

    if (
    pitchState === 'result' &&
    sections.length > 0
) {

    const completedSections =
        sections.filter(
            (section) =>
                section.content?.trim()
        ).length;

    return (
        <section className="pitch-stage">

            {/* =========================
               HEADING
            ========================= */}

            <div className="pitch-heading-row">

                <div className="workspace-stage-heading">

                    <p>
                        05 / PITCH
                    </p>

                    <h2>
                        Get launch-ready.
                    </h2>

                </div>

                <div className="pitch-readiness">

                    <div className="pitch-readiness-label">
                        PITCH READINESS
                    </div>

                    <div className="pitch-readiness-value">

                        <strong>
                            {completedSections}
                        </strong>

                        <span>
                            / {sections.length}
                        </span>

                        <em>
                            SECTIONS COMPLETE
                        </em>

                    </div>

                </div>

            </div>


            {error && (
                <div className="workspace-inline-error">
                    {error}
                </div>
            )}


            {/* =========================
               SECTIONS
            ========================= */}

            <div className="pitch-sections">

                {sections.map(
                    (section, index) => (

                        <PitchSectionCard
                            key={section.id}
                            section={section}
                            index={index}
                            editing={
                                editingId === section.id
                            }
                            editContent={editContent}
                            setEditContent={
                                setEditContent
                            }
                            saving={
                                savingId === section.id
                            }
                            regenerating={
                                regeneratingId === section.id
                            }
                            onEdit={handleEdit}
                            onCancel={
                                handleCancelEdit
                            }
                            onSave={
                                handleSaveSection
                            }
                            onRegenerate={
                                handleRegenerate
                            }
                        />

                    )
                )}

            </div>


            {/* =========================
               ACTIONS
            ========================= */}

            <div className="pitch-actions">

                <button
                    type="button"
                    className="pitch-save-button"
                >
                    SAVE PITCH
                </button>

                <button
                    type="button"
                    className="pitch-launch-button"
                    disabled
                >
                    VIEW LAUNCH READINESS →
                </button>

            </div>

        </section>
    );
}


    /* =========================
       READY
    ========================= */

    return (
        <section className="pitch-stage">

            <div className="workspace-stage-heading">

                <p>
                    05 / PITCH
                </p>

                <h2>
                    Get launch-ready.
                </h2>

            </div>


            <p className="analyze-description">
                Turn everything we've learned about your idea
                into a clear, structured pitch.
            </p>


            {error && (
                <div className="workspace-inline-error">
                    {error}
                </div>
            )}


            <div className="analyze-ready-card">

                <div className="analyze-card-label">
                    READY TO BUILD
                </div>

                <p className="analyze-ready-text">
                    Build an investor-ready pitch for{' '}
                    <strong>{project.name}</strong>
                    {' '}using your analysis and applied improvements.
                </p>

                <button
                    type="button"
                    className="workspace-primary-button"
                    onClick={handleBuildPitch}
                >
                    BUILD MY PITCH →
                </button>

            </div>

        </section>
    );
}


/* =========================
   PITCH SECTION CARD
========================= */

function PitchSectionCard({
    section,
    index,
    editing,
    editContent,
    setEditContent,
    saving,
    regenerating,
    onEdit,
    onCancel,
    onSave,
    onRegenerate,
}) {

    const sectionNumber =
        String(index + 1).padStart(2, '0');

    const sectionName =
        getSectionName(section.section_type);

    return (
        <section className="analyze-card pitch-section-card">

            <div className="analyze-card-header pitch-section-header">

                <span>
                    {sectionNumber} {sectionName}
                </span>

                <div className="pitch-section-actions">

                    <button
                        type="button"
                        className="pitch-text-button"
                        onClick={() =>
                            onRegenerate(section)
                        }
                        disabled={regenerating || editing}
                    >
                        {regenerating
                            ? 'REGENERATING...'
                            : 'REGENERATE'}
                    </button>

                    {!editing && (
                        <button
                            type="button"
                            className="pitch-text-button edit"
                            onClick={() =>
                                onEdit(section)
                            }
                            disabled={regenerating}
                        >
                            EDIT
                        </button>
                    )}

                </div>

            </div>


            <div className="analyze-card-body">

                {editing ? (

                    <div className="pitch-edit-area">

                        <textarea
                            value={editContent}
                            onChange={(event) =>
                                setEditContent(
                                    event.target.value
                                )
                            }
                        />

                        <div className="pitch-edit-actions">

                            <button
                                type="button"
                                className="pitch-cancel-button"
                                onClick={onCancel}
                                disabled={saving}
                            >
                                CANCEL
                            </button>

                            <button
                                type="button"
                                className="pitch-save-section-button"
                                onClick={() =>
                                    onSave(section)
                                }
                                disabled={saving}
                            >
                                {saving
                                    ? 'SAVING...'
                                    : 'SAVE'}
                            </button>

                        </div>

                    </div>

                ) : (

                    <p className="pitch-section-content">
                        {section.content}
                    </p>

                )}

            </div>

        </section>
    );
}


/* =========================
   SECTION NAMES
========================= */

function getSectionName(sectionType) {

    const names = {
        problem: 'PROBLEM',
        solution: 'SOLUTION',
        target_audience: 'TARGET AUDIENCE',
        value_proposition: 'VALUE PROPOSITION',
        core_features: 'CORE FEATURES',
        business_model: 'BUSINESS MODEL',
        competitive_advantage: 'COMPETITIVE ADVANTAGE',
        go_to_market: 'GO-TO-MARKET',
    };

    return names[sectionType] ?? sectionType;
}


/* =========================
   LOADING STEP
========================= */

function LoadingStep({
    text,
    index,
    currentStep,
}) {

    const completed =
        index < currentStep;

    const current =
        index === currentStep;

    return (
        <div
            className={`analyze-loading-step ${
                completed ? 'completed' : ''
            } ${
                current ? 'current' : ''
            } ${
                index > currentStep ? 'pending' : ''
            }`}
        >

            <span className="step-dot">
                {completed ? '✓' : ''}
            </span>

            <span>
                {text}
            </span>

        </div>
    );
}


export default PitchStage;