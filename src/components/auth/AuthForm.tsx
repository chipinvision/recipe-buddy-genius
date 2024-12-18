import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

export const AuthForm = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: values.phone,
      });

      if (error) throw error;

      setPhoneNumber(values.phone);
      setShowOTP(true);
      toast.success("OTP sent to your phone number");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onVerifyOTP = async (values: z.infer<typeof otpFormSchema>) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: values.otp,
        type: "sms",
      });

      if (error) throw error;

      toast.success("Successfully verified!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      {!showOTP ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} className="space-y-6">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter OTP</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot 
                              key={index} 
                              {...slot} 
                              index={index}  // Added index prop to resolve TypeScript error
                            />
                          ))}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowOTP(false)}
              >
                Back to Phone Entry
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};