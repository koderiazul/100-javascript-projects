import { routes } from './routes.js';

const app = document.getElementById('app');

function matchRoute(path, routeList = routes) {
  // Sort routes so static paths come before dynamic ones
  const sortedRoutes = [...routeList].sort((a, b) => {
    const aDynamic = a.path.includes(':');
    const bDynamic = b.path.includes(':');
    if (aDynamic === bDynamic) return 0;
    return aDynamic ? 1 : -1; // static first
  });

  for (const route of sortedRoutes) {
    // 1️⃣ Exact match wins immediately
    if (route.path === path) return route;

    // 2️⃣ Handle dynamic paths (/tasks/:id)
    const dynamicPattern = route.path.replace(/:[^/]+/g, '([^/]+)');
    const regex = new RegExp(`^${dynamicPattern}$`);
    const match = path.match(regex);
    if (match) {
      const paramNames = (route.path.match(/:([^/]+)/g) || []).map((p) => p.slice(1));
      const params = Object.fromEntries(paramNames.map((n, i) => [n, match[i + 1]]));
      return { ...route, params };
    }

    // 3️⃣ Recurse into child routes
    if (route.children) {
      const matchedChild = matchRoute(path, route.children);
      if (matchedChild) return matchedChild;
    }
  }

  return null;
}


export async function navigateTo(path) {
  history.pushState({}, '', path);
  await renderRoute(path);
}

// export async function renderRoute(path = location.pathname) {
//   const matchedRoute = matchRoute(path);
//   if (!matchedRoute) {
//     app.innerHTML = `<h1>404 - Page Not Found</h1>`;
//     return;
//   }

//   const module = await matchedRoute.component();
//   app.innerHTML = module.default.view(matchedRoute.params || {});
//   if (module.default.mount) module.default.mount();
// }

export async function renderRoute(path = location.pathname) {
  const matchedRoute = matchRoute(path);
  if (!matchedRoute) {
    app.innerHTML = `<h1>404 - Page Not Found</h1>`;
    return;
  }

  let module;
  const { component } = matchedRoute;

  // ✅ Support both: static import OR lazy import
  if (typeof component === 'function') {
    const result = await component();
    module = result.default ? result.default : result;
  } else {
    module = component.default ? component.default : component;
  }

  app.innerHTML = module.view(matchedRoute.params || {});
  if (typeof module.mount === 'function') module.mount();
}


// Listen for browser navigation
window.addEventListener('popstate', () => renderRoute());

// Intercept <a> links
document.addEventListener('click', (e) => {
  if (e.target.matches('a[data-link]')) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});
