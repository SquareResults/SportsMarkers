"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Eraser } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().optional(),
  topic: z.string().min(1, { message: "Please choose a topic." }),
  sport: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      sport: "",
      message: "",
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;
  const supabase = useSupabase();
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase
      .from("contact_submissions")
      .insert([values]);

    if (error) {
      console.error(error);
      alert("There was an error submitting your form. Please try again.");
    } else {
      setIsSubmitted(true);
    }
  }

  // Fixed-light field styles
  const fieldBase =
    "h-11 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 " +
    "hover:border-slate-400 focus-visible:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300/60";

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-600">
          Thank you!
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Your message has been sent successfully. We'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Send us a Message</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className={`${fieldBase} ${fieldBaseDark} h-11`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email / Phone */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className={`${fieldBase} ${fieldBaseDark} h-11`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(555) 000-1234"
                      className={`${fieldBase} ${fieldBaseDark} h-11`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Topic / Sport */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`${fieldBase} ${fieldBaseDark} h-11`}
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border border-slate-200 shadow-md">
                      <SelectItem value="portfolio">Portfolio Help</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="partnerships">Partnerships</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport (optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`${fieldBase} ${fieldBaseDark} h-11`}
                      >
                        <SelectValue placeholder="Choose sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border border-slate-200 shadow-md">
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                      <SelectItem value="track">Track &amp; Field</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="How can we help?"
                    className={`${fieldBase} ${fieldBaseDark} min-h-[140px]`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Primary: gradient pill */}
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="h-12 w-full sm:w-auto rounded-full px-6 font-semibold text-white
                         bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700
                         hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800
                         focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:outline-none
                         shadow-[0_8px_20px_rgba(16,185,129,0.25)]
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending…" : "Send Message"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Secondary: light ghost pill (no dark variants) */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              className="h-12 w-full sm:w-auto rounded-full px-6 font-medium
                         text-slate-700 hover:bg-slate-100"
            >
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            By submitting, you agree to our terms. We’ll only use your info to
            respond.
          </p>
        </form>
      </Form>
    </div>
  );
}
