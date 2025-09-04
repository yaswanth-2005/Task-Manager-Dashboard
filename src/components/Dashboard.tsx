import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TaskExplorer from "./TaskExplorer";
import TaskDetail from "./TaskDetail";
import CreateTaskModal from "./CreateTaskModal";
import Overview from "./Overview";
import { Users } from "lucide-react";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveTab("task-detail");
  };

  const handleBackToTasks = () => {
    setSelectedTaskId(null);
    setActiveTab("tasks");
  };

  const handleTaskCreated = () => {
    // Refresh tasks list
    setActiveTab("tasks");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview onTaskSelect={handleTaskSelect} />;
      case "tasks":
        return <TaskExplorer onTaskSelect={handleTaskSelect} />;
      case "task-detail":
        return selectedTaskId ? (
          <TaskDetail taskId={selectedTaskId} onBack={handleBackToTasks} />
        ) : (
          <TaskExplorer onTaskSelect={handleTaskSelect} />
        );
      case "mentors":
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Mentors
              </h3>
              <p className="text-gray-600">Mentor management coming soon</p>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gray-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-white">💬</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Messages
              </h3>
              <p className="text-gray-600">Messaging system coming soon</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gray-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-white">⚙️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Settings
              </h3>
              <p className="text-gray-600">Settings panel coming soon</p>
            </div>
          </div>
        );
      default:
        return <TaskExplorer onTaskSelect={handleTaskSelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default Dashboard;
