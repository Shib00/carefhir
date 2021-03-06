import axios from 'axios';

let querProp = {
  stringifyQueryParams(params) {
    return Object.keys(params)
      .reduce((all, key) => {
        if (params[key] && params[key] !== '') {
          if (Array.isArray(params[key])) {
            if (params[key].length > 0) {
              const temp = JSON.stringify(params[key]);
              all.push(`${key}=${encodeURI(temp)}`);
            }
          } else {
            all.push(`${key}=${encodeURI(params[key])}`);
          }
        }
        return all;
      }, [])
      .join('&');
  }
};

export const getPatients = (serverAddress, serverHeaders = {}) => (params) => {
  const queryParams = querProp.stringifyQueryParams(params);
  return axios.get(`${serverAddress}/Patient?${queryParams}`, {
    headers: serverHeaders
  });
}

export const getPatientData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Patient/${id}`, {
    headers: serverHeaders
  });
}