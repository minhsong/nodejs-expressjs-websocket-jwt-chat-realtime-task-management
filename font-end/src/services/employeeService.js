import { apiCall } from "../helpers/apiHelper";

const base = process.env.REACT_APP_API_URL + "/employee";
export const getEmployees = async () => {
  return await apiCall(
    base + "/",
    null,
    "get",
    false,
    localStorage.getItem("token")
  );
};

export const addEmployee = async (data) => {
  return await apiCall(
    base + "/",
    data,
    "post",
    false,
    localStorage.getItem("token")
  );
};

export const updateEmployee = async (data) => {
  return await apiCall(
    base + "/" + data.id,
    data,
    "put",
    false,
    localStorage.getItem("token")
  );
};

export const deleteEmployee = async (id) => {
  return await apiCall(
    base + "/" + id,
    null,
    "delete",
    false,
    localStorage.getItem("token")
  );
};

export const getEmployee = async (id) => {
  return await apiCall(
    base + "/" + id,
    null,
    "get",
    false,
    localStorage.getItem("token")
  );
};
