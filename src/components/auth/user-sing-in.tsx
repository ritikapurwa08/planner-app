import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { Form } from "../ui/form";
import FormInput from "../form-controls/form-input";
import { toast } from "react-hot-toast";
import SubmitButton from "../ui/submit-button";

const UserSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthActions();
  const { form } = SignInForm();

  const handleSignIn = async (data: SignInFormType) => {
    setLoading(true);
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signIn",
      });
      toast.success("Signed in successfully!");
      // You might want to redirect the user after successful sign-in
    } catch (error: unknown) {
      toast.error(`Sign in failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className=" w-full flex justify-center items-center">
      <Form {...form}>
        <form
          className="flex flex-col w-full space-y-4"
          onSubmit={form.handleSubmit(handleSignIn)}
        >
          <FormInput
            control={form.control}
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            defaultValue=""
          />
          <FormInput
            control={form.control}
            label="Password"
            name="password"
            placeholder="Enter your password"
            defaultValue=""
          />
          <SubmitButton
            className="bg-blue-500 hover:bg-blue-600 "
            disable={loading}
            loading={loading}
            loadingText="Signing In..."
            staticText="Sign In"
          />
        </form>
      </Form>
    </main>
  );
};

export default UserSignIn;

const SignInZodSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type SignInFormType = z.infer<typeof SignInZodSchema>;
const SignInForm = () => {
  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInZodSchema),
  });

  return {
    form,
  };
};
