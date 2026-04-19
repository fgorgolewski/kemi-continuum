import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h1 className="text-minimal text-muted-foreground mb-4">PRACTICE</h1>
                <h2 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                  Advisory, not execution
                </h2>

                <div className="space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Continuum is a private advisory practice. Clients delegate
                    decision-making, visual coherence, and presentation management.
                    The practice removes the need to think through their
                    presentation independently.
                  </p>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The function is continuity: appearance, grooming, and external
                    signals held in coherence with professional standing over time.
                    Judgment is the product. Execution is the byproduct.
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-minimal text-muted-foreground mb-6">APPROACH</h3>
                  <div className="space-y-6">
                    <div className="border-l-2 border-architectural pl-6">
                      <h4 className="text-lg font-medium mb-2">Judgment</h4>
                      <p className="text-muted-foreground">Decisions made on the client's behalf, inside an agreed framework.</p>
                    </div>
                    <div className="border-l-2 border-architectural pl-6">
                      <h4 className="text-lg font-medium mb-2">Discretion</h4>
                      <p className="text-muted-foreground">The practice operates in the background of a client's life.</p>
                    </div>
                    <div className="border-l-2 border-architectural pl-6">
                      <h4 className="text-lg font-medium mb-2">Continuity</h4>
                      <p className="text-muted-foreground">The system holds; clients do not manage it.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-minimal text-muted-foreground mb-2">CLIENT CAP</h3>
                      <p className="text-xl">4–5</p>
                    </div>
                    <div>
                      <h3 className="text-minimal text-muted-foreground mb-2">ACQUISITION</h3>
                      <p className="text-xl">Referral only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;