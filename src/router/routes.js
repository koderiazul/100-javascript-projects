import SevenSegClock from "../pages/seven-seg-clock/seven-seg-clock.js";
import MainLayout from "../layouts/main-layout.js";
import ProjectLayout from "../layouts/project-layout.js";

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
    path: "/contact",
    view: () => `
      <h1>Contact Page</h1>
      <form>
        <label>Name: <input type="text" /></label><br><br>
        <label>Email: <input type="email" /></label><br><br>
        <button type="submit">Send</button>
      </form>
    `,
  },
];

export default routes;
