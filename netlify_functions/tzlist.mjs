import { getTimeZones } from '@vvo/tzdb';

export default async () => {
  return Response.json({ zones: getTimeZones() });
};
