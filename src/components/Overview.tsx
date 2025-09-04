import React, { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle, Users, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface OverviewProps {
  onTaskSelect: (taskId: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onTaskSelect }) => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tasks = await response.json();

      setRecentTasks(tasks.slice(0, 5));

      const completed = tasks.filter(
        (task: any) => task.status === "completed"
      ).length;
      const inProgress = tasks.filter(
        (task: any) => task.status === "in-progress"
      ).length;
      const overdue = tasks.filter(
        (task: any) => task.status === "overdue"
      ).length;

      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        overdueTasks: overdue,
      });
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  };

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: TrendingUp,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Team Members",
      value: stats.totalTasks > 0 ? "12" : "0",
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Tasks
              </h2>
              <button
                onClick={() => onTaskSelect("")}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>

          <div className="p-6">
            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-600">
                  Create your first task to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => onTaskSelect(task._id)}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500">{task.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                          {task.progress}%
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex -space-x-2">
                        {task.assignedTo
                          .slice(0, 3)
                          .map((member: any, index: number) => (
                            <div
                              key={member._id}
                              className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white"
                              style={{ zIndex: 3 - index }}
                            >
                              {member.name.charAt(0)}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
