import { timeZonesNames } from '@vvo/tzdb';

const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ zones: timeZonesNames }),
  };
};

export { handler };
