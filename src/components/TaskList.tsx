import { arrayMoveMutable } from "array-move";
import { useEffect, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import TasksApi from "../api/tasksApi";
import useDebounce from "../CustomHooks/useDebounce";
import { IIndex, IInputError } from "../types/otherTypes";
import { ITaskType, ITaskValues } from "../types/taskType";
import { IRequestObject } from "../types/typesFromRequest";

interface TaskListProps {
  tasks: ITaskType[];
  setError: (arg0: string) => void;
  setTheTasks: (arg0: ITaskType[]) => void;
  setTheIsCalled: (value: boolean) => void;
  setTasks: (arg0: ITaskType[]) => void;
  tasksFetched: ITaskType[];
}

interface SortableListProps extends SortableProps {
  tasks: ITaskType[];
}

interface SortableElementProps extends SortableProps {
  task: ITaskType;
}

interface SortableProps {
  markTaskComplete: (id: number) => void;
  markTaskInComplete: (id: number) => void;
  changeLabelValue: (id: number, labelValue: string) => void;
  labelError: IInputError;
  taskObject: IRequestObject;
}

const SortableItem = SortableElement(
  ({
    task,
    markTaskComplete,
    markTaskInComplete,
    changeLabelValue,
    labelError,
    taskObject,
  }: SortableElementProps) => {
    return (
      <div key={task.id} style={{ marginTop: 70 }} className="task-card">
        {task.label} {task.sort_order}
        <div>
          <input
            type="text"
            value={taskObject.id === task.id ? taskObject.value : task.label}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeLabelValue(task.id, e.target.value);
            }}
          />
          <div>
            {labelError.id === task.id && labelError && labelError.error}
          </div>
        </div>
        <div></div>
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
    );
  }
);

const SortableList = SortableContainer(
  ({
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
          <SortableItem
            key={`task-${task.id}`}
            index={index}
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
  }
);

const TaskList = ({
  tasks,
  setError,
  setTheIsCalled,
  setTheTasks,
  setTasks,
}: TaskListProps) => {
  const initialValue = { id: 0, value: "" };
  
  const [taskObject, setTaskObject] = useState(initialValue);
  const [labelError, setLabelError] = useState({ id: 0, error: "" });
  const [checkDnd, setCheckDnd] = useState(0);
  useEffect(() => {
    if (checkDnd) {
      setTheTasks(tasks);
      setCheckDnd(0);
    }
  }, [checkDnd]);
  const { newDebounceObject, setNewDebounceObject } = useDebounce(taskObject, 1000);
  const updateTask = async (id: number, values: ITaskValues) => {
    const { result, error } = await TasksApi.updateTask(id, values);
    if (result) {
      if (!values.sort_order) {
        setTheIsCalled(true);
      }
    } else {
      setError(error);
    }
    setLabelError({ id, error: "" });
  };

  useEffect(() => {
    if (newDebounceObject.id && newDebounceObject.value) {
      const label = newDebounceObject.value;
      updateTask(newDebounceObject.id, { label });
      setNewDebounceObject({ id: 0, value: "" });
    }
  }, [newDebounceObject.id, newDebounceObject.value]);
  const changeLabelValue = (id: number, labelValue: string) => {
    setTaskObject({
      ...taskObject,
      id: id,
      value: labelValue,
    });
    if (labelValue.length < 1) {
      setLabelError({ id, error: "Label cannot be empty" });
    }
  };
  const markTaskComplete = (id: number) => {
    updateTask(id, { task_completed_status: true });
  };

  const markTaskInComplete = (id: number) => {
    updateTask(id, { task_completed_status: false });
  };

  const handleSortEnd = ({ oldIndex, newIndex }: IIndex) => {
    const taskToSort = tasks[oldIndex];
    const taskToGetNewSortOrderFrom = tasks[newIndex];
    const sortValue = {
      id: taskToSort.id,
      sort_order: taskToGetNewSortOrderFrom.sort_order,
    };
    if (oldIndex === newIndex) return;
    arrayMoveMutable(tasks, oldIndex, newIndex);
    setCheckDnd(1);

    setTasks(tasks);
    updateTask(sortValue.id, { sort_order: sortValue.sort_order });
  };
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
