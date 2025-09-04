import React from 'react';
import { Clock, Users } from 'lucide-react';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    category: string;
    progress: number;
    timeLimit: number;
    assignedTo: Array<{
      _id: string;
      name: string;
      avatar?: string;
    }>;
    dueDate: string;
  };
  onClick: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getTimeLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return '1 Day Left';
    return `${diffDays} Days Left`;
  };

  return (
    <div
      onClick={() => onClick(task._id)}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{task.category}</p>
        </div>
        <span className="text-sm text-indigo-600 font-medium">{task.progress}%</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor(task.progress)}`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>{getTimeLeft(task.dueDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {task.assignedTo.slice(0, 3).map((user, index) => (
              <div
                key={user._id}
                className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white"
                style={{ zIndex: 3 - index }}
              >
                {user.name.charAt(0)}
              </div>
            ))}
            {task.assignedTo.length > 3 && (
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white border-2 border-white">
                +{task.assignedTo.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;