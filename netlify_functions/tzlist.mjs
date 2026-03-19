const { getTimeZones } = require('@vvo/tzdb');

export default async () => {
  return new Response(JSON.stringify({ zones: getTimeZones() }));
};
