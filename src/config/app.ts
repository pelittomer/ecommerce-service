import { getEnv } from "./env";
import { AppConfig } from "./type"

const appConfig = (): AppConfig => {
    return {
        api: {
            port: Number(getEnv("API_PORT", "8000"))
        },
        db: {
            database_url: getEnv("DATABASE_URL")
        },
        auth: {
            secret_key: getEnv("TOKEN_SECRET_KEY")
        }
    }
};

export default appConfig