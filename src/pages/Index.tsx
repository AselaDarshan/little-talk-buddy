import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Seo from "@/components/Seo";
import heroDoodle from "@/assets/welcome-doodle.png";
const Index = () => {
  const { toast } = useToast();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const feature = (fd.get("feature") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    if (!feature) {
      toast({
        title: "Feature request",
        description: "Please describe the feature you’d like.",
        variant: "destructive",
      });
      return;
    }
    console.log("Feature request:", { feature, email });
    toast({ title: "Thank you!", description: "We’ve received your request." });
    e.currentTarget.reset();
  };

  const sd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toddler Speech & Language Tools",
    url: typeof window !== "undefined" ? window.location.origin : "",
  } as const;

  return (
    <>
      <Seo
        title="Toddler Speech & Language Tools"
        description="Free toddler speech screening and simple tools for 12–36 month language development."
        canonicalPath="/"
        structuredData={sd}
      />

      <div className="min-h-dvh flex flex-col">
        <header className="py-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold tracking-tight">
              Toddler Speech & Language
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/screening">
                <Button size="sm">Start Screening</Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <section className="py-16 md:py-24 text-center bg-gradient-to-b from-primary/10 to-transparent rounded-2xl">
            <div className="max-w-3xl mx-auto px-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Toddler Speech & Language Development Tools</h1>
              <p className="mt-4 text-muted-foreground">
                Help your toddler thrive with quick checks and parent-friendly guidance.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/screening">
                  <Button size="lg">Free Screening (12–36 months)</Button>
                </Link>
              </div>
              <div className="mt-10 flex justify-center">
                <img
                  src={heroDoodle}
                  alt="Toddler speech screening doodle illustration"
                  loading="lazy"
                  className="w-[320px] h-auto drop-shadow-md"
                />
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Screening Tool</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Answer quick questions aligned with ASHA and Speech Pathology Australia.
              </p>
              <Link to="/screening" className="inline-block mt-4">
                <Button variant="secondary">Start now</Button>
              </Link>
            </article>

            <article className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
              <h3 className="font-medium">Daily Language Activities</h3>
              <p className="text-sm text-muted-foreground mt-2">Short, playful ideas to build skills.</p>
              <span className="mt-3 inline-flex text-xs px-2 py-1 rounded-full bg-muted">Coming soon</span>
            </article>

            <article className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
              <h3 className="font-medium">Progress Tracker</h3>
              <p className="text-sm text-muted-foreground mt-2">Track milestones and celebrate growth.</p>
              <span className="mt-3 inline-flex text-xs px-2 py-1 rounded-full bg-muted">Coming soon</span>
            </article>
          </section>

          <section className="mt-12">
            <div className="bg-muted/40 rounded-xl border p-6">
              <h2 className="text-xl font-semibold">Request a feature</h2>
              <p className="text-sm text-muted-foreground">
                What would help you most? We’re building more tools—tell us what to add next.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Textarea name="feature" placeholder="Describe your idea" aria-label="Feature request" />
                </div>
                <div className="flex flex-col gap-3">
                  <Input name="email" type="email" placeholder="Email (optional)" aria-label="Email" />
                  <Button type="submit" className="w-full">Submit request</Button>
                </div>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">
                We may contact you for clarification—your feedback guides our roadmap.
              </p>
            </div>
          </section>
        </main>

      </div>
    </>
  );
};

export default Index;
