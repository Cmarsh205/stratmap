import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/ui/sidebar";
import Landing from "./pages/landing";
import Stratmaker from "./pages/stratmaker";
import SavedCanvasesPage from "./pages/strats";

const Dashboard = () => <div className="p-4">Dashboard Page</div>;
const Settings = () => <div className="p-4">Settings Page</div>;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stratmaker" element={<Stratmaker />} />
            <Route path="/strats" element={<SavedCanvasesPage />} />
            <Route path="/strats/:name" element={<Stratmaker />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
