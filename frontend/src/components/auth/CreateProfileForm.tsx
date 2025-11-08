"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* ---------- Zod Schema ---------- */
const formSchema = z.object({
  // 1
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  sport: z.string().min(1, "Sport is required"),
  profilePicture: z.any().optional(),

  // 2
  bio: z.string().optional(),
  background: z.string().optional(),

  // 3
  experience: z.string().optional(),
  achievements: z.string().optional(),
  timeline: z.string().optional(),

  // 4
  skills: z.string().optional(),
  videoLinks: z.string().optional(),
  actionPhotos: z.any().optional(),
  press: z.string().optional(),
  mediaLinks: z.string().optional(),

  // 5
  goals: z.string().optional(),
  opportunities: z.enum(["", "Yes", "No", "Maybe"]),

  // 6
  endorsements: z.string().optional(),
  merch: z.string().optional(),

  // 7
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  socials: z.string().optional(),
  hasLogo: z.enum(["", "Yes", "No"]),

  // 8
  logoUpload: z.any().optional(),

  // 9
  resume: z.any().optional(),
  references: z.any().optional(),
  certifications: z.any().optional(),
  moreMedia: z.any().optional(),
  comments: z.string().optional(),
});

/* ---------- Component ---------- */
export function CreateProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("section1");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      sport: "",
      bio: "",
      background: "",
      experience: "",
      achievements: "",
      timeline: "",
      skills: "",
      videoLinks: "",
      press: "",
      mediaLinks: "",
      goals: "",
      opportunities: "",
      endorsements: "",
      merch: "",
      contactEmail: "",
      phone: "",
      socials: "",
      hasLogo: "",
      comments: "",
    },
  });

  /* ---------- Navigation Helpers ---------- */
  const goToTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextTab = () => {
    const idx = tabs.findIndex((t) => t.value === activeTab);
    if (idx < tabs.length - 1) goToTab(tabs[idx + 1].value);
  };
  const prevTab = () => {
    const idx = tabs.findIndex((t) => t.value === activeTab);
    if (idx > 0) goToTab(tabs[idx - 1].value);
  };

  /* ---------- Tabs definition ---------- */
  const tabs = [
    { value: "section1", label: "Basic Info" },
    { value: "section2", label: "Bio & Background" },
    { value: "section3", label: "Journey" },
    { value: "section4", label: "Skills & Media" },
    { value: "section5", label: "Goals" },
    { value: "section6", label: "Endorsements" },
    { value: "section7", label: "Contact" },
    { value: "section8", label: "Logo" },
    { value: "section9", label: "Uploads" },
  ];

  /* ---------- Submit ---------- */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to create a portfolio.");
      setLoading(false);
      return;
    }

    const uploadFile = async (file: File, bucket: string) => {
      const ext = file.name.split(".").pop();
      const name = `${user.id}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${ext}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(name, file);
      if (error) {
        console.error(error);
        return null;
      }
      return data.path;
    };

    const uploadMultipleFiles = async (files: FileList, bucket: string) => {
      const urls = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, bucket);
        if (url) {
          urls.push(url);
        }
      }
      return urls.length > 0 ? urls : null;
    };

    const profilePictureUrl = values.profilePicture?.[0]
      ? await uploadFile(values.profilePicture[0], "avatars")
      : null;
    const logoUrl = values.logoUpload?.[0]
      ? await uploadFile(values.logoUpload[0], "logos")
      : null;
    const actionPhotosUrls = values.actionPhotos
      ? await uploadMultipleFiles(values.actionPhotos, "action-photos")
      : null;
    const resumeUrl = values.resume?.[0]
      ? await uploadFile(values.resume[0], "resumes")
      : null;
    const referencesUrl = values.references?.[0]
      ? await uploadFile(values.references[0], "references")
      : null;
    const certificationsUrl = values.certifications?.[0]
      ? await uploadFile(values.certifications[0], "certifications")
      : null;
    const moreMediaUrls = values.moreMedia
      ? await uploadMultipleFiles(values.moreMedia, "more-media")
      : null;

    const portfolioData = {
      user_id: user.id,
      first_name: values.firstName,
      middle_name: values.middleName || null,
      last_name: values.lastName,
      sport: values.sport,
      profile_picture_url: profilePictureUrl,
      bio: values.bio || null,
      background: values.background || null,
      experience: values.experience || null,
      achievements: values.achievements || null,
      timeline: values.timeline || null,
      skills: values.skills || null,
      video_links: values.videoLinks
        ? values.videoLinks.split("\n").filter(Boolean)
        : null,
      action_photos_urls: actionPhotosUrls,
      press: values.press || null,
      media_links: values.mediaLinks
        ? values.mediaLinks.split("\n").filter(Boolean)
        : null,
      goals: values.goals || null,
      opportunities: values.opportunities || null,
      endorsements: values.endorsements || null,
      merch: values.merch || null,
      contact_email: values.contactEmail,
      phone: values.phone || null,
      socials: values.socials
        ? values.socials.split("\n").filter(Boolean)
        : null,
      has_logo: values.hasLogo === "Yes",
      logo_url: logoUrl,
      resume_url: resumeUrl,
      references_url: referencesUrl,
      certifications_url: certificationsUrl,
      more_media_urls: moreMediaUrls,
      comments: values.comments || null,
    };

    const { error } = await supabase.from("portfolios").insert([portfolioData]);
    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Portfolio created!");
      router.push("/profile");
    }
    setLoading(false);
  }

  const inputCls =
    "h-12 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
  const textareaCls =
    "min-h-[140px] rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500";
  const pillActive =
    "h-11 px-8 rounded-full font-semibold text-white shadow-lg " +
    "bg-gradient-to-r from-emerald-400 to-green-600 " +
    "hover:from-emerald-500 hover:to-green-700 transition";

  const pillOutline =
    "h-11 px-6 rounded-full font-semibold border border-slate-300 " +
    "text-slate-700 hover:bg-slate-50 transition";

  return (
    <div
      className={cn("mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Create Your Athlete Portfolio
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Showcase your athletic journey and achievements
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* ---------- TABS LIST ---------- */}
            <TabsList className="flex items-center justify-start overflow-x-auto -mx-4 sm:-mx-6 md:-mx-10 px-4 sm:px-6 md:px-10 border-b border-slate-200">
              {tabs.map((tab, i) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative flex-shrink-0 flex flex-col items-center gap-1 whitespace-nowrap px-5 py-3 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors duration-200 ease-in-out focus:outline-none data-[state=active]:text-emerald-600 data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out data-[state=active]:after:scale-x-100"
                >
                  <span className="font-bold text-base">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ---------- SECTION 1 ---------- */}
            <TabsContent value="section1">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 1 of 9: Basic Info</CardTitle>
                  <CardDescription>Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="Your first name"
                            {...field}
                          />
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
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="Optional"
                            {...field}
                          />
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
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="Your last name"
                            {...field}
                          />
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
                        <FormLabel>Sport You Play *</FormLabel>
                        <FormControl>
                          <Input
                            className={inputCls}
                            placeholder="e.g., Basketball, Soccer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files)}
                              className="hidden"
                              id="profilePic"
                            />
                            <label
                              htmlFor="profilePic"
                              className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                            >
                              <Upload className="mr-3 h-5 w-5 text-slate-500" />
                              <span className="text-slate-700">
                                {value?.[0]?.name || "Choose image"}
                              </span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextTab}
                    className={pillActive}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ---------- SECTION 2 ---------- */}
            <TabsContent value="section2">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 2 of 9: Bio & Background</CardTitle>
                  <CardDescription>
                    Short intro and your background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            className={textareaCls}
                            placeholder="Who are you? What motivates you?"
                            {...field}
                          />
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
                        <FormLabel>Background</FormLabel>
                        <FormControl>
                          <Textarea
                            className={textareaCls}
                            placeholder="Schools, teams, years..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            </TabsContent>

            {/* ---------- SECTION 3 ---------- */}
            <TabsContent value="section3">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 3 of 9: Athletic Journey</CardTitle>
                  <CardDescription>Roles, stats, milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["experience", "achievements", "timeline"].map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key as keyof typeof form.watch}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {key === "experience"
                              ? "Experience & Teams"
                              : key === "achievements"
                                ? "Achievements & Stats"
                                : "Timeline"}
                          </FormLabel>
                          <FormControl>
                            <Textarea className={textareaCls} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
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
            </TabsContent>

            {/* ---------- SECTION 4 ---------- */}
            <TabsContent value="section4">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 4 of 9: Skills & Media</CardTitle>
                  <CardDescription>Videos, photos, press</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Skills</FormLabel>
                        <FormControl>
                          <Textarea className={textareaCls} {...field} />
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
                        <FormLabel>Highlight Videos (YouTube)</FormLabel>
                        <FormControl>
                          <Textarea
                            className={textareaCls}
                            placeholder="One link per line"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="actionPhotos"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Action Photos</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => onChange(e.target.files)}
                              className="hidden"
                              id="actionPhotos"
                            />
                            <label
                              htmlFor="actionPhotos"
                              className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                            >
                              <Upload className="mr-3 h-5 w-5 text-slate-500" />
                              <span className="text-slate-700">
                                {form.watch("actionPhotos")?.length
                                  ? `${form.watch("actionPhotos").length} photos`
                                  : "Choose photos"}
                              </span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {["press", "mediaLinks"].map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key as keyof typeof form.watch}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {key === "press"
                              ? "Press Mentions"
                              : "Other Media Links"}
                          </FormLabel>
                          <FormControl>
                            <Textarea className={textareaCls} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
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
            </TabsContent>

            {/* ---------- SECTION 5 ---------- */}
            <TabsContent value="section5">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 5 of 9: Goals & Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Goals</FormLabel>
                        <FormControl>
                          <Textarea className={textareaCls} {...field} />
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
                        <FormLabel>Sponsorship / Training?</FormLabel>
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
                              <SelectItem value="Maybe">Maybe</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            </TabsContent>

            {/* ---------- SECTION 6 ---------- */}
            <TabsContent value="section6">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 6 of 9: Endorsements & Merch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["endorsements", "merch"].map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key as keyof typeof form.watch}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {key === "endorsements"
                              ? "Endorsements / Awards"
                              : "Merch / Fan Shop"}
                          </FormLabel>
                          <FormControl>
                            <Textarea className={textareaCls} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
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
            </TabsContent>

            {/* ---------- SECTION 7 ---------- */}
            <TabsContent value="section7">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 7 of 9: Contact & Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" className={inputCls} {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" className={inputCls} {...field} />
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
                        <FormLabel>Social Links</FormLabel>
                        <FormControl>
                          <Textarea
                            className={textareaCls}
                            placeholder="One per line"
                            {...field}
                          />
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
                        <FormLabel>Personal Logo?</FormLabel>
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
            </TabsContent>

            {/* ---------- SECTION 8 ---------- */}
            <TabsContent value="section8">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 8 of 9: Logo Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="logoUpload"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Upload Logo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files)}
                              className="hidden"
                              id="logo"
                            />
                            <label
                              htmlFor="logo"
                              className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                            >
                              <Upload className="mr-3 h-5 w-5 text-slate-500" />
                              <span className="text-slate-700">
                                {form.watch("logoUpload")?.[0]?.name ||
                                  "Choose file"}
                              </span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            </TabsContent>

            {/* ---------- SECTION 9 ---------- */}
            <TabsContent value="section9">
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle>Section 9 of 9: Additional Uploads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      name: "resume",
                      label: "Resume",
                      accept: ".pdf,.doc,.docx",
                    },
                    {
                      name: "references",
                      label: "Reference Letters",
                      multiple: true,
                    },
                    {
                      name: "certifications",
                      label: "Certifications",
                      multiple: true,
                    },
                    {
                      name: "moreMedia",
                      label: "Extra Photos / Media",
                      multiple: true,
                    },
                  ].map((f) => (
                    <FormField
                      key={f.name}
                      control={form.control}
                      name={f.name as keyof typeof form.watch}
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>{f.label}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="file"
                                accept={f.accept}
                                multiple={!!f.multiple}
                                onChange={(e) => onChange(e.target.files)}
                                className="hidden"
                                id={f.name}
                              />
                              <label
                                htmlFor={f.name}
                                className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                              >
                                <Upload className="mr-3 h-5 w-5 text-slate-500" />
                                <span className="text-slate-700">
                                  {form.watch(f.name as any)?.length
                                    ? `${form.watch(f.name as any).length} file(s)`
                                    : "Choose file(s)"}
                                </span>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments</FormLabel>
                        <FormControl>
                          <Textarea className={textareaCls} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <Button
                    type="submit"
                    disabled={loading}
                    className={pillActive}
                  >
                    {loading ? "Submitting..." : "Submit Portfolio"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
