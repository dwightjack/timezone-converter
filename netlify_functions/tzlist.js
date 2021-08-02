const { getTimeZones } = require('@vvo/tzdb');

exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ zones: getTimeZones() }),
  };
};
