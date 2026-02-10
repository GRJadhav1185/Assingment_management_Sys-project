import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../services/api";

export default function GradeSubmission() {
  const { submissionId } = useParams();

  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (grade === "" || grade < 0 || grade > 100) {
      setMessage("Grade must be between 0 and 100");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.put(`/submissions/grade/${submissionId}`, {
        grade,
        feedback,
      });

      setMessage("Submission graded successfully");
    } catch (err) {
      setMessage("Failed to save grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Submission
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Assign marks and provide feedback to the student
          </p>
        </div>

        {/* Grading Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6">

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grade (out of 100)
            </label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter grade"
            />
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Write feedback for the student"
            />
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-sm ${
                message.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Grade"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
