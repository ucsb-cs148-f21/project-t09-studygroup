import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export async function getMostCurrentQuarter() {
  const qinfo = await axios.get('https://api.ucsb.edu/academics/quartercalendar/v1/quarters/current', {
    headers: {
      accept: 'application/json',
      'ucsb-api-version': '1.0',
      'ucsb-api-key': process.env.UCSB_API_KEY,
    },
  });

  return qinfo.data.quarter;
}
