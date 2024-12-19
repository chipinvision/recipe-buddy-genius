import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAuthButton } from "./GoogleAuthButton";

export const AuthForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome</CardTitle>
        <CardDescription className="text-center">
          Sign in to continue to Recipe Generator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleAuthButton />
      </CardContent>
    </Card>
  );
};