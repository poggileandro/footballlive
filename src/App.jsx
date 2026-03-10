import { useEffect } from "react";
import Home from "./pages/Home";

export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #060b14; }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
        50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
      }
      @keyframes spin    { to { transform: rotate(360deg); } }
      @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      ::-webkit-scrollbar       { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 99px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return <Home />;
}
