const { default: axios } = require("axios");

const defaultHeaders = {
  Accept: "*/*",
  "Accept-Language": "pt",
  Connection: "keep-alive",
  Origin: "https://hamsterkombat.io",
  Referer: "https://hamsterkombat.io/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "sec-ch-ua":
    '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

if (!process.env.APIURL) {
  throw new Error("APIURL is not defined");
}

function createAxiosInstance(token) {
  return axios.create({
    baseURL: process.env.APIURL,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
}

module.exports = {
  createAxiosInstance,
};
