import React, { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Alert from "./components/Alert";
import TaskList from "./components/TaskList";
import useFetch from "./CustomHooks/useFetch";
import { TaskType } from "./types/taskType";
import { DataFromFetchTasksRequest } from "./types/typesFromRequest";

function App() {
  const [alert, setAlert] = useState("");
  const [isCalled, setIsCalled] = useState(true);
  const setTheIsCalled = (value: boolean) => {
    setIsCalled(value);
  }
  const { data: tasksFetched, error }: DataFromFetchTasksRequest =
    useFetch("get-tasks", isCalled, setTheIsCalled);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAlert(error);
    setTasks(tasksFetched);
  }, [error, tasksFetched]);
  const closeAlert = () => {
    setAlert("");
  };

  const addNewTaskToTasks = (task: TaskType): void => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="app">
      <header>
        <h1>Task App</h1>
      </header>
      <main>
        <>{isLoading && <div>Is Loading</div>}</>
        <AddTask
          addNewTaskToTasks={addNewTaskToTasks}
          setAlert={setAlert}
          setIsLoading={setIsLoading}
        />
        <Alert alert={alert} closeAlert={closeAlert} />
        <TaskList tasks={tasks} setError={setAlert} setTheIsCalled={setTheIsCalled}/>
      </main>
    </div>
  );
}

export default App;
