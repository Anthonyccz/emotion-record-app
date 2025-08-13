import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Record from "@/pages/Record";
import History from "@/pages/History";
import Trends from "@/pages/Trends";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function App() {
  return (
    <Router basename="/emotion-record-app">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 md:px-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/record" element={<Record />} />
          <Route path="/history" element={<History />} />
          <Route path="/trends" element={<Trends />} />
        </Routes>
        <PWAInstallPrompt />
      </div>
    </Router>
  );
}
