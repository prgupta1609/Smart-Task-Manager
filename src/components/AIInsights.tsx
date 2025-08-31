import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { Task } from '@/components/TaskCard';

interface AIInsightsProps {
  tasks: Task[];
}

export const AIInsights = ({ tasks }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInitialized, setAiInitialized] = useState(false);

  const initializeAI = async () => {
    try {
      await aiService.initialize();
      setAiInitialized(true);
    } catch (error) {
      console.error('Failed to initialize AI:', error);
    }
  };

  const generateInsights = async () => {
    if (tasks.length === 0) {
      setInsights(['No tasks available for analysis']);
      setRecommendations(['Start by adding some tasks to get personalized insights']);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateProductivityInsights(tasks);
      setInsights(result.insights);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights(['Unable to generate insights at this time']);
      setRecommendations(['Please try again later']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    generateInsights();
  }, [tasks]);

  if (loading && tasks.length > 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-muted-foreground">
            AI-powered analysis of your productivity patterns
          </p>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Analyzing your tasks...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-muted-foreground">
            AI-powered analysis of your productivity patterns
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateInsights}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Productivity Insights */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Productivity Insights</CardTitle>
            </div>
            <CardDescription>
              Analysis of your task completion patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-secondary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-secondary" />
              <CardTitle>Smart Recommendations</CardTitle>
            </div>
            <CardDescription>
              Personalized suggestions to boost your productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Status */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            <CardTitle>AI Engine Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${aiInitialized ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <p className="text-sm text-muted-foreground">
              {aiInitialized 
                ? 'AI engine loaded and ready for advanced analysis' 
                : 'AI engine initializing - using fallback analysis'
              }
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-start gap-3">
              <Target className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-accent mb-1">AI-Powered Features</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Smart task priority suggestions</li>
                  <li>• Productivity pattern analysis</li>
                  <li>• Personalized workflow recommendations</li>
                  <li>• Deadline urgency detection</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};