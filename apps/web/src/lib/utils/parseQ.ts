import qs from 'qs';
export const parseQ = (path: string) => qs.parse(path.split('?')[1]);
