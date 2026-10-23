import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const generatedSecret = randomBytes(32).toString('hex');
const sessionDurationMs = 12 * 60 * 60 * 1000;

const getSessionSecret = () => process.env.AUTH_SECRET || generatedSecret;

export const createSessionToken = (userId) => {
  const payload = `${userId}:${Date.now() + sessionDurationMs}`;
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return `${payload}:${signature}`;
};

export const getSessionUserId = (token) => {
  if (typeof token !== 'string') return null;
  const [userId, expiresAt, signature, extra] = token.split(':');
  if (!userId || !expiresAt || !signature || extra || Number(expiresAt) <= Date.now()) return null;

  const payload = `${userId}:${expiresAt}`;
  const expected = Buffer.from(createHmac('sha256', getSessionSecret()).update(payload).digest('hex'), 'hex');
  const received = Buffer.from(signature, 'hex');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
  return userId;
};