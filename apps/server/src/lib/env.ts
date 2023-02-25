import dotenv from 'dotenv';

export const isProduction = process.env.NODE_ENV === 'production';

dotenv.config({
  // path: isProduction ? './.env.production' : './.env.development',
  path: '.env.development',
  // debug: !isProduction, //? Needed?
  debug: true,
});

type Variables =
  | 'NODE_ENV'
  | 'CLIENT_URL'
  | 'SERVER_URL'
  | 'JWT_SECRET'
  | 'SESSION_SECRET'
  | 'PORT'
  | 'REDIS_URL'
  | 'DB_URL';

const fetchVariable = (variable: Variables): string => {
  if (!process.env[variable]) {
    throw new Error(
      `${variable} is not defined in .env.${
        isProduction ? 'production' : 'development'
      }`
    );
  }

  return process.env[variable] as string;
};

export const env = (variable: Variables): string => {
  return fetchVariable(variable);
};

export const preflightENV = (): void => {
  isProduction && console.log('\x1b[33m', 'RUNNING IN PRODUCTION', '\x1b[0m');
  const variables: Variables[] = [
    'NODE_ENV',
    'CLIENT_URL',
    'SERVER_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
    'PORT',
    'REDIS_URL',
    'DB_URL',
  ];

  variables.forEach((variable) => {
    fetchVariable(variable);
  });

  return;
};
