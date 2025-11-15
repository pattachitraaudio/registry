import { z } from "zod";

const envSchema = z
    .object({
        CF_TURNSTILE_SITE_KEY: z.string().min(1, "Cloudflare Turnstile site key is required"),
        CF_TURNSTILE_SECRET_KEY: z.string().min(1, "Cloudflare Turnstile secret key is required"),
        NEXT_PUBLIC_APP_URL: z.url().optional(),
        VERCEL_URL: z.string().optional(),
        SMTP_EMAIL: z.email("Invalid SMTP email"),
        SMTP_PASSWORD: z.string().min(1, "SMTP password is required"),
        SMTP_HOST: z.string().min(1, "SMTP host is required"),
        MONGODB_URI: z.url("Invalid MongoDB URI"),
        JWT_SECRET: z.string().min(1, "JWT secret is required"),
        ROOT_REFERRAL_CODE: z.string().min(1, "Root referral code is required"),
        ENV_TYPE: z.enum(["dev", "testing", "production", "staging"] as const),
        ELEVEN_LABS_API_URL: z.string(),
    })
    .refine(
        (data) => {
            const hasNextPublicAppURL = !!data.NEXT_PUBLIC_APP_URL;
            const hasVercelURL = !!data.VERCEL_URL;
            return hasNextPublicAppURL !== hasVercelURL;
        },
        {
            message: "Exactly one of NEXT_PUBLIC_APP_URL or VERCEL_URL must be provided (not both, not neither)",
            path: ["NEXT_PUBLIC_APP_URL"],
        },
    )
    .transform(({ NEXT_PUBLIC_APP_URL, VERCEL_URL, ...rest }) => ({
        ...rest,
        APP_URL: NEXT_PUBLIC_APP_URL || VERCEL_URL,
    }));

export type EnvMap = z.infer<typeof envSchema>;
export type EnvType = EnvMap["ENV_TYPE"];

class EnvManager {
    private setupPromise!: Promise<EnvMap>;
    private static instance: null | EnvManager;

    constructor() {
        if (EnvManager.instance) {
            return EnvManager.instance;
        }

        EnvManager.instance = this;
        this.createInstance();
    }

    private createInstance() {
        this.setupPromise = (async () => {
            try {
                const result = await envSchema.parseAsync(process.env);
                console.log("✓ Environment variables validated successfully");
                return result;
            } catch (err) {
                if (err instanceof z.ZodError) {
                    console.error("❌ Environment validation failed:");
                    // console.error(JSON.stringify(z.treeifyError(err), null, 4));
                } else {
                    console.error("❌ Unexpected error during environment validation:", err);
                }

                throw err;
                // process.exit(2);
            }
        })();
    }

    setup() {
        return this.setupPromise;
    }
}

export { EnvManager };
