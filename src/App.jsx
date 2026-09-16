import { BrowserRouter, Routes, Route } from 'react-router';
import AppLayout from './layouts/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Overview from './pages/Overview.jsx';
import Projects from './pages/Projects.jsx';
import NewProject from './pages/NewProject.jsx';
import ProjectWorkspace from './pages/ProjectWorkspace.jsx';
import PresentationPreview from './pages/PresentationPreview.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<AppLayout />}>
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/new" element={<NewProject />} />
                  <Route path="/project/:id" element={<ProjectWorkspace />} />
                  <Route path="/project/:id/presentation" element={<PresentationPreview />} />
              </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;