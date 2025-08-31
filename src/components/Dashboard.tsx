import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, Target } from "lucide-react";
import { Task } from "./TaskCard";

interface DashboardProps {
  tasks: Task[];
}

export const Dashboard = ({ tasks }: DashboardProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  
  const overdueTasks = tasks.filter(task => {
    if (!task.deadline || task.completed) return false;
    return new Date(task.deadline) < new Date();
  }).length;

  const todayTasks = tasks.filter(task => {
    if (!task.deadline) return false;
    const today = new Date().toDateString();
    return new Date(task.deadline).toDateString() === today;
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your task management and productivity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          subtitle="All time"
          icon={Target}
          gradient="from-blue-500 to-blue-600"
        />
        
        <StatsCard
          title="Completed"
          value={completedTasks}
          subtitle={`${completionRate}% completion rate`}
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
        />
        
        <StatsCard
          title="Pending"
          value={pendingTasks}
          subtitle="Tasks remaining"
          icon={Clock}
          gradient="from-yellow-500 to-yellow-600"
        />
        
        <StatsCard
          title="High Priority"
          value={highPriorityTasks}
          subtitle="Urgent tasks"
          icon={AlertTriangle}
          gradient="from-red-500 to-red-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription>Tasks due today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks}</div>
            <p className="text-xs text-muted-foreground">
              {todayTasks === 0 ? "No tasks due today" : "Stay focused!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks
            </CardTitle>
            <CardDescription>Tasks past deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              {overdueTasks === 0 ? "Great job!" : "Needs attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Category
            </CardTitle>
            <CardDescription>Most active category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topCategory ? topCategory[0] : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {topCategory ? `${topCategory[1]} tasks` : 'No tasks yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {totalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your productivity insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};