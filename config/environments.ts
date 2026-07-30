export type EnvironmentName = 'dev' | 'qa' | 'uat' | 'production';

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseUrl: string;
}

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  dev: {
    name: 'dev',
    baseUrl: 'https://example-dev.com',
  },
  qa: {
    name: 'qa',
    baseUrl: 'https://example-qa.com',
  },
  uat: {
    name: 'uat',
    baseUrl: 'https://example-uat.com',
  },
  production: {
    name: 'production',
    baseUrl: 'https://example.com',
  },
};

export function getConfig(environment: EnvironmentName = (process.env.ENV as EnvironmentName) || 'dev'): EnvironmentConfig {
  return environments[environment] ?? environments.dev;
}
