if (!process.env.SYMPHONY_API_KEY) {
    throw new Error('SYMPHONY_API_KEY is not set');
}
if (!process.env.SYMPHONY_BASE_URL) {
    throw new Error('SYMPHONY_BASE_URL is not set');
}

export const settings = {
    apiKey: process.env.SYMPHONY_API_KEY,
    baseUrl: process.env.SYMPHONY_BASE_URL,
};