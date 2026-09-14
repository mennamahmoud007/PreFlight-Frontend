import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import './NewProject.css';

const industries = [
    'EdTech',
    'FinTech',
    'HealthTech',
    'HR Tech',
    'Developer Tools',
    'E-commerce',
    'SaaS / B2B',
    'Consumer Social',
    'Marketplace',
    'EdTech / Social',
    'CleanTech',
    'Logistics',
    'Other',
];

function NewProject() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        description: '',
        target_audience: '',
        industry: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [customIndustry, setCustomIndustry] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'custom_industry') {
            setCustomIndustry(value);
            return;
        }

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };
    

    const createProject = async (redirectTo) => {
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...form,
                industry: form.industry === 'Other' ? customIndustry : form.industry,
            };            
            const response = await api.post('/projects', payload);
            const project = response.data.data;
            navigate(redirectTo(project));
        } catch (error) {
            console.error('Failed to save project:', error);

            const validationErrors = error.response?.data?.errors;
            const firstFieldError = validationErrors
                ? Object.values(validationErrors)[0]?.[0]
                : null;

            setError(
                firstFieldError ||
                error.response?.data?.message ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createProject((project) => `/project/${project.id}`);
    };

    const handleSaveDraft = () => {
        createProject(() => '/projects');
    };
    return (
        <div className="new-project-page">
            <div className="new-project-header">
                <div className="header-content">
                    <div className="page-kicker">STEP 01 / CHECK</div>

                    <h1>START YOUR PREFLIGHT</h1>

                    <p>
                        Give us the idea. We'll find what needs checking.
                    </p>
                </div>
            </div>

            <form className="project-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="name">PROJECT NAME</label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. CampusGo"
                    />
                </div>

                <div className="form-field">
                    <div className="field-header">
                        <label htmlFor="description">IDEA</label>

                        <span>
                            {form.description.length} chars
                        </span>
                    </div>

                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your idea in detail. What problem does it solve? How does it work? Who is it for?"
                        maxLength={1000}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="target_audience">
                        TARGET AUDIENCE
                    </label>

                    <input
                        id="target_audience"
                        name="target_audience"
                        type="text"
                        value={form.target_audience}
                        onChange={handleChange}
                        placeholder="e.g. University students aged 18–25"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="industry">INDUSTRY</label>

                    <select
                        id="industry"
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                    >
                        <option value="">Select industry...</option>

                        {industries.map((industry) => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                    {form.industry === 'Other' && (
                        <input
                            id="custom_industry"
                            name="custom_industry"
                            type="text"
                            className="custom-industry-input"
                            value={customIndustry}
                            onChange={handleChange}
                            placeholder="Enter custom industry"
                        />
                    )}
                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="start-button"
                        disabled={loading}
                    >
                        {loading ? 'STARTING...' : 'START PREFLIGHT'}
                        <span>→</span>
                    </button>

                    <button
                        type="button"
                        className="draft-button"
                        onClick={handleSaveDraft}
                        disabled={loading}
                    >
                        SAVE DRAFT
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewProject;