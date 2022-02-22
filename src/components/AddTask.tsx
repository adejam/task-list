import { FormEvent, useState } from "react";
import { ITaskType } from "../types/taskType";
import TasksApi from "../api/tasksApi";
import { ILabelValue } from "../types/otherTypes";

interface AddTaskProps {
  addNewTaskToTasks: (task: ITaskType) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<
    React.SetStateAction<{ text: string; type: string }>
  >;
}

const AddTask = ({
  addNewTaskToTasks,
  setIsLoading,
  setAlert,
}: AddTaskProps) => {
  const [newTaskValue, setNewTaskValue] = useState({ label: "" });
  const [taskInputError, setTaskInputError] = useState("");

  const addTask = async (newTaskValue: ILabelValue) => {
    const { result, error } = await TasksApi.addTask(newTaskValue);
    if (!error) {
      addNewTaskToTasks(result.task);
      setAlert({ text: result.message, type: "success" });
      setIsLoading(false);
      setNewTaskValue({ ...newTaskValue, label: "" });
    } else {
      setAlert({ text: "Duplicate task cannot be added", type: "failure" });
    }
    setTaskInputError("");
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTaskValue.label) {
      setTaskInputError("Label field is required");
    } else {
      setIsLoading(true);
      addTask(newTaskValue);
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={submitHandler} className="small-form">
      <div className="d-flex">
        <input
          type={"text"}
          value={newTaskValue.label}
          onChange={(e) =>
            setNewTaskValue({ ...newTaskValue, label: e.target.value })
          }
          className="form-input"
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </div>
      <div style={{ color: "#e84a50", padding: 5 }}>{taskInputError}</div>
    </form>
  );
};

export default AddTask;
