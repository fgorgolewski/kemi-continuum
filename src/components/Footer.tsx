const CONTACT_EMAIL = "hello@continuumbykemissa.com";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-minimal text-muted-foreground">
            CONTINUUM — STYLE STEWARDSHIP BY KEMISSA
          </div>
          <div className="text-minimal text-muted-foreground">
            For referred enquiries —{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground hover:text-muted-foreground transition-colors duration-300"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
