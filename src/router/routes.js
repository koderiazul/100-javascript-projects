import SevenSegClock from "../pages/seven-seg-clock/seven-seg-clock.js";
import MainLayout from "../layouts/main-layout.js";
import ProjectLayout from "../layouts/project-layout.js";
import Stopwatch from "../pages/stopwatch/stopwatch.js";

const routes = [
  {
    path: "/",
    view: () => `
      <h1>Home Page</h1>
      <p>Welcome to the homepage of our SPA!</p>
    `,
    layout: MainLayout,
  },
  {
    path: "/seven-seg-clock",
    view: SevenSegClock.view,
    mount: SevenSegClock.mount,
    layout: ProjectLayout,
  },
  {
    path: "/stopwatch",
    view: Stopwatch.view,
    mount: Stopwatch.mount,
    layout: ProjectLayout,
  },
];

export default routes;
