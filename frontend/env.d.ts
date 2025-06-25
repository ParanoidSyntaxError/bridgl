declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_DYNAMIC_ENV_ID: string;
        }
    }
}

export { }