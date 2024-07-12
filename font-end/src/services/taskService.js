import { apiCall } from "../helpers/apiHelper";

const base = process.env.REACT_APP_API_URL + "/task";
export const getTasks = async () => {
  return await apiCall(
    base + "/",
    null,
    "get",
    false,
    localStorage.getItem("token")
  );
};

export const addTask = async (data) => {
  return await apiCall(
    base + "/",
    data,
    "post",
    false,
    localStorage.getItem("token")
  );
};

export const updateTask = async (data) => {
  return await apiCall(
    base + "/" + data.id,
    data,
    "put",
    false,
    localStorage.getItem("token")
  );
};

export const deleteTask = async (id) => {
  return await apiCall(
    base + "/" + id,
    null,
    "delete",
    false,
    localStorage.getItem("token")
  );
};

export const getTask = async (id) => {
  return await apiCall(
    base + "/" + id,
    null,
    "get",
    false,
    localStorage.getItem("token")
  );
};

export const markTaskAsDone = async (id) => {
  return await apiCall(
    base + "/markDone/" + id,
    null,
    "put",
    false,
    localStorage.getItem("token")
  );
};
