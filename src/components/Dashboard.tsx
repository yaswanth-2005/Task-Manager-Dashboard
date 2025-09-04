import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import TaskExplorer from "./TaskExplorer";
import TaskDetail from "./TaskDetail";
import Overview from "./Overview";
import { Users, Menu, X, Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveTab("task-detail");
  };

  const handleBackToTasks = () => {
    setSelectedTaskId(null);
    setActiveTab("tasks");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  const renderHeader = (title: string) => (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Title */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 lg:ml-0 ml-2">
            {title}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* {user?.role !== "student" && ( */}
          <button className="hidden md:flex px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors items-center space-x-2">
            <Plus size={16} />
            <span>New Task</span>
          </button>
          {/* )} */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="text-gray-600 font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 uppercase mb-1 font-medium">
                    Role
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
        <div className="flex-1 overflow-y-auto bg-gray-50">{content}</div>
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
