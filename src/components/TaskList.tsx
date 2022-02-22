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
  setError: React.Dispatch<
    React.SetStateAction<{ text: string; type: string }>
  >;
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
      <div key={task.id} className="task-card">
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            value={taskObject.id === task.id ? taskObject.value : task.label}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeLabelValue(task.id, e.target.value);
            }}
            className="dynamic-input full-width"
          />
          <div>
            {labelError.id === task.id && labelError && labelError.error}
          </div>
        </div>
        <div></div>
        <div className="checkmark-div">
          {task.completed_at === task.created_at ? (
            <button
              className="checkmark-btn"
              type="button"
              onClick={() => markTaskComplete(task.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width={50}
                fill={task.completed_at === task.created_at ? "black" : "green"}
              >
                <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
              </svg>
              {/* complete task */}
            </button>
          ) : (
            <button
              type="button"
              className="checkmark-btn"
              onClick={() => markTaskInComplete(task.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width={50}
                fill={task.completed_at === task.created_at ? "black" : "green"}
              >
                <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
              </svg>
              {/* incomplete task */}
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
  const { newDebounceObject, setNewDebounceObject } = useDebounce(
    taskObject,
    1000
  );
  const updateTask = async (id: number, values: ITaskValues) => {
    const { result, error } = await TasksApi.updateTask(id, values);
    if (result) {
      if (!values.sort_order) {
        setTheIsCalled(true);
      }
    } else {
      setError({ text: error, type: "failure" });
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
