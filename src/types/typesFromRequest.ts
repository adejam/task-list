import { TaskType } from "./taskType";

export interface DataFromAddTaskRequest {
  message: string;
  task: TaskType;
}

export interface DataFromFetchTasksRequest {
  data: TaskType[];
  error: string;
}
