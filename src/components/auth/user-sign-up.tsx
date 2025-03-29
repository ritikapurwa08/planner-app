import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { Form } from "../ui/form";
import FormInput from "../form-controls/form-input";
import SubmitButton from "../ui/submit-button";
import toast from "react-hot-toast";

const UserSignUp = () => {
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuthActions();

  const { form } = SignUpForm();

  const handleSignUp = async (data: SignUpFormType) => {
    setLoading(true);
    await signIn("password", {
      email: data.email,
      password: data.password,
      flow: "signUp",
    })
      .then(() => {
        toast.success("Account created successfully!"); // Show a success toast
      })
      .catch(() => {
        toast.error("sign Up Failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="">
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(handleSignUp)}
        >
          <FormInput
            control={form.control}
            label="Enter Email"
            name="email"
            defaultValue=""
            placeholder="Enter Your Email"
          />
          <FormInput
            control={form.control}
            label="Enter Password"
            name="password"
            defaultValue=""
            placeholder="Enter Your Password"
          />
          <SubmitButton
            className="bg-blue-500 hover:bg-blue-600 font-medium"
            disable={loading}
            loading={loading}
            loadingText="Signing In..."
            staticText="Sing Up"
          />
        </form>
      </Form>
    </main>
  );
};

export default UserSignUp;

const SignUpZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "dfdd"),
});

type SignUpFormType = z.infer<typeof SignUpZodSchema>;
const SignUpForm = () => {
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpZodSchema),
  });

  return {
    form,
  };
};
