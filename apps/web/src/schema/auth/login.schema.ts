import { z } from "zod";
/**
 * @schema Login form schema
 * @attribute Email - User's submitted email
 * @attribute Password - User's submitted password
 */
export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string(),
});
/**
 * @inferedType Inferred login form schema's type
 */
export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;
