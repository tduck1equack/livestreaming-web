import { z } from "zod";
export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string(),
});
