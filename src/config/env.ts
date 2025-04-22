export type Environment = {
    API_PORT: string;
    DATABASE_URL: string;
    TOKEN_SECRET_KEY: string;
};

export const getEnv = <K extends keyof Environment>(key: K, fallback?: Environment[K]): Environment[K] => {
    const value = process.env[key] as Environment[K] | undefined;

    if (value === undefined) {
        if (fallback) {
            return fallback;
        }
        throw new Error(`Missing environment variable: ${key}.`);
    }

    return value;
};

