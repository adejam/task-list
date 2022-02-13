import React, { useEffect, useState } from "react";
import Alert from "./components/Alert";
import TaskList from "./components/TaskList";
import useFetch from "./CustomHooks/useFetch";

function App() {
  const [alert, setAlert] = useState("");
  const {data: tasks, error} = useFetch('get-tasks');
  useEffect(() => {
    setAlert(error);
  }, [error])
  
  const closeAlert = () => {
    setAlert("");
  }

  return (
    <div className="app">
      <header>
        <h1>Task App</h1>
      </header>
      <main>
          <Alert alert={alert} closeAlert={closeAlert}/>
          <TaskList tasks={tasks} setError={setAlert}/>
      </main>
    </div>
  );
}

export default App;
