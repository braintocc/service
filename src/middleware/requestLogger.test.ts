import { requestLogger } from './requestLogger';
import { describe, it, expect, spyOn } from "bun:test";

describe.skip('requestLogger', () => {
  it('logs a JSON object with the correct fields', () => {
    const req = { method: 'GET', url: '/api/users' };
    const res: any = new Response();
    const logger = spyOn(console, 'info');
    requestLogger(req, res, () => {});
    expect(logger).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/users',
      status: res.statusCode,
      response_time: 0, // TODO: use the correct value for this field
    });
  });

  it('logs a warning if the request status is between 400 and 599', () => {
    const req = { method: 'GET', url: '/api/users' };
    const res: any = new Response(404);
    const logger = spyOn(console, 'warn');
    requestLogger(req, res, () => {});
    expect(logger).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/users',
      status: 404, // TODO: use the correct value for this field
      response_time: 0, // TODO: use the correct value for this field
    });
  });

  it('logs an error if the request status is >= 500', () => {
    const req = { method: 'GET', url: '/api/users' };
    const res: any = new Response(500);
    const logger = spyOn(console, 'error');
    requestLogger(req, res, () => {});
    expect(logger).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/users',
      status: 500, // TODO: use the correct value for this field
      response_time: 0, // TODO: use the correct value for this field
    });
  });
});
 