import { NavLink, Link, Outlet } from 'react-router';
import './AppLayout.css';

function AppLayout() {
    return (
        <div className="app-layout">
            <aside className="sidebar">
               <Link to="/" className="logo-link">
                    <div className="logo">
                        <div className="logo-icon"><svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
                        </svg></div>
                        <span>PREFLIGHT</span>
                    </div>
               </Link>

                <div className="navigation-title">
                    NAVIGATION
                </div>

                <nav className="navigation">
                    <NavLink to="/overview">
                        <span><svg viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="3" width="8" height="8" rx="2" />
                                <rect x="13" y="3" width="8" height="8" rx="2" />
                                <rect x="3" y="13" width="8" height="8" rx="2" />
                                <rect x="13" y="13" width="8" height="8" rx="2" />
                            </svg></span>
                        Overview
                    </NavLink>

                    <NavLink to="/projects" end>
                        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="2" y="7" width="20" height="14" rx="3" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg></span>
                        Projects
                    </NavLink>

                    <NavLink to="/projects/new">
                        <span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="9" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg></span>
                        New Project
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    DON'T LAUNCH BLIND.
                </div>

            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;