import {
  AboutSection,
  BlogSection,
  CertificationsSection,
  ContactSection,
  EducationProjectsSection,
  ExperienceSection,
  FeaturesSection,
  HeroSection,
  ServicesSection,
  SkillsSection,
  TestimonialsSection,
} from "@/components/sections";

async function PortfolioContent() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      {/* <TestimonialsSection /> */}
      <SkillsSection />
      <ExperienceSection />
      <EducationProjectsSection />
      <CertificationsSection />
      <ServicesSection />
      {/* <BlogSection /> */}
      <ContactSection />
    </>
  );
}

export default PortfolioContent;
