import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Baby, Users, Sparkles, Heart, Star, ThumbsUp, ThumbsDown, Home, Loader2 } from "lucide-react";
import { analytics } from "@/lib/analytics";
import welcomeBackground from "@/assets/welcome-background.png";
import calmingPattern from "@/assets/calming-pattern.jpg";
import { Link } from "react-router-dom";

interface Milestone {
  id: string;
  question: string;
  ageRange: string;
  category: string;
}

interface AgeGroup {
  id: string;
  name: string;
  range: string;
  icon: string;
  milestones: Milestone[];
}

const ageGroups: AgeGroup[] = [
  {
    id: "12-18",
    name: "12-18 months",
    range: "12-18 months",
    icon: "👶",
    milestones: [
      {
        id: "m1",
        question: "Says first words like 'mama', 'dada', or 'bye-bye'",
        ageRange: "12-18 months",
        category: "Speech"
      },
      {
        id: "m2",
        question: "Responds to their name when called",
        ageRange: "12-18 months",
        category: "Understanding"
      },
      {
        id: "m3",
        question: "Uses gestures to communicate (pointing, showing, waving)",
        ageRange: "12-18 months",
        category: "Communication"
      },
      {
        id: "m4",
        question: "Tries to copy sounds and words you say",
        ageRange: "12-18 months",
        category: "Speech"
      }
    ]
  },
  {
    id: "18-24",
    name: "18-24 months",
    range: "18-24 months",
    icon: "🧒",
    milestones: [
      {
        id: "m5",
        question: "Says at least 20 different words",
        ageRange: "18-24 months",
        category: "Speech"
      },
      {
        id: "m6",
        question: "Follows simple one-step directions without gestures (e.g., 'get your shoes')",
        ageRange: "18-24 months",
        category: "Understanding"
      },
      {
        id: "m7",
        question: "Points to body parts or familiar pictures when named",
        ageRange: "18-24 months",
        category: "Understanding"
      },
      {
        id: "m8",
        question: "Imitates new words and sounds during play",
        ageRange: "18-24 months",
        category: "Speech"
      }
    ]
  },
  {
    id: "24-36",
    name: "2-3 years",
    range: "24-36 months",
    icon: "👦",
    milestones: [
      {
        id: "m9",
        question: "Puts 2-3 words together ('want cookie', 'go car')",
        ageRange: "24-36 months",
        category: "Speech"
      },
      {
        id: "m10",
        question: "Has 50+ words in vocabulary",
        ageRange: "24-36 months",
        category: "Speech"
      },
      {
        id: "m11",
        question: "Strangers can understand about half of what they say",
        ageRange: "24-36 months",
        category: "Speech"
      },
      {
        id: "m12",
        question: "Follows two-step directions like 'get your cup and sit down'",
        ageRange: "24-36 months",
        category: "Understanding"
      }
    ]
  }
];

type ScreeningStep = "welcome" | "age-selection" | "screening" | "results";

export default function SpeechScreening() {
  const [currentStep, setCurrentStep] = useState<ScreeningStep>("welcome");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [feedback, setFeedback] = useState({ rating: 0, comment: "", submitted: false });

  const [welcomeLoaded, setWelcomeLoaded] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const sources = [welcomeBackground];
    Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    ).then(() => {
      if (isMounted) setWelcomeLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAgeSelection = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
    setCurrentStep("screening");
    analytics.selectAgeGroup(ageGroup.name);
    analytics.startScreening(ageGroup.name);
  };

  const handleAnswer = (milestoneId: string, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [milestoneId]: answer }));
    analytics.answerQuestion(milestoneId, answer);
    
    if (selectedAgeGroup && currentQuestionIndex < selectedAgeGroup.milestones.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep("results");
      if (selectedAgeGroup) {
        const results = calculateResults();
        analytics.completeScreening(selectedAgeGroup.name, results.score, results.percentage);
      }
    }
  };

  const calculateResults = () => {
    if (!selectedAgeGroup) return { score: 0, total: 0, percentage: 0 };
    
    const total = selectedAgeGroup.milestones.length;
    const achieved = Object.values(answers).filter(Boolean).length;
    const percentage = Math.round((achieved / total) * 100);
    
    return { score: achieved, total, percentage };
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 80) {
      return {
        type: "success" as const,
        title: "Great Development!",
        message: "Your child appears to be meeting most speech milestones for their age. Keep encouraging their communication!"
      };
    } else if (percentage >= 60) {
      return {
        type: "warning" as const,
        title: "Some Concerns",
        message: "Your child is meeting some milestones but may benefit from additional support or evaluation."
      };
    } else {
      return {
        type: "warning" as const,
        title: "Consider Professional Help",
        message: "Your child may benefit from a professional speech evaluation. Early intervention can be very helpful."
      };
    }
  };

  const handleFeedbackSubmit = () => {
    setFeedback(prev => ({ ...prev, submitted: true }));
    analytics.provideFeedback(feedback.rating, feedback.comment);
  };

  const resetScreening = () => {
    setCurrentStep("welcome");
    setSelectedAgeGroup(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setFeedback({ rating: 0, comment: "", submitted: false });
    analytics.restartScreening();
  };

if (currentStep === "welcome" && !welcomeLoaded) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-background p-4 pb-safe-bottom relative"
           style={{ 
             minHeight: '100dvh',
             backgroundImage: `url(${welcomeBackground})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }}>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <header className="flex items-center justify-between py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="text-sm font-medium">Toddler Speech Screening</div>
          </header>
          <Card className="border-primary/20 shadow-xl backdrop-blur-sm bg-card/95 animate-fade-in">
            <CardHeader className="text-center space-y-4 pt-8">
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-sky bg-clip-text text-transparent">
                Speech Development Screening
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                A simple tool to help parents track their child's speech and language milestones
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-accent to-sky-soft p-4 rounded-lg border border-accent/30">
                <h3 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Important Note
                </h3>
                <p className="text-sm text-accent-foreground">
                  This screening is not a diagnostic tool. It's designed to help you understand typical speech development 
                  and identify when you might want to consult with a speech-language pathologist or pediatrician.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-success-soft to-success/10 rounded-lg border border-success/20">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm text-success font-medium">Takes 2-3 minutes to complete</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-soft to-primary/10 rounded-lg border border-primary/20">
                  <Baby className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-primary font-medium">Age-appropriate milestones</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-coral-soft to-coral/10 rounded-lg border border-coral/20">
                  <Users className="w-5 h-5 text-coral flex-shrink-0" />
                  <span className="text-sm text-coral font-medium">Guidance for next steps</span>
                </div>
              </div>

              <div className="bg-muted/40 p-4 rounded-lg border border-muted/30">
                <h3 className="font-semibold mb-2">Bilingual children</h3>
                <p className="text-sm text-muted-foreground">
                  Hearing two languages does not cause speech delay. Count words across all languages, and mixing languages is typical.
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Sources: American Speech-Language-Hearing Association (ASHA); Speech Pathology Australia.
              </p>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => setCurrentStep("age-selection")} 
                className="w-full bg-gradient-to-r from-primary to-sky hover:from-primary/90 hover:to-sky/90 shadow-lg"
                size="lg"
              >
                Start Screening
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "age-selection") {
    return (
      <div className="min-h-screen bg-background p-4 pb-safe-bottom relative" style={{ minHeight: '100dvh', backgroundImage: `url(${calmingPattern})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <header className="flex items-center justify-between py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="text-sm font-medium">Toddler Speech Screening</div>
          </header>
          <Card className="backdrop-blur-sm bg-card/95 shadow-xl animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-coral bg-clip-text text-transparent">
                Select Your Child's Age
              </CardTitle>
              <CardDescription className="text-base">
                Choose the age group that best matches your child's current age
              </CardDescription>
            </CardHeader>
            
            
            <CardContent className="space-y-4">
              {ageGroups.map((group) => (
                <Button
                  key={group.id}
                  variant="outline"
                  className="w-full p-6 h-auto justify-start text-left hover:bg-gradient-to-r hover:from-primary-soft hover:to-sky-soft hover:border-primary/50 transition-all duration-300 group"
                  onClick={() => handleAgeSelection(group)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-coral-soft to-primary-soft rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {group.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{group.name}</div>
                      <div className="text-sm text-muted-foreground">{group.milestones.length} milestones to check</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep("welcome");
                  analytics.goBack("age-selection");
                }} 
                className="w-full"
              >
                Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "screening" && selectedAgeGroup) {
    const currentMilestone = selectedAgeGroup.milestones[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / selectedAgeGroup.milestones.length) * 100;

    return (
      <div className="min-h-screen bg-background p-4 pb-safe-bottom relative" style={{ minHeight: '100dvh', backgroundImage: `url(${calmingPattern})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <header className="flex items-center justify-between py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="text-sm font-medium">Toddler Speech Screening</div>
          </header>
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {selectedAgeGroup.milestones.length}
              </span>
              <Badge variant="outline">{selectedAgeGroup.name}</Badge>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
          </div>
          
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent text-accent-foreground">{currentMilestone.category}</Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentMilestone.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Does your child currently do this?
              </p>
              
              <div className="grid gap-4 mb-6">
                <Button
                  onClick={() => handleAnswer(currentMilestone.id, true)}
                  className="w-full p-4 h-auto bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Yes, they do this
                </Button>
                
                <Button
                  onClick={() => handleAnswer(currentMilestone.id, false)}
                  variant="outline"
                  className="w-full p-4 h-auto border-coral/40 hover:bg-gradient-to-r hover:from-coral-soft hover:to-warning-soft transition-all duration-300 hover:scale-[1.02] hover:border-coral/60"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Not yet or rarely
                </Button>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "results") {
    const results = calculateResults();
    const resultMessage = getResultMessage(results.percentage);

    return (
      <div className="min-h-screen bg-background p-4 pb-safe-bottom relative" style={{ minHeight: '100dvh', backgroundImage: `url(${calmingPattern})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <header className="flex items-center justify-between py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="text-sm font-medium">Toddler Speech Screening</div>
          </header>
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center animate-scale-in ${
                resultMessage.type === "success" ? "bg-success-soft" : "bg-warning-soft"
              }`}>
                {resultMessage.type === "success" ? (
                  <CheckCircle className="w-10 h-10 text-success" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-warning" />
                )}
              </div>
              <CardTitle className="text-2xl">{resultMessage.title}</CardTitle>
              <CardDescription className="text-base">
                {resultMessage.message}
              </CardDescription>
            </CardHeader>
            
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {results.score}/{results.total}
                </div>
                <div className="text-muted-foreground">
                  Milestones achieved ({results.percentage}%)
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-accent to-sky-soft p-5 rounded-lg border border-accent/30">
                <h3 className="font-semibold text-accent-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  What's Next?
                </h3>
                <ul className="text-sm text-accent-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Continue reading and talking with your child daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-coral">•</span>
                    <span>Play interactive games and sing songs together</span>
                  </li>
                  {results.percentage < 80 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-warning">•</span>
                        <span>Consider discussing results with your pediatrician</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky">•</span>
                        <span>Look into early intervention services if recommended</span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    <span>Re-screen in 3-6 months to track progress</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                How was your experience?
              </CardTitle>
              <CardDescription>
                Your feedback helps us improve this screening tool for other parents
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!feedback.submitted ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rate your experience</label>
                    <div className="flex gap-2">
                      <Button
                        variant={feedback.rating === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFeedback(prev => ({ ...prev, rating: 1 }))}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Not helpful
                      </Button>
                      <Button
                        variant={feedback.rating === 5 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFeedback(prev => ({ ...prev, rating: 5 }))}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Very helpful
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Comments (optional)</label>
                    <Textarea
                      placeholder="Tell us how we can improve this tool..."
                      value={feedback.comment}
                      onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleFeedbackSubmit}
                    disabled={feedback.rating === 0}
                    className="w-full"
                  >
                    Submit Feedback
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-gradient-to-r from-success-soft to-success/10 rounded-lg border border-success/20">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="font-medium text-success">Thank you for your feedback!</p>
                  <p className="text-sm text-success/80">Your input helps us make this tool better for all families.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={resetScreening} className="flex-1">
              Screen Again
            </Button>
            <Button 
              onClick={() => {
                window.print();
                if (selectedAgeGroup) {
                  const results = calculateResults();
                  analytics.saveResults(selectedAgeGroup.name, results.percentage);
                }
              }} 
              className="flex-1"
            >
              Save Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
