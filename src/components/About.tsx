const About = () => {
  return (
    <section id="about" className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">PRACTICE</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Thought through.
                <br />
                Taken care of.
              </h3>

              <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Continuum is a private style practice — intentionally small,
                  deliberately selective. You delegate the thinking, the
                  decisions, and the doing — how you dress, how you groom, how
                  you show up. None of it stays on your plate.
                </p>

                <p className="text-lg italic text-foreground/80 leading-relaxed">
                  The approach adapts. The standard doesn't.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  The goal is coherence that holds over time — how you look,
                  in alignment with who you are and where you're going. The
                  thinking is ours. The execution is ours. The results are
                  yours.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">APPROACH</h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Direction</h5>
                    <p className="text-muted-foreground">
                      Every aesthetic decision made on your behalf — within a
                      framework built entirely around you.
                    </p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Discretion</h5>
                    <p className="text-muted-foreground">
                      The work happens in the background. You feel the results,
                      not the process.
                    </p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Continuity</h5>
                    <p className="text-muted-foreground">
                      Once the system is in place, it holds. You don't touch
                      it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <h4 className="text-minimal text-muted-foreground mb-2">CLIENT CAP</h4>
                <p className="text-xl">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
