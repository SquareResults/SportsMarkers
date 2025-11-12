"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type Portfolio = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  sport: string;
  profile_picture_url?: string;
  bio?: string;
  background?: string;
  experience?: string;
  achievements?: string;
  timeline?: string;
  skills?: string;
  video_links?: string[];
  action_photos_urls?: string[];
  press?: string;
  media_links?: string[];
  goals?: string;
  opportunities?: string;
  endorsements?: string;
  merch?: string;
  contact_email: string;
  phone?: string;
  socials?: string[];
  has_logo: boolean;
  logo_url?: string;
  resume_url?: string;
  references_url?: string;
  certifications_url?: string;
  more_media_urls?: string[];
  comments?: string;
};

export default function ProfilePage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching portfolio:", error);
      } else {
        setPortfolio(data);
      }
      setLoading(false);
    };

    fetchPortfolio();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Portfolio not found.</p>
        <Button onClick={() => router.push("/create")} className="mt-4">
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={portfolio.profile_picture_url} alt="Profile" />
              <AvatarFallback>
                {portfolio.first_name.charAt(0)}
                {portfolio.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-4xl font-bold">
                {portfolio.first_name} {portfolio.middle_name}{" "}
                {portfolio.last_name}
              </CardTitle>
              <p className="text-xl text-gray-600">{portfolio.sport}</p>
            </div>
          </div>
          <Button onClick={() => router.push("/profile/edit")}>
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              {portfolio.logo_url && (
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-4">Logo</h2>
                  <img
                    src={portfolio.logo_url}
                    alt="Logo"
                    className="w-1/2 h-auto rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2">
                Contact Information
              </h2>
              <p>
                <strong>Email:</strong> {portfolio.contact_email}
              </p>
              {portfolio.phone && (
                <p>
                  <strong>Phone:</strong> {portfolio.phone}
                </p>
              )}
              {portfolio.socials && portfolio.socials.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Socials</h3>
                  <ul className="list-disc list-inside">
                    {portfolio.socials.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-6">
              {portfolio.bio && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Bio</h2>
                  <p>{portfolio.bio}</p>
                </div>
              )}
              {portfolio.background && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Background</h2>
                  <p>{portfolio.background}</p>
                </div>
              )}
              {portfolio.experience && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Experience</h2>
                  <p>{portfolio.experience}</p>
                </div>
              )}
              {portfolio.achievements && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Achievements</h2>
                  <p>{portfolio.achievements}</p>
                </div>
              )}
              {portfolio.timeline && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Timeline</h2>
                  <p>{portfolio.timeline}</p>
                </div>
              )}
              {portfolio.skills && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Skills</h2>
                  <p>{portfolio.skills}</p>
                </div>
              )}
              {portfolio.goals && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Goals</h2>
                  <p>{portfolio.goals}</p>
                </div>
              )}
              {portfolio.opportunities && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Opportunities</h2>
                  <p>{portfolio.opportunities}</p>
                </div>
              )}
              {portfolio.endorsements && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Endorsements</h2>
                  <p>{portfolio.endorsements}</p>
                </div>
              )}
              {portfolio.merch && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Merch</h2>
                  <p>{portfolio.merch}</p>
                </div>
              )}
              {portfolio.press && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Press</h2>
                  <p>{portfolio.press}</p>
                </div>
              )}
              {portfolio.comments && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Comments</h2>
                  <p>{portfolio.comments}</p>
                </div>
              )}
              {portfolio.video_links && portfolio.video_links.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Video Links</h2>
                  <ul className="list-disc list-inside">
                    {portfolio.video_links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {portfolio.media_links && portfolio.media_links.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Media Links</h2>
                  <ul className="list-disc list-inside">
                    {portfolio.media_links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {portfolio.action_photos_urls &&
                portfolio.action_photos_urls.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      Action Photos
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {portfolio.action_photos_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Action photo ${index + 1}`}
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              {portfolio.more_media_urls &&
                portfolio.more_media_urls.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">More Media</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {portfolio.more_media_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              {portfolio.resume_url && (
                <div className="mt-6">
                  <a
                    href={portfolio.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              )}
              {portfolio.references_url && (
                <div className="mt-6">
                  <a
                    href={portfolio.references_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View References
                  </a>
                </div>
              )}
              {portfolio.certifications_url && (
                <div className="mt-6">
                  <a
                    href={portfolio.certifications_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Certifications
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
