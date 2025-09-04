import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Stratmaker from "./pages/stratmaker";
import SavedCanvasesPage from "./pages/strats";
import SettingsPage from "./pages/settings";
import MapsPage from "./pages/maps";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/stratmaker" element={<Stratmaker />} />
          <Route path="/strats" element={<SavedCanvasesPage />} />
          <Route path="/stratmaker/:name" element={<Stratmaker />} />
          <Route path="/maps" element={<MapsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
