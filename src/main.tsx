import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { consumeInviteToken } from "./lib/gallerySession";
import "./styles.css";

const initialInviteToken = consumeInviteToken();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App initialInviteToken={initialInviteToken} />
  </StrictMode>,
);
