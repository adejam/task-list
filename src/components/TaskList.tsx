import Axios from "axios";
import { useEffect, useState } from "react";
import { config } from "../config";
import { TaskType } from "../types/taskType";

interface TaskListProps {
  tasks: TaskType[];
  setError: (arg0: string) => void
}

const TaskList = ({ tasks, setError }: TaskListProps) => {
    const initialValue = {id: 0, label: ""};
    const [newDebounceObject, setNewDebounceObject] = useState(initialValue);
    const [taskObject, setTaskObject] = useState(initialValue);
    const [labelError, setLabelError] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
            setNewDebounceObject({id: taskObject.id, label: taskObject.label});
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      }, [taskObject.id, taskObject.label]);
      const updateTask = (id: number) => {
          if(newDebounceObject.label) {
           Axios.put(`update-task/${id}`, newDebounceObject, config)
          .catch((e) => {
            if (e.message === "Request failed with status code 400") {
                setError("duplicate task cannot be added");
            }
          });
          setLabelError("");
          } else {
            setLabelError("Label cannot be empty")
          }
          
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
          {task.label} {task.sort_order}
          <input
            type="text"
            value={(taskObject.id === task.id) ? taskObject.label : task.label}
            onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTaskObject({...taskObject, id: task.id, label:e.target.value})
            }}
            />
            <div>{labelError && labelError}</div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
