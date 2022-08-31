import { Individual } from '../db';

export const displayIndividualName = (individual: Individual<{ names: true }>) => {
  const fullname = [individual.givenName, individual.surname].filter(s => s).join(' ');
  return fullname ? fullname : '?';
};
