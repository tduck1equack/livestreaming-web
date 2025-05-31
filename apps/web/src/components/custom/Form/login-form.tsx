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
} from "@components/ui/form";
import {
  loginFormSchema,
  LoginFormSchemaType,
} from "@/schema/auth/login.schema";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { axiosInstance } from "@/lib";

/**
 * @component LoginForm with validation and resolver
 * @returns Login form component
 */
export const LoginForm = () => {
  const loginForm = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: LoginFormSchemaType) => {
    console.log(values);
    const response = await axiosInstance.post("/auth/login", {
      email: values.email,
      password: values.password,
    });
    console.log(response);
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
