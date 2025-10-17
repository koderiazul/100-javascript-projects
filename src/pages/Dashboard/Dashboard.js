import StatsCard from './components/StatsCard.js';

const Dashboard = {
  view: () => `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="cards">${StatsCard.view()}</div>
    </div>
  `,
  mount: () => {
    console.log('Dashboard loaded');
  },
};

export default Dashboard;
