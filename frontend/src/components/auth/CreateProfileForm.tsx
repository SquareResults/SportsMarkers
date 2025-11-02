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
      if (typeof window === 'undefined' || !files) return true; // Skip validation on server or if no file
      if (!(files instanceof FileList)) return false; // Not a FileList
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
      if (typeof window === 'undefined' || !files) return true; // Skip validation on server or if no file
      if (!(files instanceof FileList)) return false; // Not a FileList
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
      if (typeof window === 'undefined' || !files) return true; // Skip validation on server or if no file
      if (!(files instanceof FileList)) return false; // Not a FileList
      return files.length === 0 || (files.length === 1 && ACCEPTED_IMAGE_TYPES.includes(files[0].type));
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),

  // Section 9
  resume: z.any().optional(), // Assuming resume can be any file type
  references: z.any().optional(), // Assuming references can be any file type
  certifications: z.any().optional(), // Assuming certifications can be any file type
  moreMedia: z.any().optional(), // Assuming moreMedia can be any file type
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to create a portfolio.");
      setLoading(false);
      return;
    }

    const uploadFile = async (file: File, bucket: string) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) {
        console.error("Error uploading file:", error);
        return null;
      }
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

    // ... handle other file uploads similarly

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

    if (error) {
      alert(error.message);
    } else {
      alert("Portfolio created successfully!");
      router.push("/profile");
    }
    setLoading(false);
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "sport", "profilePicture"];
      case 2:
        return ["bio", "background"];
      case 3:
        return ["experience", "achievements", "timeline"];
      case 4:
        return ["skills", "videoLinks", "actionPhotos", "press", "mediaLinks"];
      case 5:
        return ["goals", "opportunities"];
      case 6:
        return ["endorsements", "merch"];
      case 7:
        return ["contactEmail", "phone", "socials", "hasLogo"];
      case 8:
        return ["logoUpload"];
      case 9:
        return ["resume", "references", "certifications", "moreMedia", "comments"];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create Your Athlete Portfolio</CardTitle>
          <p className="text-muted-foreground">Step {step} of 9</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">
                    Section 1: Basic Info
                  </h3>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <User />
                            </InputGroupAddon>
                            <InputGroupInput placeholder="Your first name" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <User />
                            </InputGroupAddon>
                            <InputGroupInput
                              placeholder="Your middle name (optional)"
                              {...field}
                              value={field.value ?? ""}
                            />
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
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <User />
                            </InputGroupAddon>
                            <InputGroupInput placeholder="Your last name" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Sport You Play *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Trophy />
                            </InputGroupAddon>
                            <InputGroupInput
                              placeholder="e.g., Basketball, Soccer, Track & Field"
                              {...field}
                              value={field.value ?? ""}
                            />
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
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">
                    Section 2: About You
                  </h3>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about yourself" {...field} value={field.value ?? ""} />
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
                          <Textarea placeholder="Your background" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">
                    Section 3: Athletic Journey
                  </h3>
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your experience" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Achievements</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your achievements" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Timeline</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your timeline" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Section 4: Media</h3>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your skills" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Video Links</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <LinkIcon />
                            </InputGroupAddon>
                            <Textarea placeholder="Links to your videos" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Action Photos</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="press"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Press</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Press links or mentions" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Media Links</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <LinkIcon />
                            </InputGroupAddon>
                            <Textarea placeholder="Other media links" {...field} value={field.value ?? ""} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Section 5: Goals</h3>
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goals</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your goals" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Opportunities</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What opportunities are you looking for?" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Section 6: Brand</h3>
                  <FormField
                    control={form.control}
                    name="endorsements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endorsements</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your endorsements" {...field} value={field.value ?? ""} />
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
                        <FormLabel>Merchandise</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Links to your merchandise" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 7 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">
                    Section 7: Contact
                  </h3>
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Mail />
                            </InputGroupAddon>
                            <InputGroupInput
                              type="email"
                              placeholder="Your contact email"
                              {...field}
                              value={field.value ?? ""}
                            />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone />
                            </InputGroupAddon>
                            <InputGroupInput
                              type="tel"
                              placeholder="Your phone number"
                              {...field}
                              value={field.value ?? ""}
                            />
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
                        <FormLabel>Social Media</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <LinkIcon />
                            </InputGroupAddon>
                            <Textarea
                              placeholder="Links to your social media profiles"
                              {...field}
                              value={field.value ?? ""}
                            />
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
                        <FormLabel>Do you have a personal logo?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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

              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">
                    Section 8: Branding
                  </h3>
                  <FormField
                    control={form.control}
                    name="logoUpload"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel>Upload Your Logo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 9 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">
                    Section 9: Extras
                  </h3>
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel>Resume/CV</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel>References</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
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
                        <FormLabel>Certifications</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
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
                        <FormLabel>More Media</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                          />
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
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional comments"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" onClick={prevStep} disabled={loading}>
                    Previous
                  </Button>
                )}
                {step < 9 && (
                  <Button type="button" onClick={nextStep} disabled={loading || !form.formState.isValid}>
                    Next
                  </Button>
                )}
                {step === 9 && <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}