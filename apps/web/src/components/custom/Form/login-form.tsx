import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { loginFormSchema } from "@/schema/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export const LoginForm = () => {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values);
  };
  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="w-md">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your Email" {...field}></Input>
              </FormControl>
              <FormDescription>Your signed up email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Your Password" {...field}></Input>
              </FormControl>
              <FormDescription>Your signed up password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Log in</Button>
      </form>
    </Form>
  );
};
