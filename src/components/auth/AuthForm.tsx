import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { PhoneAuthForm } from "./PhoneAuthForm";

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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <PhoneAuthForm />
      </CardContent>
    </Card>
  );
};