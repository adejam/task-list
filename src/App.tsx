import React, { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Alert from "./components/Alert";
import TaskList from "./components/TaskList";
import useFetch from "./CustomHooks/useFetch";
import { ITaskType } from "./types/taskType";
import { DataFromFetchTasksRequest } from "./types/typesFromRequest";

function App() {
  const [alert, setAlert] = useState({ text: "", type: "" });
  const [isCalled, setIsCalled] = useState(true);
  const setTheIsCalled = (value: boolean) => {
    setIsCalled(value);
  };
  const { data: tasksFetched, error }: DataFromFetchTasksRequest = useFetch(
    "get-tasks",
    isCalled,
    setTheIsCalled
  );
  const [tasks, setTasks] = useState<ITaskType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAlert({ text: error, type: "failure" });
    setTasks(tasksFetched);
  }, [error, tasksFetched]);
  const closeAlert = () => {
    setAlert({ text: "", type: "" });
  };

  const setTheTasks = (tasks: ITaskType[]) => {
    setTasks(tasks);
  };

  const addNewTaskToTasks = (task: ITaskType): void => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="app">
      <header style={{ backgroundColor: "#fff" }}>
        <nav className="navbar container">
          <div className="navbar-brand">
            <b>Task App</b>
          </div>
        </nav>
      </header>
      <main className="container">
        <>
          {isLoading && (
            <div className="spinner-border text-info">Is Loading...</div>
          )}
        </>
        <Alert alert={alert} closeAlert={closeAlert} />
        <AddTask
          addNewTaskToTasks={addNewTaskToTasks}
          setAlert={setAlert}
          setIsLoading={setIsLoading}
        />

        <TaskList
          tasks={tasks}
          setError={setAlert}
          setTheTasks={setTheTasks}
          setTheIsCalled={setTheIsCalled}
          setTasks={setTasks}
          tasksFetched={tasksFetched}
        />
      </main>
    </div>
  );
}

export default App;
