import Axios from "axios";
import React, { useEffect, useState } from "react";
import Error from "./components/Error";
import TaskList from "./components/TaskList";
import { TaskType } from "./types/taskType";

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState("");

  const getTasks = () => {
    Axios.get(`get-tasks`)
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch(() => {
        setError("an error occured while fetching tasks");
      });
  };
  useEffect(() => {
    getTasks();
  }, []);
  const closeAlert = () => {
    setError("");
  };
  return (
    <div className="app">
      <header>
        <h1>Task App</h1>
      </header>
      <main>
        <Error error={error} closeAlert={closeAlert} />
        <TaskList tasks={tasks} setError={setError}/>
      </main>
    </div>
  );
}

export default App;
