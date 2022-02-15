import Axios from "axios";
import { useEffect, useState } from "react";
import { config } from "../config";
import { TaskType } from "../types/taskType";

interface TaskListProps {
  tasks: TaskType[]
  setError: (arg0: string) => void
  setTheIsCalled: (value: boolean) => void
}

type AllValues = {
  id?: number
  label?: string
  sort_order?: number
  task_completed_status?: boolean
}

const TaskList = ({ tasks, setError, setTheIsCalled }: TaskListProps) => {
  const initialValue = { id: 0, label: "" };
  const [newDebounceObject, setNewDebounceObject] = useState(initialValue);
  const [taskObject, setTaskObject] = useState(initialValue);
  const [labelError, setLabelError] = useState({id: 0, error: ""});
  useEffect(() => {
    const timer = setTimeout(() => {
      setNewDebounceObject({ id: taskObject.id, label: taskObject.label });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [taskObject.id, taskObject.label]);
  const updateTask = (id: number, values: AllValues) => {
      Axios.put(`update-task/${id}`, values, config).then(()=> {
        setTheIsCalled(true)
      }).catch((e) => {
        if (e.message === "Request failed with status code 400") {
          setError("duplicate task cannot be added");
        }
      });
      setLabelError({id, error: ""});
  };

  useEffect(() => {
    if (newDebounceObject.id && newDebounceObject.label) {
      updateTask(newDebounceObject.id, newDebounceObject);
      setNewDebounceObject({ id: 0, label: "" });
    }
  }, [newDebounceObject.id, newDebounceObject.label]);
  const changeLabelValue = (id: number, labelValue: string) => {
    setTaskObject({
      ...taskObject,
      id: id,
      label: labelValue,
    });
    if (labelValue.length < 1) {
      setLabelError({id, error: "Label cannot be empty"});
    }
    
  }
  const markTaskComplete = (id: number) => {
    updateTask(id, {task_completed_status: true});
  };

  const markTaskInComplete = (id: number) => {
    updateTask(id, {task_completed_status: false});
  };

  const sortTask = (id: number, value: string) => {
    updateTask(id, {sort_order: parseInt(value)});
  }
  return (
    <div>
      {tasks.map((task) => {
        const sortedTasks = tasks.filter((t) => t.id !== task.id);
        return(
        <div key={task.id} style={{ marginTop: 70 }}>
          {task.label} {task.sort_order}
          <div>
            <input
              type="text"
              value={taskObject.id === task.id ? taskObject.label : task.label}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                changeLabelValue(task.id, e.target.value)
              }}
            />
            <div>{(labelError.id === task.id && labelError) && labelError.error}</div>
          </div>
          <div>
            <select onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sortTask(task.id, e.target.value)}}>
              <option value={task.sort_order}>{task.sort_order}</option>
              {sortedTasks.map((tSort) => (
                <option key={tSort.id} value={tSort.sort_order}>{`${tSort.label}  ${tSort.sort_order}`}</option> 
              ))}
            </select>
          </div>
          <div>
            {task.completed_at} <br />
            {task.created_at}
            {task.completed_at === task.created_at ? (
              <button type="button" onClick={() => markTaskComplete(task.id)}>
                Mark Complete
              </button>
            ) : (
              <button type="button" onClick={() => markTaskInComplete(task.id)}>
                Mark Incomplete
              </button>
            )}
          </div>
        </div>
      )})}
    </div>
  );
};

export default TaskList;
