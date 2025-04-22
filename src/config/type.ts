export type AppConfig = {
    api: {
        port: number;
    },
    db: {
        database_url: string;
    },
    auth: {
        secret_key: string
    }
}