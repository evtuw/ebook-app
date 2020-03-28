import {postToServer} from './until';

const postToServerData = (apiUrl, data, requiredData, files) => {
  // custom for every app
  let apiData = {
    ...data,
  };
  if (requiredData) {
    apiData = {
      ...data,
    };
  }
  let tempData = {};
  if (apiData) {
    tempData = {...tempData, ...apiData};
  }
  if (files) {
    const formData = new FormData();
    files.forEach(v => formData.append(v.key || 'images[]', v));
    Object.keys(tempData).forEach(k => formData.append(`${k}`, tempData[k]));
    tempData = formData;
  }
  return postToServer(apiUrl, tempData, {
    Authorization: 'Bearer ' + data.token,
    Accept: 'application/json',
  });
};

export const postToServerWithAccount = (apiUrl, data, files) => {
  return postToServerData(apiUrl, data, true, files);
};
