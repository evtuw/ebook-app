import axios from 'axios';

/**
 * response from api
 * @param {*} data
 * @param {*} type
 */
export const responseFromApi = (data, type) => ({type, payload: data});

/**
 * error network
 * @param {*} type
 */
export const responseNetworkError = type => ({
  type,
  payload: {networkError: true},
});

/**
 * dispatch response from api GET
 * @param {*} apiURL
 * @param {*} data
 */
export const dispatchDataFromApiGet = (apiURL, data, type) => dispatch => {
  axios
    .get(apiURL, {params: data})
    .then(response => {
      // console.log(response.data, type);
      if (type) dispatch(responseFromApi(response.data, type));
    })
    .catch(error => {
      console.log(error, 'dispatchDataFromApiGetError');
      if (type) dispatch(responseNetworkError(type));
    });
};

/**
 * dispatch response from api POST
 * @param {*} apiURL
 * @param {*} data
 * @param {*} type
 */
export const dispatchDataFromApiPost = (apiURL, data, type) => dispatch => {
  console.log(data, apiURL);
  axios
    .post(apiURL, data)
    .then(response => {
      // console.log(response.data, type);
      if (type) dispatch(responseFromApi(response.data, type));
    })
    .catch(error => {
      console.log('networkError', error);
      if (type) dispatch(responseNetworkError(type));
    });
};

export const dispatchParams = (data, type) => dispatch => {
  console.log(data, `${type} | dispatchParams`);
  dispatch(responseFromApi(data, type));
};

/**
 *
 * @param apiURL
 * @param data
 * @returns {Promise<AxiosResponse<any> | {networkError: boolean}>}
 */
export const postToServer = (apiURL, data) => {
  console.log(data, apiURL);
  return axios
    .post(apiURL, data, {
      headers: {
        Authorization: 'Bearer ' + data.token,
        Accept: 'application/json',
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {networkError: true};
    });
};

/**
 *
 * @param apiURL
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFromServer = (apiURL, data) => {
  console.log(data, apiURL);
  let getParams = {
    pakage: 'app.package',
  };
  if (data) {
    getParams = {...getParams, ...data};
  }
  return axios
    .get(apiURL, {
      headers: {Authorization: 'Bearer ' + data.token},
      params: getParams,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {networkError: true};
    });
};
