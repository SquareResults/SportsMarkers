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

import { formSchema } from "@/lib/formSchema";

/* ---------- Component ---------- */
export default function EditProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("section1");
  const [portfolioId, setPortfolioId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      middleName: undefined,
      lastName: "",
      sport: "",
      profilePicture: undefined,
      bio: undefined,
      background: undefined,
      educationalBackground: undefined,
      journeyTeams: undefined,
      journeyAchievements: undefined,
      timelineTeams: undefined,
      timelineTournaments: undefined,
      skills: undefined,
      videoLinks: undefined,
      actionPhotos: undefined,
      press: undefined,
      mediaLinks: undefined,
      goals: undefined,
      opportunities: "",
      endorsements: undefined,
      merch: undefined,
      contactEmail: "",
      phone: undefined,
      socials: {
        instagram: undefined,
        twitter: undefined,
        tiktok: undefined,
        youtube: undefined,
        linkedin: undefined,
        other: undefined,
      },
      hasLogo: "",
      logoUpload: undefined,
      resume: undefined,
      references: undefined,
      certifications: undefined,
      moreMedia: undefined,
      comments: undefined,
    },
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching portfolio:', error);
        toast.error('Failed to load portfolio data.');
      } else if (data) {
        setPortfolioId(data.id);
        // Helper function for media links
        const getMediaLinks = (links: Array<{ title?: string; url?: string }> | null | undefined) => {
          return links?.length ? links.map(link => ({ title: link.title || "", url: link.url || "" })) : undefined;
        };

        // Helper function for socials
        const getSocials = (socials: { instagram?: string; twitter?: string; tiktok?: string; youtube?: string; linkedin?: string; other?: string; } | null | undefined) => {
          if (!socials) {
            return {
              instagram: undefined,
              twitter: undefined,
              tiktok: undefined,
              youtube: undefined,
              linkedin: undefined,
              other: undefined,
            };
          }
          return {
            instagram: socials.instagram || undefined,
            twitter: socials.twitter || undefined,
            tiktok: socials.tiktok || undefined,
            youtube: socials.youtube || undefined,
            linkedin: socials.linkedin || undefined,
            other: socials.other || undefined,
          };
        };

        // ... inside useEffect ...
        form.reset({
          firstName: data.first_name || "",
          middleName: data.middle_name || undefined,
          lastName: data.last_name || "",
          sport: data.sport || "",
          bio: data.bio || undefined,
          background: data.background || undefined,
          educationalBackground: data.educational_background || undefined,
          journeyTeams: data.experience || undefined,
          journeyAchievements: data.achievements || undefined,
          timelineTeams: data.timeline?.teams || undefined,
          timelineTournaments: data.timeline?.tournaments || undefined,
          skills: data.skills?.join(", ") || undefined,
          videoLinks: getMediaLinks(data.video_links),
          press: getMediaLinks(data.press),
          mediaLinks: getMediaLinks(data.media_links),
          goals: data.goals || undefined,
          opportunities: data.opportunities || "",
          endorsements: data.endorsements || undefined,
          merch: data.merch || undefined,
          contactEmail: data.contact_email || "",
          phone: data.phone || undefined,
          socials: getSocials(data.socials),
          hasLogo: data.has_logo ? "Yes" : "No",
          comments: data.comments || undefined,
        });
      }
    };

    fetchPortfolio();
  }, [supabase, router, form]);

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
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !portfolioId) {
        toast.error("You must be logged in and have a portfolio to update.");
        return;
      }

      const uploadFileToS3 = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          return data.data[0].file_url;
        } else {
          throw new Error(data.error);
        }
      };

      const uploadMultipleFilesToS3 = async (files: FileList) => {
        const urls = [];
        for (const file of Array.from(files)) {
          const url = await uploadFileToS3(file);
          if (url) {
            urls.push(url);
          }
        }
        return urls.length > 0 ? urls : null;
      };

      const profilePictureUrl = values.profilePicture?.[0]
        ? await uploadFileToS3(values.profilePicture[0])
        : undefined;
      const logoUrl = values.logoUpload?.[0]
        ? await uploadFileToS3(values.logoUpload[0])
        : undefined;
      const actionPhotosUrls = values.actionPhotos
        ? await uploadMultipleFilesToS3(values.actionPhotos)
        : undefined;
      const resumeUrl = values.resume?.[0]
        ? await uploadFileToS3(values.resume[0])
        : undefined;
      const referencesUrl = values.references?.[0]
        ? await uploadFileToS3(values.references[0])
        : undefined;
      const certificationsUrl = values.certifications?.[0]
        ? await uploadFileToS3(values.certifications[0])
        : undefined;
      const moreMediaUrls = values.moreMedia
        ? await uploadMultipleFilesToS3(values.moreMedia)
        : undefined;

      const portfolioData: Partial<z.infer<typeof formSchema>> = {
        firstName: values.firstName,
        middleName: values.middleName || undefined,
        lastName: values.lastName,
        sport: values.sport,
        bio: values.bio || undefined,
        background: values.background || undefined,
        educationalBackground: values.educationalBackground || undefined,
        journeyTeams: values.journeyTeams || undefined,
        journeyAchievements: values.journeyAchievements || undefined,
        timelineTeams: values.timelineTeams || undefined,
        timelineTournaments: values.timelineTournaments || undefined,
        skills: values.skills || undefined,
        videoLinks: values.videoLinks || undefined,
        press: values.press || undefined,
        mediaLinks: values.mediaLinks || undefined,
        goals: values.goals || undefined,
        opportunities: values.opportunities || "",
        endorsements: values.endorsements || undefined,
        merch: values.merch || undefined,
        contactEmail: values.contactEmail,
        phone: values.phone || undefined,
        socials: values.socials || undefined,
        hasLogo: values.hasLogo,
        comments: values.comments || undefined,
      };

      // Convert to snake_case for Supabase
      const supabasePortfolioData: Record<string, any> = {
        first_name: portfolioData.firstName,
        middle_name: portfolioData.middleName,
        last_name: portfolioData.lastName,
        sport: portfolioData.sport,
        bio: portfolioData.bio,
        background: portfolioData.background,
        educational_background: portfolioData.educationalBackground,
        experience: portfolioData.journeyTeams,
        achievements: portfolioData.journeyAchievements,
        timeline: {
          teams: portfolioData.timelineTeams,
          tournaments: portfolioData.timelineTournaments,
        },
        skills: portfolioData.skills,
        video_links: portfolioData.videoLinks,
        press: portfolioData.press,
        media_links: portfolioData.mediaLinks,
        goals: portfolioData.goals,
        opportunities: portfolioData.opportunities,
        endorsements: portfolioData.endorsements,
        merch: portfolioData.merch,
        contact_email: portfolioData.contactEmail,
        phone: portfolioData.phone,
        socials: portfolioData.socials,
        has_logo: portfolioData.hasLogo === "Yes",
        comments: portfolioData.comments,
      };


      if (profilePictureUrl) supabasePortfolioData.profile_picture_url = profilePictureUrl;
      if (logoUrl) supabasePortfolioData.logo_url = logoUrl;
      if (actionPhotosUrls) supabasePortfolioData.action_photos_urls = actionPhotosUrls;
      if (resumeUrl) supabasePortfolioData.resume_url = resumeUrl;
      if (referencesUrl) supabasePortfolioData.references_url = referencesUrl;
      if (certificationsUrl) supabasePortfolioData.certifications_url = certificationsUrl;
      if (moreMediaUrls) supabasePortfolioData.more_media_urls = moreMediaUrls;


      const { error } = await supabase
        .from("portfolios")
        .update(supabasePortfolioData)
        .eq('id', portfolioId);

      if (error) {
        toast.error("Error updating portfolio: " + error.message);
      } else {
        toast.success("Portfolio updated successfully!");
        router.push("/profile");
      }
    } catch (error: unknown) {
      console.error("An unexpected error occurred:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
          Edit Your Athlete Portfolio
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Update your athletic journey and achievements
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
              {tabs.map((tab) => (
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
                    render={({ field: { onChange, value, ...rest } }) => (
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
                              {...rest}
                            />
                            <label
                              htmlFor="profilePic"
                              className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                            >
                              <Upload className="mr-3 h-5 w-5 text-slate-500" />
                              <span className="text-slate-700">
                                {form.watch("profilePicture")?.[0]?.name || "Choose image"}
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
                  {/* 
                    TODO: These fields (experience, achievements, timeline) are complex objects/arrays 
                    and cannot be rendered as simple Textareas. 
                    They require a dedicated component like JourneySection in CreateProfileForm.
                    Temporarily disabled to fix build error.
                  */}
                  <div className="p-4 text-sm text-slate-500 italic">
                    Complex journey fields are not currently editable in this form.
                    Please use the main profile editor.
                  </div>
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
                  {/* 
                    TODO: videoLinks is an array of objects, cannot be rendered as Textarea.
                  */}
                  <div className="space-y-2">
                    <FormLabel>Highlight Videos (YouTube)</FormLabel>
                    <div className="p-4 text-sm text-slate-500 italic border rounded-xl bg-slate-50">
                      Video links editing is currently disabled in this form.
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="actionPhotos"
                    render={({ field: { onChange, value, ...rest } }) => (
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
                              {...rest}
                            />
                            <label
                              htmlFor="actionPhotos"
                              className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                            >
                              <Upload className="mr-3 h-5 w-5 text-slate-500" />
                              <span className="text-slate-700">
                                {form.watch("actionPhotos")?.length
                                  ? `${(form.watch("actionPhotos") as FileList).length} photos`
                                  : "Choose photos"}
                              </span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 
                    TODO: press and mediaLinks are arrays of objects.
                  */}
                  {["press", "mediaLinks"].map((key) => (
                    <div key={key} className="space-y-2">
                      <FormLabel>
                        {key === "press"
                          ? "Press Mentions"
                          : "Other Media Links"}
                      </FormLabel>
                      <div className="p-4 text-sm text-slate-500 italic border rounded-xl bg-slate-50">
                        {key} editing is currently disabled in this form.
                      </div>
                    </div>
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
                  {/* 
                    TODO: socials is an object.
                  */}
                  <div className="space-y-2">
                    <FormLabel>Social Links</FormLabel>
                    <div className="p-4 text-sm text-slate-500 italic border rounded-xl bg-slate-50">
                      Social links editing is currently disabled in this form.
                    </div>
                  </div>
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
                    render={({ field: { onChange, value, ...rest } }) => (
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
                              {...rest}
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
                      name={f.name as keyof z.infer<typeof formSchema>}
                      render={({ field: { onChange, value, ...rest } }) => (
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
                                {...rest}
                              />
                              <label
                                htmlFor={f.name}
                                className="flex h-12 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4"
                              >
                                <Upload className="mr-3 h-5 w-5 text-slate-500" />
                                <span className="text-slate-700">
                                  {(form.watch(f.name as keyof z.infer<typeof formSchema>) as any | undefined)?.length
                                    ? `${(form.watch(f.name as keyof z.infer<typeof formSchema>) as any).length} file(s)`
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
                    {loading ? "Updating..." : "Update Portfolio"}
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
