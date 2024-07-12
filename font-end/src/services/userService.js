import { apiCall } from "../helpers/apiHelper";
import { loadFailure, loadStart, loadSuccess } from "../Redux/Slices/userSlice";

const base = process.env.REACT_APP_API_URL + "/user";
export const registerService = async (data) => {
  const response = await apiCall(base + "/register", data, "post");
  return response;
};

export const loginService = async (data) => {
  const response = await apiCall(base + "/login", data, "post");
  return response;
};

export const loadUser = async (dispatch) => {
  dispatch(loadStart());
  const localToken = localStorage.getItem("token");
  if (!localToken) return dispatch(loadFailure());

  try {
    await apiCall(base + "/me", null, "get", false, localToken).then((res) => {
      if (res.ok) {
        console.log(res);
        dispatch(loadSuccess({ user: res.resData }));
      } else {
        localStorage.removeItem("token");
        dispatch(loadFailure());
      }
    });
  } catch (error) {
    localStorage.removeItem("token");
    dispatch(loadFailure());
  }
};

export const updateProfile = async (data) => {
  return await apiCall(
    base + "/me",
    data,
    "put",
    false,
    localStorage.getItem("token")
  );
};

export const newAccessCode = async (data) => {
  return await apiCall(base + "/access-code", data, "post", false);
};

export const verifyAccessCode = async (data) => {
  return await apiCall(base + "/verify-access-code", data, "post", false);
};
