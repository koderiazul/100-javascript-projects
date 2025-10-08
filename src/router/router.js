import routes from "./routes.js";
import MainLayout from "../layouts/project-layout.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = () => {
  const potentialMatches = routes.map((route) => ({
    route,
    isMatch: location.pathname === route.path,
  }));

  let match = potentialMatches.find((m) => m.isMatch);

  if (!match) {
    match = {
      route: {
        path: "/404",
        view: () => "<h1>404 - Page not found</h1>",
      },
      isMatch: true,
    };
  }

  const pageContent = match.route.view();
  const layout = match.route.layout || MainLayout;
  document.querySelector("#app").innerHTML = layout(pageContent);

  if (typeof match.route.mount === "function") {
    match.route.mount();
  }

  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === location.pathname) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

window.addEventListener("popstate", router);
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

export { router, navigateTo };
