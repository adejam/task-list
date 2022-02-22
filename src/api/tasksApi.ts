import Axios from "axios";
import { config } from "../config";
import { ILabelValue } from "../types/otherTypes";
import { IAddTaskResult, ITaskValues } from "../types/taskType";
import { DataFromAddTaskRequest } from "../types/typesFromRequest";

class TasksApi {
  static addTask = async (newTaskValue: ILabelValue) => {
    let result: IAddTaskResult = {task: {}, message: "" };
    let error = "";

    await Axios.post(`add-task`, newTaskValue, config)
      .then((res) => {
        const { message, task }: DataFromAddTaskRequest = res.data;
        result = { task, message };
      })
      .catch((e) => {
        if (e.message === "Request failed with status code 422") {
          error = "duplicate task cannot be added";
        } else {
          error =
            "An error occured. Please check you network and try again later";
        }
      });

    return { result, error };
  };
  static updateTask = async (id: number, values: ITaskValues) => {
    let result = false;
    let error = "";
    await Axios.put(`update-task/${id}`, values, config)
      .then(() => {
        result = true;
      })
      .catch((e) => {
        if (e.message === "Request failed with status code 422") {
          error = "duplicate task cannot be added";
        } else {
          error =
            "An error occured. Please check you network and try again later";
        }
      });
    return { result, error };
  };
}

export default TasksApi;
