'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabase } from "@/components/SupabaseProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { User, Mail, Phone, Link as LinkIcon, Trophy } from "lucide-react";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  // Section 1
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  sport: z.string().min(1, "Sport is required"),
  profilePicture: z.any()
    .refine((files: FileList | undefined) => {
      if (typeof window === 'undefined' || !files) return true;
      if (!(files instanceof FileList)) return false;
      return files.length === 0 || (files.length === 1 && ACCEPTED_IMAGE_TYPES.includes(files[0].type));
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),

  // Section 2
  bio: z.string().optional(),
  background: z.string().optional(),

  // Section 3
  experience: z.string().optional(),
  achievements: z.string().optional(),
  timeline: z.string().optional(),

  // Section 4
  skills: z.string().optional(),
  videoLinks: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  actionPhotos: z.any()
    .refine((files: FileList | undefined) => {
      if (typeof window === 'undefined' || !files) return true;
      if (!(files instanceof FileList)) return false;
      return files.length === 0 || Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file.type));
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
  press: z.string().optional(),
  mediaLinks: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),

  // Section 5
  goals: z.string().optional(),
  opportunities: z.string().optional(),

  // Section 6
  endorsements: z.string().optional(),
  merch: z.string().optional(),

  // Section 7
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").or(z.literal("")).optional(),
  socials: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  hasLogo: z.string().optional(),

  // Section 8
  logoUpload: z.any()
    .refine((files: FileList | undefined) => {
      if (typeof window === 'undefined' || !files) return true;
      if (!(files instanceof FileList)) return false;
      return files.length === 0 || (files.length === 1 && ACCEPTED_IMAGE_TYPES.includes(files[0].type));
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),

  // Section 9
  resume: z.any().optional(),
  references: z.any().optional(),
  certifications: z.any().optional(),
  moreMedia: z.any().optional(),
  comments: z.string().optional(),
});

export function CreateProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = useSupabase();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "", middleName: "", lastName: "", sport: "",
      bio: "", background: "", experience: "", achievements: "", timeline: "",
      skills: "", videoLinks: "", press: "", mediaLinks: "",
      goals: "", opportunities: "", endorsements: "", merch: "",
      contactEmail: "", phone: "", socials: "", hasLogo: "",
      comments: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("You must be logged in to create a portfolio."); setLoading(false); return; }

    const uploadFile = async (file: File, bucket: string) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) { console.error("Error uploading file:", error); return null; }
      return data.path;
    };

    let profilePictureUrl: string | null = null;
    if (values.profilePicture && values.profilePicture.length > 0) {
      profilePictureUrl = await uploadFile(values.profilePicture[0], "avatars");
    }

    let logoUrl: string | null = null;
    if (values.logoUpload && values.logoUpload.length > 0) {
      logoUrl = await uploadFile(values.logoUpload[0], "logos");
    }

    const portfolioData = {
      user_id: user.id,
      first_name: values.firstName,
      middle_name: values.middleName,
      last_name: values.lastName,
      sport: values.sport,
      profile_picture_url: profilePictureUrl,
      bio: values.bio,
      background: values.background,
      experience: values.experience,
      achievements: values.achievements,
      timeline: values.timeline,
      skills: values.skills,
      video_links: values.videoLinks ? [values.videoLinks] : null,
      press: values.press,
      media_links: values.mediaLinks ? [values.mediaLinks] : null,
      goals: values.goals,
      opportunities: values.opportunities,
      endorsements: values.endorsements,
      merch: values.merch,
      contact_email: values.contactEmail,
      phone: values.phone,
      socials: values.socials ? [values.socials] : null,
      has_logo: values.hasLogo === "yes",
      logo_url: logoUrl,
      comments: values.comments,
    };

    const { error } = await supabase.from("portfolios").insert([portfolioData]);
    if (error) alert(error.message);
    else { alert("Portfolio created successfully!"); router.push("/profile"); }
    setLoading(false);
  }

  // --- UI helpers (titles & blurbs to match screenshots) ---
  const sectionTitle = (n: number) => ({
    1: "Basic Info",
    2: "Bio & Background",
    3: "Athletic Journey",
    4: "Skills & Media",
    5: "Goals & Opportunities",
    6: "Events, Endorsements & Merch",
    7: "Contact & Style Preferences",
    8: "Upload your Personal Logo or Branding",
    9: "Additional Uploads",
  } as const)[n] ?? "";

  const sectionBlurb = (n: number) => ({
    1: "Tell us about yourself",
    2: "Short intro and your background (schools/teams — include years).",
    3: "Roles/positions & years, major achievements/stats, and milestones.",
    4: "Key strengths, highlight videos/photos, and any press coverage.",
    5: "Share your goals and whether you’re seeking opportunities.",
    6: "List endorsements/awards and any merch or fan page links.",
    7: "Provide contact details and any branding preferences.",
    8: "Upload a logo or wordmark you use personally.",
    9: "Attach your resume, references, certifications, or extra media.",
  } as const)[n] ?? "";

  const getFieldsForStep = (n: number) => {
    switch (n) {
      case 1: return ["firstName", "lastName", "sport", "profilePicture"];
      case 2: return ["bio", "background"];
      case 3: return ["experience", "achievements", "timeline"];
      case 4: return ["skills", "videoLinks", "actionPhotos", "press", "mediaLinks"];
      case 5: return ["goals", "opportunities"];
      case 6: return ["endorsements", "merch"];
      case 7: return ["contactEmail", "phone", "socials", "hasLogo"];
      case 8: return ["logoUpload"];
      case 9: return ["resume", "references", "certifications", "moreMedia", "comments"];
      default: return [];
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const ok = await form.trigger(fields as any);
    if (ok) setStep((p) => p + 1);
  };
  const prevStep = () => setStep((p) => p - 1);

  // shared input styles to match the mock
  const inputClass =
    "h-12 rounded-xl border border-slate-200 bg-white " +
    "placeholder:text-slate-400 " +
    "focus-visible:ring-2 focus-visible:ring-[#254485]/40 focus-visible:border-[#254485]";

  const textareaClass =
    "min-h-[140px] rounded-xl border border-slate-200 bg-white " +
    "placeholder:text-slate-400 " +
    "focus-visible:ring-2 focus-visible:ring-[#254485]/40 focus-visible:border-[#254485]";

  const fileClass =
    "rounded-xl border border-slate-200 bg-white " +
    "file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 " +
    "hover:file:bg-slate-200 focus-visible:ring-2 focus-visible:ring-[#254485]/40";

  const primaryPill =
    "h-11 px-8 rounded-full font-semibold text-white shadow-lg " +
    "bg-gradient-to-r from-emerald-400 to-green-600 " +
    "hover:from-emerald-500 hover:to-green-700 transition";

  const outlinePill =
    "h-11 px-6 rounded-full font-semibold border border-slate-300 " +
    "text-slate-700 hover:bg-slate-50 transition";

  return (
    <div className={cn("mx-auto max-w-5xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {/* Page header band */}
      <div className="mb-8 sm:mb-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 shadow-[0_12px_40px_-24px_rgba(2,6,23,0.5)] text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Create Your Athlete Portfolio
        </h1>
        <p className="mt-2 text-slate-600">
          Showcase your athletic journey and achievements.
        </p>
      </div>

      {/* Step card */}
      <Card className="rounded-3xl border border-slate-200 shadow-[0_16px_50px_-24px_rgba(2,6,23,0.35)]">
        <CardHeader className="pb-0">
          <CardTitle className="sr-only">Portfolio Form</CardTitle>
          <div className="px-6 pt-6 sm:px-10">
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Section {step} of 9
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
              {sectionTitle(step)}
            </h2>
            <p className="mt-2 text-slate-600">{sectionBlurb(step)}</p>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* SECTION 1 */}
              {step === 1 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">First Name *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><User /></InputGroupAddon>
                            <InputGroupInput className={inputClass} placeholder="Your first name" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Middle Name</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><User /></InputGroupAddon>
                            <InputGroupInput className={inputClass} placeholder="Your middle name (optional)" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Last Name *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><User /></InputGroupAddon>
                            <InputGroupInput className={inputClass} placeholder="Your last name" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Sport You Play *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><Trophy /></InputGroupAddon>
                            <InputGroupInput className={inputClass} placeholder="e.g., Basketball, Soccer, Track & Field" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Profile Picture</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 2 */}
              {step === 2 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Short Bio / Athlete Introduction</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="Who are you? What motivates you as an athlete?" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Athletic/Educational Background</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="List schools, programs, or teams you’ve been part of. Include years." {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 3 */}
              {step === 3 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Athletic Experience & Teams</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="e.g., Point Guard — Varsity Team (2021–2023), Team Captain (2023)" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Major Achievements & Stats</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="e.g., State Championship 2023, MVP Award, 18.5 PPG average" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Athletic Timeline</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="e.g., 2015: Started playing • 2018: First tournament • 2021: Varsity team" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 4 */}
              {step === 4 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Key Skills or Strengths in Your Sport</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="e.g., speed, leadership, accuracy, strategic thinking" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Highlight Videos (YouTube links)</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><LinkIcon /></InputGroupAddon>
                            <Textarea className={textareaClass} placeholder="Paste YouTube links (one per line)" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="actionPhotos"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Game or Action Photos</FormLabel>
                        <FormControl>
                          <Input type="file" multiple accept="image/*" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <p className="text-sm text-slate-500">Upload JPG/PNG. You can add more later.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="press"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Press or Media Mentions</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="Any coverage or media mentions…" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mediaLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Video/Photo/Media Uploads</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><LinkIcon /></InputGroupAddon>
                            <Textarea className={textareaClass} placeholder="Paste any video or article links here" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 5 */}
              {step === 5 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">What are your current goals as an athlete?</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder='e.g., “Seeking scholarship”, “Join national team”, “Train professionally.”' {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="opportunities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Are you looking for sponsorships or training opportunities?</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 6 */}
              {step === 6 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="endorsements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Have you received any endorsements or awards?</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="Brands, sponsors, notable recognitions…" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="merch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Do you sell merchandise or have a fan page/shop?</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="Include links or descriptions…" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 7 */}
              {step === 7 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Email Address for Contact *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><Mail /></InputGroupAddon>
                            <InputGroupInput className={inputClass} type="email" placeholder="you@example.com" {...field} value={field.value ?? ""} />
                          </InputGroup>
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
                        <FormLabel className="font-semibold">Phone Number</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><Phone /></InputGroupAddon>
                            <InputGroupInput className={inputClass} type="tel" placeholder="+1 (555) 123-4567" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Social Media Links</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon><LinkIcon /></InputGroupAddon>
                            <Textarea className={textareaClass} placeholder="Instagram, X/Twitter, TikTok… one per line" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Do you have a personal logo or branding?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-[#254485]/40">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 8 */}
              {step === 8 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="logoUpload"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Upload a Logo or Wordmark</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* SECTION 9 */}
              {step === 9 && (
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Resume/CV</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <p className="text-sm text-slate-500">PDF preferred.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Reference letters</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Certifications</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moreMedia"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Additional photos or media</FormLabel>
                        <FormControl>
                          <Input type="file" multiple onChange={(e) => onChange(e.target.files)} onBlur={onBlur} name={name} ref={ref} className={fileClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Additional Comments</FormLabel>
                        <FormControl>
                          <Textarea className={textareaClass} placeholder="Anything else coaches/recruiters should know…" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                {step > 1 && (
                  <Button type="button" onClick={prevStep} disabled={loading} className={outlinePill}>
                    Previous
                  </Button>
                )}
                {step < 9 ? (
                  <Button type="button" onClick={nextStep} disabled={loading} className={primaryPill}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className={primaryPill}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
