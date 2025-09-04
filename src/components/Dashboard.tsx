import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TaskExplorer from "./TaskExplorer";
import TaskDetail from "./TaskDetail";
import Overview from "./Overview";
import { Users, Menu, X } from "lucide-react";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const renderHeader = (title: string) => (
    <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={24} />
      </button>
    </div>
  );

  const renderContent = () => {
    let content;
    let headerTitle = "Dashboard";

    switch (activeTab) {
      case "overview":
        content = <Overview onTaskSelect={handleTaskSelect} />;
        headerTitle = "Overview";
        break;
      case "tasks":
        content = <TaskExplorer onTaskSelect={handleTaskSelect} />;
        headerTitle = "Explore Task";
        break;
      case "task-detail":
        content = selectedTaskId ? (
          <TaskDetail taskId={selectedTaskId} onBack={handleBackToTasks} />
        ) : (
          <TaskExplorer onTaskSelect={handleTaskSelect} />
        );
        headerTitle = "Task Detail";
        break;
      case "mentors":
        content = (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Mentors
              </h3>
              <p className="text-gray-600">Mentor management coming soon</p>
            </div>
          </div>
        );
        headerTitle = "Mentors";
        break;
      case "messages":
        content = (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
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
        headerTitle = "Messages";
        break;
      case "settings":
        content = (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
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
        headerTitle = "Settings";
        break;
      default:
        content = <TaskExplorer onTaskSelect={handleTaskSelect} />;
        headerTitle = "Explore Task";
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderHeader(headerTitle)}
        <div className="flex-1 overflow-y-auto">{content}</div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {renderContent()}
    </div>
  );
};

export default Dashboard;
