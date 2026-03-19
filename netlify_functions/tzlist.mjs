const { getTimeZones } = require('@vvo/tzdb');

export default async () => {
  return Response.json({ zones: getTimeZones() });
};
