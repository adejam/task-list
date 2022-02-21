import { FormEvent, useState } from "react";
import { ITaskType } from "../types/taskType";
import TasksApi from "../api/tasksApi";
import { ILabelValue } from "../types/otherTypes";

interface AddTaskProps {
  addNewTaskToTasks: (task: ITaskType) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<React.SetStateAction<string>>;
}

const AddTask = ({
  addNewTaskToTasks,
  setIsLoading,
  setAlert,
}: AddTaskProps) => {
  const [newTaskValue, setNewTaskValue] = useState({ label: "" });
  const [taskInputError, setTaskInputError] = useState("");

  const addTask = async (newTaskValue: ILabelValue) => {
    const {result, error} = await TasksApi.addTask(newTaskValue);
    if (!error) {
      addNewTaskToTasks(result.task);
      setAlert(result.message);
      setIsLoading(false);
      setNewTaskValue({ ...newTaskValue, label: "" });
    } else {
      setAlert("duplicate task cannot be added");
    }
  } 

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTaskValue.label) {
      setTaskInputError("label field is required");
    } else {
      setIsLoading(true);
      addTask(newTaskValue);
      setIsLoading(false);
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
