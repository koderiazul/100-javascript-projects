const ProjectLayout = (content) => `
  <header>
    <h1>100 JavaScript Projects</h1>
    <nav>
      <a href="/" data-link>Home</a>
      <a href="/seven-seg-clock" data-link>Clock</a>
      <a href="/stopwatch" data-link>Stopwatch</a>
      <a href="/image-gallery" data-link>Image Gallery</a>
      <a href="/calculator" data-link>Calculator</a>
      <a href="/tint-shade-maker" data-link>Tint Shade Maker</a>
    </nav>
  </header>

  <main id="page-content">
    ${content}
  </main>

  <footer>
    <p>© 2025 - footer</p>
  </footer>
`;

export default ProjectLayout;
