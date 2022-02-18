export interface TaskType extends ITaskSortValue  {
  
  label: string;
  completed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ITaskSortValue {
  id: number;
  sort_order: number;
}
