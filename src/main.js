import { router } from "./router/router.js";
import "./style.css";

// Run router on first load
document.addEventListener("DOMContentLoaded", () => {
  router();
});
