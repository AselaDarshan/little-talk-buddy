import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Baby, Users, Sparkles } from "lucide-react";

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
        question: "Points to show you something interesting",
        ageRange: "12-18 months", 
        category: "Communication"
      },
      {
        id: "m4",
        question: "Waves goodbye or claps hands",
        ageRange: "12-18 months",
        category: "Social"
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
        question: "Says 10-20 words clearly",
        ageRange: "18-24 months",
        category: "Speech"
      },
      {
        id: "m6",
        question: "Follows simple commands like 'get your shoes'",
        ageRange: "18-24 months", 
        category: "Understanding"
      },
      {
        id: "m7",
        question: "Points to body parts when asked",
        ageRange: "18-24 months",
        category: "Understanding"
      },
      {
        id: "m8",
        question: "Shows interest in other children",
        ageRange: "18-24 months",
        category: "Social"
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
        question: "Asks simple questions like 'What's that?'",
        ageRange: "24-36 months", 
        category: "Communication"
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

  const handleAgeSelection = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
    setCurrentStep("screening");
  };

  const handleAnswer = (milestoneId: string, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [milestoneId]: answer }));
    
    if (selectedAgeGroup && currentQuestionIndex < selectedAgeGroup.milestones.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep("results");
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

  const resetScreening = () => {
    setCurrentStep("welcome");
    setSelectedAgeGroup(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Speech Development Screening</CardTitle>
              <CardDescription className="text-base">
                A simple tool to help parents track their child's speech and language milestones
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-accent p-4 rounded-lg">
                <h3 className="font-semibold text-accent-foreground mb-2">Important Note</h3>
                <p className="text-sm text-accent-foreground">
                  This screening is not a diagnostic tool. It's designed to help you understand typical speech development 
                  and identify when you might want to consult with a speech-language pathologist or pediatrician.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-success-soft rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm text-success-foreground">Takes 2-3 minutes to complete</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary-soft rounded-lg">
                  <Baby className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-primary">Age-appropriate milestones</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Users className="w-5 h-5 text-secondary-foreground flex-shrink-0" />
                  <span className="text-sm text-secondary-foreground">Guidance for next steps</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => setCurrentStep("age-selection")} 
                className="w-full"
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-primary">Select Your Child's Age</CardTitle>
              <CardDescription>
                Choose the age group that best matches your child's current age
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {ageGroups.map((group) => (
                <Button
                  key={group.id}
                  variant="outline"
                  className="w-full p-6 h-auto justify-start text-left hover:bg-primary-soft hover:border-primary"
                  onClick={() => handleAgeSelection(group)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <div className="font-semibold">{group.name}</div>
                      <div className="text-sm text-muted-foreground">{group.milestones.length} milestones to check</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" onClick={() => setCurrentStep("welcome")} className="w-full">
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {selectedAgeGroup.milestones.length}
              </span>
              <Badge variant="outline">{selectedAgeGroup.name}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent text-accent-foreground">{currentMilestone.category}</Badge>
              </div>
              <CardTitle className="text-lg leading-relaxed">
                {currentMilestone.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Does your child currently do this?
              </p>
              
              <div className="grid gap-3">
                <Button
                  onClick={() => handleAnswer(currentMilestone.id, true)}
                  className="w-full p-4 h-auto bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Yes, they do this
                </Button>
                
                <Button
                  onClick={() => handleAnswer(currentMilestone.id, false)}
                  variant="outline"
                  className="w-full p-4 h-auto border-warning/30 hover:bg-warning-soft"
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                resultMessage.type === "success" ? "bg-success-soft" : "bg-warning-soft"
              }`}>
                {resultMessage.type === "success" ? (
                  <CheckCircle className="w-8 h-8 text-success" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-warning" />
                )}
              </div>
              <CardTitle className="text-xl">{resultMessage.title}</CardTitle>
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
              
              <div className="bg-accent p-4 rounded-lg">
                <h3 className="font-semibold text-accent-foreground mb-2">What's Next?</h3>
                <ul className="text-sm text-accent-foreground space-y-1">
                  <li>• Continue reading and talking with your child daily</li>
                  <li>• Play interactive games and sing songs together</li>
                  {results.percentage < 80 && (
                    <>
                      <li>• Consider discussing results with your pediatrician</li>
                      <li>• Look into early intervention services if recommended</li>
                    </>
                  )}
                  <li>• Re-screen in 3-6 months to track progress</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="gap-2">
              <Button variant="outline" onClick={resetScreening} className="flex-1">
                Screen Another Age
              </Button>
              <Button onClick={() => window.print()} className="flex-1">
                Save Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}