const StatsCard = {
  view: () => `
    <div class="card" style="border: 1px solid #ccc; padding: 16px; border-radius: 8px; width: 200px; cursor: pointer;">
      <h2>Performance</h2>
      <p>Great progress this week 🎉</p>
    </div>
  `,
  mount: () => {
    const card = document.querySelector('.card');
    card.addEventListener('click', () => alert('Card clicked!'));
  }
};

export default StatsCard;
