import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Users, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../hooks/backendUrl";

interface TaskDetailProps {
  taskId: string;
  onBack: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onBack }) => {
  const { token, user } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  console.log("User Details..", user);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`${api}/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Tasks Data..", data);
      setTask(data);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAssessmentCriteria = async (
    criteriaIndex: number,
    completed: boolean
  ) => {
    try {
      await fetch(`${api}/api/tasks/${taskId}/assessment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ criteriaIndex, completed }),
      });
      fetchTask();
    } catch (error) {
      console.error("Error updating assessment:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("notes", submissionNotes);
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }
      // Submit the task
      const response = await fetch(`${api}/api/tasks/${taskId}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log(response);
      if (response.ok) {
        // Set progress to 100% for the user
        await fetch(`${api}/api/tasks/${taskId}/progress`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          //@ts-ignore
          body: JSON.stringify({ userId: user?._id, progress: 100 }),
        });
        fetchTask();
        setSubmissionNotes("");
        setFiles(null);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Task not found
      </div>
    );
  }

  const getTimeLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "1 Day Left";
    return `${diffDays} Days Left`;
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Detail Task</h1>
              <p className="text-gray-600">{task.category}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              Sort by: Deadline
            </span>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Video/Image */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Task preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <button className="p-2 bg-white rounded-lg shadow-md">
                    <div className="w-4 h-4 bg-gray-800"></div>
                  </button>
                  <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    2:20/9:09
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {task.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>{task.category}</span>
                  <span>•</span>
                  <span>Get Reference</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                  <Users size={16} />
                  <span>{task.assignedTo.length} Students Involved</span>
                  <Clock size={16} />
                  <span>{task.timeLimit} Hour</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>
            </div>
            {/* Assessment Criteria */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Essence of Assessment
              </h3>
              <div className="space-y-3">
                {task.assessmentCriteria.map((criteria: any, index: number) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={criteria.completed}
                      onChange={(e) =>
                        updateAssessmentCriteria(index, e.target.checked)
                      }
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{criteria.criteria}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* File Submission */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Submit Your Work
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-indigo-600 hover:text-indigo-500">
                      Upload files
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add any notes about your submission..."
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit
              </button>
              {/* Submission Details */}
              {task.submissions && Array.isArray(task.submissions) && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Submissions ({task.submissions.length})
                  </h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {task.submissions.map((sub: any, idx: number) => (
                      <div key={idx} className="bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm text-gray-800">
                            {sub.submittedBy?.name || "Unknown User"}
                            {/* @ts-ignore */}
                            {sub.submittedBy?._id === user?.id && (
                              <span className="text-xs text-indigo-600 ml-2">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(sub.submissionDate).toLocaleString()}
                          </p>
                        </div>
                        {sub.notes && (
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Notes:</span>{" "}
                            {sub.notes}
                          </p>
                        )}
                        {sub.files && sub.files.length > 0 && (
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Files:</span>
                            <ul className="list-disc list-inside ml-1">
                              {sub.files.map((file: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-center space-x-2"
                                >
                                  {/* <img
                                    src={`server/uploads/1756966234580-image (2).png`}
                                    alt=""
                                  /> */}
                                  <img
                                    src={`/server/uploads/${file}`}
                                    alt={`Preview of ${file}`}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <a
                                    href={`/server/uploads/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline hover:text-indigo-800 truncate"
                                  >
                                    {file}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Assigned Assignments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Assigned Assignments
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.category}</p>
                </div>
              </div>
            </div>
            {/* Detail Student */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Assigned Students
              </h3>
              <div className="space-y-3">
                {task.assignedTo.map((student: any) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">Student</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                ))}
              </div>
            </div>
            {/* File Task */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">File Task</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Modified</span>
                  <span className="text-gray-800">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">File submissions</span>
                  <span className="text-gray-800">
                    {task.submissions?.length || 0}
                  </span>
                </div>
              </div>
            </div>
            {/* Progress Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Progress Summary
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {task.progress}%
                </div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
