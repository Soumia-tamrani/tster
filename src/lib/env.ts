import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://postgres:postgres@localhost:5433/mqtt-broker?schema=public"),

  NEXT_PUBLIC_MQTT_BROKER_URL: z.string().default("52.23.199.202"),
  NEXT_PUBLIC_FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BACKEND_SOCKET_URL: z.string().url().default("localhost:4000"),
  NEXT_PUBLIC_BACKEND_REST_URL: z.string().url().default("http://localhost:3002"),

  SMTP_PROVIDER: z.string().default("brevo"),
  EMAIL_USER: z.string().email().default("8e1169001@smtp-brevo.com"),
  EMAIL_PASSWORD: z.string().default("JzsjPMbaw4SHy2IK"),
  EMAIL_HOST: z.string().default("smtp-relay.brevo.com"),
  EMAIL_PORT: z.string().default("587"),

  NEXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED: z.string().default("false"),
  JWT_SECRET: z.string().default("secret"),
  EXPIRY_TIME: z.string().transform((val) => parseInt(val, 10)).default("7200"),
});

const env = envSchema.parse(process.env);

export default env;