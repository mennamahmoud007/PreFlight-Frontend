import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import api from '../services/api';

import './PresentationPreview.css';

const sectionTitles = {
    problem: 'THE PROBLEM',
    solution: 'THE SOLUTION',
    target_audience: 'TARGET AUDIENCE',
    value_proposition: 'VALUE PROPOSITION',
    core_features: 'CORE FEATURES',
    business_model: 'BUSINESS MODEL',
    competitive_advantage: 'COMPETITIVE ADVANTAGE',
    go_to_market: 'GO-TO-MARKET',
};
function splitContent(content, maxCharacters = 750) {

    if (!content) {
        return [''];
    }

    const sentences = content.match(
        /[^.!?]+[.!?]+|[^.!?]+$/g
    ) || [content];

    const chunks = [];
    let currentChunk = '';

    sentences.forEach((sentence) => {

        const cleanSentence = sentence.trim();

        const nextChunk = currentChunk
            ? `${currentChunk} ${cleanSentence}`
            : cleanSentence;

        if (
            nextChunk.length <= maxCharacters
        ) {
            currentChunk = nextChunk;
            return;
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        currentChunk = cleanSentence;
    });

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

function PresentationPreview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);

                setProject(response.data.data);
            } catch (error) {
                console.error(
                    'Failed to load presentation:',
                    error
                );

                setError('Failed to load presentation.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const slides = useMemo(() => {
        if (!project) {
            return [];
        }

        const pitchSections = project.pitch_sections ?? [];

        const valueProposition =
            pitchSections.find(
                (section) =>
                    section.section_type === 'value_proposition'
            )?.content;

        const solution =
            pitchSections.find(
                (section) =>
                    section.section_type === 'solution'
            )?.content;

        const pitchSlides = pitchSections
            .filter(
                (section) =>
                    sectionTitles[section.section_type]
            )
            .flatMap((section) => {

                const contentParts =
                    splitContent(section.content);

                return contentParts.map(
                    (content, index) => ({

                        type: 'pitch',

                        sectionType:
                            section.section_type,

                        title:
                            index === 0
                                ? sectionTitles[
                                    section.section_type
                                ]
                                : `${sectionTitles[
                                    section.section_type
                                ]} — CONTINUED`,

                        content,

                        part: index + 1,

                        totalParts:
                            contentParts.length,
                    })
                );
            });

        return [
            {
                type: 'cover',
                title: project.name,
                subtitle:
                    valueProposition ||
                    solution ||
                    project.description,
                industry: project.industry,
            },

            ...pitchSlides,

            {
                type: 'thank-you',
                title: 'THANK YOU',
                subtitle: 'Ready for the next step?',
                projectName: project.name,
            },
        ];
    }, [project]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                setCurrentSlide((current) =>
                    Math.min(current + 1, slides.length - 1)
                );
            }

            if (event.key === 'ArrowLeft') {
                setCurrentSlide((current) =>
                    Math.max(current - 1, 0)
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [slides.length]);

    const goToNext = () => {
        setCurrentSlide((current) =>
            Math.min(current + 1, slides.length - 1)
        );
    };

    const goToPrevious = () => {
        setCurrentSlide((current) =>
            Math.max(current - 1, 0)
        );
    };

    if (loading) {
        return (
            <div className="presentation-page">
                <div className="presentation-loading">
                    Loading presentation...
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="presentation-page">
                <div className="presentation-error">
                    {error || 'Presentation not found.'}
                </div>
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <div className="presentation-page">
                <div className="presentation-error">
                    No presentation available yet.
                </div>
            </div>
        );
    }

    const slide = slides[currentSlide];

    return (
        <div className="presentation-page">

            <header className="presentation-topbar">

                <button
                    type="button"
                    className="presentation-back-button"
                    onClick={() =>
                        navigate(`/project/${project.id}`)
                    }
                >
                    ← BACK TO PREFLIGHT
                </button>

                <div className="presentation-project-info">
                    <span className="presentation-project-label">
                        PRESENTATION
                    </span>

                    <span className="presentation-project-name">
                        {project.name}
                    </span>
                </div>

                <div className="presentation-slide-counter">
                    {String(currentSlide + 1).padStart(2, '0')}
                    {' / '}
                    {String(slides.length).padStart(2, '0')}
                </div>

            </header>

            <main className="presentation-content">

                <section className="presentation-frame">

                    <PresentationSlide
                        slide={slide}
                    />

                </section>

                <div className="presentation-controls">

                    <button
                        type="button"
                        className="presentation-nav-button"
                        onClick={goToPrevious}
                        disabled={currentSlide === 0}
                    >
                        ← PREVIOUS
                    </button>

                    <div className="presentation-progress">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`presentation-dot ${
                                    index === currentSlide
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={() =>
                                    setCurrentSlide(index)
                                }
                                aria-label={`Go to slide ${
                                    index + 1
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="presentation-nav-button"
                        onClick={goToNext}
                        disabled={
                            currentSlide ===
                            slides.length - 1
                        }
                    >
                        NEXT →
                    </button>

                </div>

                <div className="presentation-footer">

                    <div className="presentation-footer-note">
                        {slide.type === 'cover'
                            ? 'PREFLIGHT PRESENTATION'
                            : slide.type === 'thank-you'
                                ? 'END OF PRESENTATION'
                                : `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`
                        }
                    </div>

                </div>

                <button
                    type="button"
                    className="presentation-download-button"
                    disabled
                >
                    DOWNLOAD PDF 
                </button>

            </main>

        </div>
    );
}

function PresentationSlide({ slide }) {

    if (slide.type === 'cover') {
        return (
            <article className="presentation-slide presentation-cover-slide">

                <div className="presentation-slide-grid" />

                <div className="presentation-cover-content">

                    <div className="presentation-cover-kicker">
                        PREFLIGHT / PRESENTATION
                    </div>

                    <h1 className="presentation-cover-title">
                        {slide.title}
                    </h1>

                    <p className="presentation-cover-subtitle">
                        {slide.subtitle}
                    </p>

                    <div className="presentation-cover-meta">
                        {slide.industry}
                    </div>

                </div>

                <div className="presentation-slide-number">
                    01
                </div>

            </article>
        );
    }

    if (slide.type === 'thank-you') {
        return (
            <article className="presentation-slide presentation-thank-you-slide">

                <div className="presentation-thank-you-accent" />

                <div className="presentation-thank-you-content">

                    <div className="presentation-cover-kicker">
                        PREFLIGHT COMPLETE
                    </div>

                    <h1 className="presentation-thank-you-title">
                        {slide.title}
                    </h1>

                    <p className="presentation-thank-you-subtitle">
                        {slide.subtitle}
                    </p>

                    <div className="presentation-thank-you-project">
                        {slide.projectName}
                    </div>

                </div>

                <div className="presentation-thank-you-brand">
                    PRELIGHT
                </div>

            </article>
        );
    }

return (
    <article className="presentation-slide presentation-content-slide">

        <div className="presentation-content-slide-top">

            <span className="presentation-slide-kicker">
                PREFLIGHT
            </span>

            <span className="presentation-slide-section">
                {slide.title}
            </span>

        </div>

        <div className="presentation-content-slide-body">

            <h1 className="presentation-content-title">
                {slide.title}
            </h1>

            <div className="presentation-content-line" />

            <SlideText content={slide.content} />

        </div>

    </article>
);
}
function SlideText({ content }) {

    const textLength =
        content?.length ?? 0;

    let fontSize = 27;

    if (textLength > 500) {
        fontSize = 23;
    }

    if (textLength > 650) {
        fontSize = 20;
    }

    return (
        <p
            className="presentation-content-text"
            style={{
                fontSize: `${fontSize}px`,
            }}
        >
            {content}
        </p>
    );
}

export default PresentationPreview;