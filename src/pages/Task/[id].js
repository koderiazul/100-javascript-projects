const TaskDynamicPage = {
  view: (params) => `
    <div> 
      <h1>Task Details</h1>
      <p>Viewing details for task ID: ${params.id}</p>
    </div>
  `,
  mount: (params) => {
    console.log('Task details page mounted for ID:', params.id);
  },
};

export default TaskDynamicPage;