const Services = () => {
  const services = [
    {
      number: "I",
      title: "INITIAL ENGAGEMENT",
      meta: "Three months",
      description: "A fixed, high-touch engagement that audits, rebuilds, and systemizes the client's approach to presentation. Includes intake and alignment, wardrobe audit, style framework, initial sourcing and tailoring, grooming baseline, the digital wardrobe, and the Annual Presentation Map."
    },
    {
      number: "II",
      title: "RETAINER",
      meta: "Ongoing",
      description: "A standing system of judgment and control. Not task-based. Continuous oversight of wardrobe, real-time guidance, light sourcing, and maintenance of the digital wardrobe. Event and travel guidance within expected cadence."
    },
    {
      number: "III",
      title: "INTENSIVES",
      meta: "Activated as required",
      description: "Discrete engagements activated when scope, timeline, or visibility exceed retainer cadence. Structured and priced separately to preserve clarity and time control. Event-based styling, travel wardrobe planning, seasonal resets, expanded gifting, grooming systems."
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