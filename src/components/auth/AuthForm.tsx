import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
        },
      });

      console.log("OTP send response:", { data, error }); // Debug log

      if (error) {
        console.error("OTP send error:", error); // Debug log
        throw error;
      }

      toast.success("OTP sent to your email. Please check your inbox and spam folder.");
      setShowOTPInput(true);
    } catch (error: any) {
      console.error("OTP send catch error:", error); // Debug log
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      console.log("OTP verify response:", { data, error }); // Debug log

      if (error) {
        console.error("OTP verify error:", error); // Debug log
        throw error;
      }

      toast.success("Successfully logged in!");
    } catch (error: any) {
      console.error("OTP verify catch error:", error); // Debug log
      toast.error(error.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome</CardTitle>
        <CardDescription className="text-center">
          Sign in to continue to Recipe Generator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showOTPInput ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleSendOTP} 
              className="w-full" 
              disabled={loading || !email}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleVerifyOTP} 
              className="w-full" 
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowOTPInput(false)} 
              className="w-full mt-2"
            >
              Back to Email Entry
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};