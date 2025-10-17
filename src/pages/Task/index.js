const Task = {
  view: () => `
    <div>
      <h1>Hello Page</h1>    
      <p>This is the task page. Select a task to view details.</p>
    </div>
  `,
  mount: () => {
    console.log("Hello page mounted");
  },
};

export default Task;
