import { useEffect, useState } from "react";
import { IRequestObject } from "../types/typesFromRequest";

const useDebounce = (
    requestObject: IRequestObject,
    timeCount: number
) => {

    const [newDebounceObject, setNewDebounceObject] = useState({ id: 0, value: "" });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setNewDebounceObject({ id: requestObject.id, value: requestObject.value });
    }, timeCount);
    return () => {
      clearTimeout(timer);
    };
  }, [requestObject.id, requestObject.value]);
  return { newDebounceObject, setNewDebounceObject };
}
 
export default useDebounce;