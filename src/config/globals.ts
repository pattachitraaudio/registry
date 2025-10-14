import { MongoDB } from "@/lib/mongoDB";

const Globals = {
    mongoDB: new MongoDB("keymaster"),
    app: {
        name: "Pattachitra keymaster",
    },
    baseUrl:
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
} as const;

export { Globals };
