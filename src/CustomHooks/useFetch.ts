import Axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Axios.get(url)
      .then((res) => {
        setData(res.data.tasks);
      })
      .catch(() => {
        setError("an error occured while fetching data");
      });
  }, [url]);
  return { data, error };
};

export default useFetch;
