import Navigation from "@/components/Navigation";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20">
              <div>
                <h1 className="text-minimal text-muted-foreground mb-4">ENQUIRY</h1>
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
                    <a href="mailto:kemissa@continuum.practice" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                      kemissa@continuum.practice
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-minimal text-muted-foreground mb-6">RESPONSE</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Enquiries are read directly by Kemissa. Replies are sent within
                    seven days.
                  </p>
                </div>

                <div className="pt-12 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    The practice maintains a small client list and operates without
                    public sales or marketing. Fit is determined before pricing is
                    discussed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;