import { FormEvent, useState } from "react";
import { config } from "../config";
import { DataFromAddTaskRequest } from "../types/typesFromRequest";
import Axios from "axios";
import { TaskType } from "../types/taskType";

interface AddTaskProps {
    addNewTaskToTasks: (task: TaskType) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setAlert: React.Dispatch<React.SetStateAction<string>>
}

const AddTask = ({addNewTaskToTasks, setIsLoading, setAlert}: AddTaskProps) => {
    const [newTaskValue, setNewTaskValue] = useState({ label: "" });
    const [taskInputError, setTaskInputError] = useState("");

    const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!newTaskValue.label) {
          setTaskInputError("label field is required");
        } else {
          setIsLoading(true);
          Axios.post(`add-task`, newTaskValue, config)
            .then((res) => {
              const {message, task}: DataFromAddTaskRequest = res.data;
              addNewTaskToTasks(task);
              setAlert(message);
              setIsLoading(false);
              setNewTaskValue({...newTaskValue, label: ""});
            })
            .catch((e) => {
              if (e.message === "Request failed with status code 400") {
                setAlert("duplicate task cannot be added");
              }
              setIsLoading(false);
            });
        }
      };
  return (
    <form onSubmit={submitHandler}>
      <div>
        <input
          type={"text"}
          value={newTaskValue.label}
          onChange={(e) =>
            setNewTaskValue({ ...newTaskValue, label: e.target.value })
          }
        />
        <button type="submit">Add Task</button>
      </div>
      <div>{taskInputError}</div>
    </form>
  );
};

export default AddTask;
