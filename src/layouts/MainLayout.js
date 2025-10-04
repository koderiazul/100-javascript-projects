const MainLayout = (content) => `
  <header>
    <nav>
      <a href="/" data-link>Home</a>
      <a href="/seven-seg-clock" data-link>Clock</a>
      <a href="/contact" data-link>Contact</a>
    </nav>
  </header>

  <main id="page-content">
    ${content}
  </main>

  <footer>
    <p>© 2025 - footer</p>
  </footer>
`;

export default MainLayout;
