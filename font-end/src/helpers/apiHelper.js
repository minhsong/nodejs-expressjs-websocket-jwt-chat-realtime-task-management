import { redirect } from "react-router-dom";
import "isomorphic-fetch";

export function UrlBuilder(url, options) {
  if (!options) {
    return url;
  }

  Object.keys(options).map((key) => {
    if (options[key] === null || options[key] === "") {
      delete options[key];
    }
  });
  let esc = encodeURIComponent;
  let query = Object.keys(options)
    .map((k) => esc(k) + "=" + esc(options[k]))
    .join("&");
  url += "?" + query;
  return url;
}

export function checkStatus(response) {
  if (!response.ok && response.statusText) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  } else if (!response.ok && response.non_field_errors) {
    const error = new Error(response.non_field_errors);
    error.response = response;
    throw error;
  }
  return response;
}

export function parseJSON(response) {
  return response.json().then((resJson) => {
    resJson = {
      resData: resJson,
    };
    resJson.responseStatus = response.status;
    resJson.ok = response.ok;
    delete resJson.resData.ok;
    delete resJson.resData.responseStatus;
    return resJson;
  });
}

export function apiCall(
  url,
  data,
  method = "get",
  hasFile = false,
  token = null
) {
  let fetchOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    method: method,
  };
  let formattedData;
  if (data) {
    if (hasFile) {
      // File uploads can't send as json - change to form
      let form_data = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
      formattedData = form_data;
      delete fetchOptions.headers["Content-Type"];
    } else {
      formattedData = JSON.stringify(data);
    }
  }

  if (token) {
    fetchOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  if (formattedData) {
    fetchOptions.body = formattedData;
  }
  return fetch(url, fetchOptions)
    .then(async (response) => {
      let res = await parseJSON(response);
      if (response.responseStatus >= 200 && response.responseStatus <= 299) {
        res.ok = true;
      }
      if (response.responseStatus == 401) {
        redirect(`/login?returnUrl=${window.location.pathname}`);
      }

      if (response.responseStatus >= 400 && response.responseStatus <= 499) {
        res.ok = false;
      }
      return res;
    })
    .catch(async (error) => {
      const response = error.response;
      if (response) {
        error.status = response.status;
        error.statusText = response.statusText;
        error.resData = await parseJSON(response);
      }
      return error;
    });
}
