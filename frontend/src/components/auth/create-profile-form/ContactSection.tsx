import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { formSchema } from "@/lib/formSchema";

interface ContactSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  nextTab: () => void;
  prevTab: () => void;
}

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

export function ContactSection({ form, nextTab, prevTab }: ContactSectionProps) {
    const inputCls =
    "h-12 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
  const pillActive =
    "h-11 px-8 rounded-full font-semibold text-white shadow-lg " +
    "bg-gradient-to-r from-emerald-400 to-green-600 " +
    "hover:from-emerald-500 hover:to-green-700 transition";
    const pillOutline =
    "h-11 px-6 rounded-full font-semibold border border-slate-300 " +
    "text-slate-700 hover:bg-slate-50 transition";
  return (
    <Card className="border-2 border-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle>Section 9 of 10: Contact & Logo</CardTitle>
          <CardDescription>
            Provide your contact details. Email is required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Email */}
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className={inputCls}
                    placeholder="your.email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    className={inputCls}
                    placeholder="e.g., (123) 456-7890"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Socials */}
          <div className="space-y-3">
            <FormLabel>Social Links (optional)</FormLabel>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name={`socials.instagram`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="Instagram profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.twitter`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">
                      Twitter / X
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="Twitter / X profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.tiktok`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">
                      TikTok
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="TikTok profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.youtube`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">
                      YouTube
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="YouTube channel URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.linkedin`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">
                      LinkedIn
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="LinkedIn profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.other`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">
                      Other
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputCls}
                        placeholder="Any other social/profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Logo toggle */}
          <FormField
            control={form.control}
            name="hasLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you already have a personal logo?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo upload appears if user says Yes */}
          {form.watch("hasLogo") === "Yes" && (
            <FormField
              control={form.control}
              name="logoUpload"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>
                    Upload Logo (optional){" "}
                    <span className="text-slate-500">
                      – PNG / SVG / high-quality image
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => onChange(e.target.files)}
                        className="hidden"
                        id="logo"
                        {...rest}
                      />
                      <label
                        htmlFor="logo"
                        className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                      >
                        <Upload className="mr-3 h-5 w-5 text-slate-500" />
                        <span className="text-slate-700">
                          {form.watch("logoUpload")?.[0]?.name ||
                            "Choose logo file"}
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevTab}
            className={pillOutline}
          >
            Back
          </Button>
          <Button onClick={nextTab} className={pillActive}>
            Next
          </Button>
        </CardFooter>
      </Card>
  );
}