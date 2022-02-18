import Axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (
  url: string,
  isCalled: boolean,
  setTheIsCalled: (value: boolean) => void
) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isCalled) {
      Axios.get(url)
        .then((res) => {
          setData(res.data.tasks);
        })
        .catch(() => {
          setError("an error occured while fetching data");
        });
      setTheIsCalled(false);
    }
  }, [url, isCalled]);
  return { data, error };
};

export default useFetch;
