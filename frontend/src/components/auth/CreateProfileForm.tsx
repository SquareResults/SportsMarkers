"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema = z.object({
  // Section 1
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  sport: z.string().min(1, "Sport is required"),
  profilePicture: z.any().optional(),

  // Section 2
  bio: z.string().optional(),
  background: z.string().optional(),

  // Section 3
  experience: z.string().optional(),
  achievements: z.string().optional(),
  timeline: z.string().optional(),

  // Section 4
  skills: z.string().optional(),
  videoLinks: z.string().optional(),
  actionPhotos: z.any().optional(),
  press: z.string().optional(),
  mediaLinks: z.string().optional(),

  // Section 5
  goals: z.string().optional(),
  opportunities: z.string().optional(),

  // Section 6
  endorsements: z.string().optional(),
  merch: z.string().optional(),

  // Section 7
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  socials: z.string().optional(),
  hasLogo: z.string().optional(),

  // Section 8
  logoUpload: z.any().optional(),

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
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    // For now, just log the values
    console.log(values);
    alert("Form submitted! Check the console for the form data.");
  }

  const nextStep = () => setStep((prev) => prev + 1);
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
                          <Input placeholder="Your first name" {...field} />
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
                            placeholder="Your middle name (optional)"
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
                          <Input placeholder="Your last name" {...field} />
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
                            placeholder="e.g., Basketball, Soccer, Track & Field"
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} />
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
                          <Textarea placeholder="Tell us about yourself" {...field} />
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
                          <Textarea placeholder="Your background" {...field} />
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
                          <Textarea placeholder="Your experience" {...field} />
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
                          <Textarea placeholder="Your achievements" {...field} />
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
                          <Textarea placeholder="Your timeline" {...field} />
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
                          <Textarea placeholder="Your skills" {...field} />
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
                          <Textarea placeholder="Links to your videos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="actionPhotos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action Photos</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} multiple />
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
                          <Textarea placeholder="Press links or mentions" {...field} />
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
                          <Textarea placeholder="Other media links" {...field} />
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
                          <Textarea placeholder="Your goals" {...field} />
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
                          <Textarea placeholder="What opportunities are you looking for?" {...field} />
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
                          <Textarea placeholder="Your endorsements" {...field} />
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
                          <Textarea placeholder="Links to your merchandise" {...field} />
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
                          <Input
                            type="email"
                            placeholder="Your contact email"
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Your phone number"
                            {...field}
                          />
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
                          <Textarea
                            placeholder="Links to your social media profiles"
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Your Logo</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} />
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume/CV</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>References</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="moreMedia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>More Media</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} multiple />
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
                  <Button type="button" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {step < 9 && (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                )}
                {step === 9 && <Button type="submit">Submit</Button>}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}