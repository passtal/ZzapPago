import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import LearningCardsPage from "./pages/LearningCardsPage";
import GamePage from "./pages/GamePage";
import RankingPage from "./pages/RankingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/learning-cards" element={<LearningCardsPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
