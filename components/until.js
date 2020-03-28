import Moment from 'moment';
import 'moment/locale/vi';
import axios from 'axios';

export const formatDate = (time, language) => {
  if (Moment(time).format('Y') === Moment().format('Y')) {
    if (Moment(time).format('MMDD') === Moment().format('MMDD')) {
      return Moment(time).format('LT');
    } else {
      return language === 'vi'
        ? Moment(time).format('DD [thg] MM')
        : Moment(time).format('DD/MM');
    }
  } else {
    return Moment(time).format('DD/MM/Y');
  }
};

export const formatDateTime = (time, language, multipleLines = false) => {
  if (!time) return false;
  if (Moment(time).format('Y') === Moment().format('Y')) {
    if (Moment(time).format('MMDD') === Moment().format('MMDD')) {
      return Moment(time).format('LT');
    } else {
      return language === 'vi'
        ? Moment(time).format('H:mm, DD [thg] MM')
        : Moment(time).format('DD/MM H:mm');
    }
  } else {
    if (multipleLines) {
      return language === 'vi'
        ? `${Moment(time).format('H:mm')} \n ${Moment(time).format(
            'DD [thg] MM, Y',
          )}`
        : `${Moment(time).format('H:mm')} \n ${Moment(time).format('DD/MM/Y')}`;
    } else {
      return language === 'vi'
        ? Moment(time).format('H:mm, DD [thg] MM Y')
        : Moment(time).format('DD/MM/Y H:mm');
    }
  }
};

export const formatDateTime2 = time => {
  if (!time) return false;
  return Moment(time).format('HH:mm DD/MM/YYYY');
};

export const formatDateNow = time => {
  if (Moment(time).format('Y') === Moment().format('Y')) {
    if (Moment(time).format('MMDD') === Moment().format('MMDD')) {
      return Moment(time)
        .second(1)
        .locale('vi')
        .fromNow();
    }
    return Moment(time).format('DD [thg] MM');
  }
  return Moment(time).format('DD [thg] MM, Y');
};

export const formatDate2 = time => {
  if (Moment(time).format('Y') === Moment().format('Y')) {
    return Moment(time).format('DD/MM');
  } else {
    return Moment(time).format('DD/MM/YYYY');
  }
};

export const formatNumber = num => {
  let result;
  if (num !== Number.parseInt(num)) {
    result = (Math.round(Number(num) * 100) / 100)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  } else {
    result = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  return result;
};

/**
 *
 * @param apiURL
 * @param data
 * @returns {Promise<AxiosResponse<any> | {networkError: boolean}>}
 */
export const postToServer = (apiURL, data, headers) => {
  console.log('apiURL', apiURL);
  return axios
    .post(apiURL, data, {
      headers: {
        ...headers,
        Accept: 'application/json',
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log('error', error);
    });
};
