import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Record from "@/pages/Record";
import History from "@/pages/History";
import Trends from "@/pages/Trends";

export default function App() {
  return (
    <Router basename={import.meta.env.PROD ? "/emotion-record-app" : "/"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/record" element={<Record />} />
        <Route path="/history" element={<History />} />
        <Route path="/trends" element={<Trends />} />
      </Routes>
    </Router>
  );
}
