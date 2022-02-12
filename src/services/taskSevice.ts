import Axios from 'axios';
import { TaskType } from '../App';

const config = {

}
export const getTasks = () => {
    let tasks: TaskType[] = [];
    let error = "";
    Axios.get(`get-tasks`)
      .then((res) => {
        tasks = res.data.tasks;
        console.log(tasks);
      })
      .catch(() => {
        error = "an error occured while fetching tasks";
      });
      return {success: tasks, error};
}

export const addTask = () => {
    return "task Added";
}