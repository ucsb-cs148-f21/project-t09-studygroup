import app from '../index.js';
import supertest from 'supertest';
import axios from "axios";
import { expect, jest } from '@jest/globals';

jest.mock("axios")
const requestWithSupertest = supertest(app);

//This is the test to check we have the correct current quarter accessed from the URL
test('Correct Quarter', async () => {
  axios.get.mockResolvedValueOnce({data: {quarter: '20214'}})
  const res = await requestWithSupertest.get('/api/currentQuarter');

  expect(axios.get).toBeCalledTimes(1);
  expect(axios.get).toHaveBeenCalledWith('https://api.ucsb.edu/academics/quartercalendar/v1/quarters/current', {
    headers: {
      accept: 'application/json',
      'ucsb-api-version': '1.0',
      'ucsb-api-key': 'e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E',
    }});
  expect(res.body.quarter).toEqual('20214');
})
