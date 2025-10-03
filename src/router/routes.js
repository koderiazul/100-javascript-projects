const routes = [
  {
    path: "/",
    view: () => `
      <h1>Home Page</h1>
      <p>Welcome to the homepage of our SPA!</p>
    `,
  },
  {
    path: "/about",
    view: () => `
      <h1>About Page</h1>
      <p>This is a simple single-page app using vanilla JS and Vite.</p>
    `,
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
