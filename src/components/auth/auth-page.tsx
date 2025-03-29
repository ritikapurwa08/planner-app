"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserSignUp from "./user-sign-up";
import UserSignIn from "./user-sing-in";

const CombinedAuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleAuth = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <main className="min-h-screen  py-6 flex justify-center items-center">
      <Card className="container max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            {isSignUp ? "Create an Account" : "Sign In"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            {isSignUp
              ? "Enter your details below to create an account."
              : "Enter your email and password to sign in."}
          </CardDescription>
        </CardHeader>
        <CardContent>{isSignUp ? <UserSignUp /> : <UserSignIn />}</CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="secondary" onClick={handleToggleAuth}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default CombinedAuthPage;
