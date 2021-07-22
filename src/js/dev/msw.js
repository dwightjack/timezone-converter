import { rest, setupWorker } from 'msw';
import { handler } from '../../../netlify_functions/tzlist';

export const worker = setupWorker(
  rest.get('/api/tzlist', async (req, res, ctx) => {
    const { body } = await handler();
    return res(ctx.json(JSON.parse(body)));
  }),
);
