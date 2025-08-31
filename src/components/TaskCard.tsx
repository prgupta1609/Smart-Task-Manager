import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low' | 'none';
  category: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-priority-high text-white';
    case 'medium':
      return 'bg-priority-medium text-white';
    case 'low':
      return 'bg-priority-low text-white';
    default:
      return 'bg-priority-none text-white';
  }
};

const getPriorityBorder = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'border-l-priority-high';
    case 'medium':
      return 'border-l-priority-medium';
    case 'low':
      return 'border-l-priority-low';
    default:
      return 'border-l-priority-none';
  }
};

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border-l-4",
      getPriorityBorder(task.priority),
      task.completed && "opacity-60"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <CardTitle className={cn(
                "text-lg font-semibold",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="mt-1">
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority === 'none' ? 'No Priority' : task.priority}
            </Badge>
            <Badge variant="outline">
              {task.category}
            </Badge>
          </div>
          
          {task.deadline && (
            <div className={cn(
              "flex items-center space-x-1 text-sm",
              isOverdue ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-4 w-4" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};