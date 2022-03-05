import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../constants';

export const getUser = (token: string) => {
  try {
    const decoded = jwt.verify(token, getJwtSecret())
    return decoded;
  }
  catch (err) {
    return null;
  }
}