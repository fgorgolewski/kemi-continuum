import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CONTACT_EMAIL = "kemissa@continuum.practice";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Referred by: ${referredBy || "—"}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    toast({
      title: "Inquiry prepared",
      description: "Your email client will open with the message ready to send.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20">
              <div>
                <h1 className="text-minimal text-muted-foreground mb-4">INQUIRY</h1>
                <h2 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                  By referral
                </h2>

                <div className="space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Continuum operates by referral. Introductions from existing
                    clients and trusted collaborators are reviewed in confidence.
                  </p>

                  <div>
                    <h3 className="text-minimal text-muted-foreground mb-2">EMAIL</h3>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-xl hover:text-muted-foreground transition-colors duration-300"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>

                  <div className="pt-8 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      Inquiries are read directly by Kemissa. Replies are sent
                      within seven days. The practice maintains a small client
                      list and operates without public sales or marketing. Fit
                      is determined before pricing is discussed.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-minimal text-muted-foreground">
                    NAME
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-minimal text-muted-foreground">
                    EMAIL
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referredBy" className="text-minimal text-muted-foreground">
                    REFERRED BY
                  </Label>
                  <Input
                    id="referredBy"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    className="bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-minimal text-muted-foreground">
                    MESSAGE
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="bg-transparent resize-none"
                  />
                </div>

                <Button type="submit" variant="outline" className="w-full">
                  Send inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;