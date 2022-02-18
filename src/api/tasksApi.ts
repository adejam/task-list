import Axios from "axios";
import { config } from "../config";
import { ITaskValues } from "../types/taskType";

class TasksApi {
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
