import {arrayMoveMutable} from "array-move";
import Axios from "axios";
import { useEffect, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { config } from "../config";
import { TaskType } from "../types/taskType";

interface TaskListProps {
  tasks: TaskType[]
  setError: (arg0: string) => void
  setTheTasks: (arg0: TaskType[]) => void
  setTheIsCalled: (value: boolean) => void
  setTasks: (arg0: TaskType[]) => void
  tasksFetched: TaskType[]
}

interface IndexType {
  oldIndex: number
  newIndex: number
}

type AllValues = {
  id?: number
  label?: string
  sort_order?: number
  task_completed_status?: boolean
}

type LabelErrorType = {
  id: number
  error: string
}

type TaskObjectType = {
  id: number
  label: string
}

interface SortableListProps extends SortableProps {
  tasks: TaskType[],
}

interface SortableElementProps extends SortableProps {
  task: TaskType,
}

interface SortableProps {
  markTaskComplete: (id: number) => void
  markTaskInComplete: (id: number) => void
  changeLabelValue: (id: number, labelValue: string) => void
  labelError: LabelErrorType
  taskObject: TaskObjectType
}

const SortableItem = SortableElement(({
  task,
  markTaskComplete,
          markTaskInComplete,
          changeLabelValue,
          labelError,
          taskObject,
}: SortableElementProps) => {
  return <div key={task.id} style={{ marginTop: 70 }} className="task-card">
    {task.label} {task.sort_order}
    <div>
      <input
        type="text"
        value={taskObject.id === task.id ? taskObject.label : task.label}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          changeLabelValue(task.id, e.target.value);
        } } />
      <div>{(labelError.id === task.id && labelError) && labelError.error}</div>
    </div>
    <div>
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
  </div>;
});

const SortableList = SortableContainer(({
  tasks,
  markTaskComplete,
          markTaskInComplete,
          changeLabelValue,
          labelError,
          taskObject,
}: SortableListProps) => {
  return (
    <div className="board">
      {tasks.map((task, index) => (
        <SortableItem key={`task-${task.id}`} index={index}
          task={task}
          markTaskComplete={markTaskComplete}
          markTaskInComplete={markTaskInComplete}
          changeLabelValue={changeLabelValue}
          labelError={labelError}
          taskObject={taskObject}
        />
      ))}
    </div>
  );
});

const TaskList = ({ tasks, setError, setTheIsCalled, setTheTasks, setTasks }: TaskListProps) => {
  const initialValue = { id: 0, label: "" };
  const [newDebounceObject, setNewDebounceObject] = useState(initialValue);
  const [taskObject, setTaskObject] = useState(initialValue);
  const [labelError, setLabelError] = useState({id: 0, error: ""});
  const [checkDnd, setCheckDnd] = useState(0);
  useEffect(() => {
    if(checkDnd) {
      setTheTasks(tasks);
      setCheckDnd(0);
    } 
  }, [checkDnd]);
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
        if(!values.sort_order) {
          setTheIsCalled(true)
        }
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

  const handleSortEnd = ({oldIndex, newIndex}: IndexType) => {
   
    
    const taskToSort = tasks[oldIndex];
    const taskToGetNewSortOrderFrom = tasks[newIndex];
    const sortValue = {
      id: taskToSort.id,
      sort_order: taskToGetNewSortOrderFrom.sort_order
    }
    if (oldIndex === newIndex) return;
    arrayMoveMutable(tasks, oldIndex, newIndex);
    setCheckDnd(1);

    setTasks(tasks);
    updateTask(sortValue.id, {sort_order: sortValue.sort_order});
  }
  return (
    <div>
      {tasks.length > 0 && (
        <SortableList
          tasks={tasks}
          markTaskComplete={markTaskComplete}
          markTaskInComplete={markTaskInComplete}
          changeLabelValue={changeLabelValue}
          labelError={labelError}
          taskObject={taskObject}
          onSortEnd={handleSortEnd}
          lockToContainerEdges={true}
          axis="xy"
        />
      )}
    </div>
  );
};

export default SortableContainer(TaskList);
