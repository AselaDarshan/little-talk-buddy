import Seo from "@/components/Seo";
import SpeechScreening from "@/components/SpeechScreening";

const Screening = () => {
  return (
    <>
      <Seo
        title="Toddler Speech Screening"
        description="Quick, parent-friendly speech and language screening for toddlers aged 12–36 months."
        canonicalPath="/screening"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Toddler Speech Screening",
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          url:
            (typeof window !== "undefined" ? window.location.origin : "") +
            "/screening",
        }}
      />
      <SpeechScreening />
    </>
  );
};

export default Screening;
