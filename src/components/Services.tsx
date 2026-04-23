const Services = () => {
  const services = [
    {
      number: "I",
      title: "INITIAL ENGAGEMENT",
      meta: "Three months",
      description: "Nothing here is templated. A full audit of where things stand — what stays, what goes, and what needs to be built — followed by a complete rebuild shaped entirely around you. Wardrobe sourcing, framework, grooming baseline, digital wardrobe, and an Annual Style Map. The foundation everything else runs on. At the close, those who wish to continue move into a retainer. Most do."
    },
    {
      number: "II",
      title: "RETAINER",
      meta: "Ongoing",
      description: "A standing system of judgment and oversight — not task-based, not reactive. Continuous wardrobe oversight, real-time guidance, ongoing wardrobe sourcing, digital wardrobe maintenance, and event and travel guidance within expected cadence. You don't manage this. That's the point."
    },
    {
      number: "III",
      title: "INTENSIVES",
      meta: "Activated as required",
      description: "The expected is already accounted for. At the start of the retainer, we map the year — every known event, trip, and visibility moment planned in advance. Intensives exist for what the calendar couldn't predict. When something unforeseen demands more than the retainer's cadence allows, one is activated. Scoped, priced, and executed separately, so everything already running stays undisturbed."
    }
  ];

  return (
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">ENGAGEMENT</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Structure of the relationship
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-6">
                  <span className="text-minimal text-muted-foreground font-medium">
                    {service.number}
                  </span>
                  <div>
                    <h4 className="text-2xl font-light mb-2 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                      {service.title}
                    </h4>
                    <p className="text-minimal text-muted-foreground mb-4">
                      {service.meta}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;