import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import { Phone } from "lucide-react";

const formSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

export const PhoneAuthForm = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: values.phone,
      });

      if (error) throw error;

      setPhone(values.phone);
      setShowOTP(true);
      toast.success("OTP sent to your phone number");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (values: z.infer<typeof otpFormSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: values.otp,
        type: "sms",
      });

      if (error) throw error;

      toast.success("Successfully verified!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showOTP ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
                      <PhoneInput
                        country="in"
                        value={field.value}
                        onChange={(phone) => field.onChange(`+${phone}`)}
                        inputClass="!w-full !h-10 !pl-10 !pr-3 !py-2 !rounded-md !border !border-input !bg-background !text-sm"
                        containerClass="!w-full"
                        buttonClass="!border-0 !bg-transparent"
                        dropdownClass="!bg-background !border !border-input"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      render={({ slots }) => (
                        <InputOTPGroup className="gap-2">
                          {slots.map((slot, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              {...slot}
                              className="w-10 h-12 text-lg"
                            />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowOTP(false)}
                disabled={loading}
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