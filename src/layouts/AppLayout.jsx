import { NavLink, Outlet } from 'react-router';
import './AppLayout.css';

function AppLayout() {
    return (
        <div className="app-layout">
            <aside className="sidebar">

                <div className="logo">
                    <div className="logo-icon">↗</div>
                    <span>PREFLIGHT</span>
                </div>

                <div className="navigation-title">
                    NAVIGATION
                </div>

                <nav className="navigation">
                    <NavLink to="/overview">
                        <span>▦</span>
                        Overview
                    </NavLink>

                    <NavLink to="/projects">
                        <span>▣</span>
                        Projects
                    </NavLink>

                    <NavLink to="/projects/new">
                        <span>⊕</span>
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