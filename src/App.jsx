import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
