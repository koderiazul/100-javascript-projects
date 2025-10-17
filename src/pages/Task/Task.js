const Task = {
  view: () => `
    <div>
      <h1>Task Page</h1>    
      <p>This is the task page. Select a task to view details.</p>
    </div>
  `,
  mount: () => {
    console.log("Task page mounted");
  },
};

export default Task;