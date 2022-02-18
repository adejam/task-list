import { ITaskType } from "./taskType";

export interface DataFromAddTaskRequest {
  message: string;
  task: ITaskType;
}

export interface DataFromFetchTasksRequest {
  data: ITaskType[];
  error: string;
}
