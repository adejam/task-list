import Axios from "axios";
import { useEffect, useState } from "react";
import { isLabeledStatement } from "typescript";
import { TaskType } from "../types/taskType";

interface TaskListProps {
  tasks: TaskType[];
  setError: (arg0: string) => void
}

const TaskList = ({ tasks, setError }: TaskListProps) => {
    const initialValue = {id: 0, label: ""};
    const [newDebounceObject, setNewDebounceObject] = useState(initialValue);
    const [taskObject, setTaskObject] = useState(initialValue);
    useEffect(() => {
        const timer = setTimeout(() => {
            setNewDebounceObject({id: taskObject.id, label: taskObject.label});
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      }, [taskObject.id, taskObject.label]);
      const config = {
        headers: { "Content-Type": "application/json" }
      }
      const updateTask = (id: number) => {

          Axios.put(`update-task/${id}`, newDebounceObject, config)
          .catch((e) => {
            if (e.message === "Request failed with status code 400") {
                setError("duplicate task cannot be added")
            }
          });
      }

      useEffect(() => {
        if (newDebounceObject.id) {
            updateTask(newDebounceObject.id);
            setNewDebounceObject({id: 0, label: ""});
        }
      }, [newDebounceObject.id, newDebounceObject.label]);
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} style={{ marginTop: 70 }}>
          {task.label}
          <input
            type="text"
            value={(taskObject.id === task.id) ? taskObject.label : task.label}
            onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTaskObject({...taskObject, id: task.id, label:e.target.value})
            }}
            required />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
