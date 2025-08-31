import { pipeline } from '@huggingface/transformers';

// AI service for task priority analysis
class AIService {
  private static instance: AIService;
  private classifier: any = null;
  private embedding: any = null;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async initialize() {
    try {
      // Initialize text classification pipeline for urgency detection
      try {
        this.classifier = await pipeline(
          'text-classification',
          'cardiffnlp/twitter-roberta-base-emotion-multilabel-latest',
          { device: 'webgpu', dtype: 'fp16' }
        );
      } catch (error) {
        // Fallback to CPU if WebGPU fails
        try {
          this.classifier = await pipeline('text-classification', 'cardiffnlp/twitter-roberta-base-emotion-multilabel-latest');
        } catch (fallbackError) {
          console.warn('Both WebGPU and CPU pipeline initialization failed:', fallbackError);
        }
      }

      console.log('AI Service initialized successfully');
    } catch (error) {
      console.warn('AI Service failed to initialize:', error);
    }
  }

  async analyzePriority(title: string, description?: string, deadline?: string): Promise<{
    suggestedPriority: 'high' | 'medium' | 'low' | 'none';
    confidence: number;
    reasoning: string;
  }> {
    const taskText = `${title} ${description || ''}`.toLowerCase();
    
    // Calculate urgency score based on keywords and deadline
    let urgencyScore = 0;
    let reasoning = [];

    // Keyword-based analysis
    const highPriorityKeywords = [
      'urgent', 'asap', 'emergency', 'critical', 'deadline', 'important',
      'meeting', 'presentation', 'client', 'boss', 'due', 'submit'
    ];
    
    const mediumPriorityKeywords = [
      'schedule', 'plan', 'review', 'check', 'update', 'prepare', 'organize'
    ];

    const lowPriorityKeywords = [
      'someday', 'maybe', 'eventually', 'hobby', 'leisure', 'fun'
    ];

    // Check for high priority keywords
    const highMatches = highPriorityKeywords.filter(keyword => taskText.includes(keyword));
    if (highMatches.length > 0) {
      urgencyScore += 0.7;
      reasoning.push(`Contains high-priority keywords: ${highMatches.join(', ')}`);
    }

    // Check for medium priority keywords
    const mediumMatches = mediumPriorityKeywords.filter(keyword => taskText.includes(keyword));
    if (mediumMatches.length > 0) {
      urgencyScore += 0.4;
      reasoning.push(`Contains medium-priority keywords: ${mediumMatches.join(', ')}`);
    }

    // Check for low priority keywords
    const lowMatches = lowPriorityKeywords.filter(keyword => taskText.includes(keyword));
    if (lowMatches.length > 0) {
      urgencyScore -= 0.3;
      reasoning.push(`Contains low-priority keywords: ${lowMatches.join(', ')}`);
    }

    // Deadline analysis
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline <= 1) {
        urgencyScore += 0.8;
        reasoning.push('Deadline is within 1 day');
      } else if (daysUntilDeadline <= 3) {
        urgencyScore += 0.6;
        reasoning.push('Deadline is within 3 days');
      } else if (daysUntilDeadline <= 7) {
        urgencyScore += 0.3;
        reasoning.push('Deadline is within a week');
      } else {
        reasoning.push(`Deadline is in ${daysUntilDeadline} days`);
      }
    }

    // Determine priority based on score
    let suggestedPriority: 'high' | 'medium' | 'low' | 'none';
    let confidence: number;

    if (urgencyScore >= 0.7) {
      suggestedPriority = 'high';
      confidence = Math.min(urgencyScore, 1.0);
    } else if (urgencyScore >= 0.4) {
      suggestedPriority = 'medium';
      confidence = urgencyScore;
    } else if (urgencyScore >= 0.1) {
      suggestedPriority = 'low';
      confidence = urgencyScore;
    } else {
      suggestedPriority = 'none';
      confidence = 1 - urgencyScore;
    }

    // Use AI classification if available
    if (this.classifier) {
      try {
        const result = await this.classifier(taskText);
        if (result && result.length > 0) {
          // Adjust based on emotion/sentiment
          const topResult = result[0];
          if (topResult.label?.toLowerCase().includes('anger') || 
              topResult.label?.toLowerCase().includes('fear')) {
            urgencyScore += 0.2;
            reasoning.push('AI detected urgency-related sentiment');
          }
        }
      } catch (error) {
        console.warn('AI classification failed:', error);
      }
    }

    return {
      suggestedPriority,
      confidence: Math.round(confidence * 100) / 100,
      reasoning: reasoning.length > 0 ? reasoning.join('; ') : 'Analysis based on content and deadline'
    };
  }

  async generateProductivityInsights(tasks: any[]): Promise<{
    insights: string[];
    recommendations: string[];
  }> {
    const insights = [];
    const recommendations = [];

    // Analyze task distribution
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const overdueTasks = tasks.filter(t => 
      t.deadline && new Date(t.deadline) < new Date() && !t.completed
    ).length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    insights.push(`You have completed ${completedTasks} out of ${totalTasks} tasks (${Math.round(completionRate)}% completion rate)`);

    if (overdueTasks > 0) {
      insights.push(`You have ${overdueTasks} overdue tasks that need attention`);
      recommendations.push('Focus on completing overdue tasks to improve your productivity');
    }

    // Priority distribution analysis
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    if (priorityCounts.high > priorityCounts.medium + priorityCounts.low) {
      recommendations.push('Consider breaking down high-priority tasks into smaller, manageable steps');
    }

    if (completionRate < 50) {
      recommendations.push('Try the Pomodoro Technique: work for 25 minutes, then take a 5-minute break');
    } else if (completionRate > 80) {
      insights.push('Great job! You\'re maintaining excellent productivity');
    }

    // Category analysis
    const categories = [...new Set(tasks.map(t => t.category))];
    if (categories.length > 5) {
      recommendations.push('Consider consolidating similar categories to better organize your tasks');
    }

    return { insights, recommendations };
  }
}

export const aiService = AIService.getInstance();