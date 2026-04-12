import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.__APP_ENTRY__ = "main";
document.body.classList.add("main-entry");

createRoot(document.getElementById("root")!).render(<App />);
