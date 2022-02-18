export interface ITaskType extends ITaskSortValue {
  label: string;
  completed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ITaskValues {
  id?: number;
  label?: string;
  sort_order?: number;
  task_completed_status?: boolean;
}

export interface ITaskSortValue {
  id: number;
  sort_order: number;
}
