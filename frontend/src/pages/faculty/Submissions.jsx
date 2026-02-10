import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Submissions = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [gradeModal, setGradeModal] = useState({ show: false, submissionId: null, grade: '', feedback: '' });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await api.get('/assignments');
        setAssignments(data);
        if (data.length > 0) setSelectedAssignment(data[0]._id);
      } catch (error) {
        console.error('Failed to fetch assignments');
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      const fetchSubmissions = async () => {
        try {
          const { data } = await api.get(`/submissions/assignment/${selectedAssignment}`);
          setSubmissions(data);
        } catch (error) {
          console.error('Failed to fetch submissions');
        }
      };
      fetchSubmissions();
    }
  }, [selectedAssignment]);

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/submissions/${gradeModal.submissionId}/grade`, {
        grade: gradeModal.grade,
        feedback: gradeModal.feedback,
      });
      setGradeModal({ ...gradeModal, show: false });
      // Refresh submissions
      const { data } = await api.get(`/submissions/assignment/${selectedAssignment}`);
      setSubmissions(data);
    } catch (error) {
      alert('Failed to grade submission');
    }
  };

  const getPlagiarismColor = (score) => {
    if (score < 10) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score < 30) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Submissions</h1>
        <select
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
        >
          {assignments.map((a) => (
            <option key={a._id} value={a._id}>{a.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Plagiarism</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{sub.studentId.name}</div>
                    <div className="text-sm text-gray-500">{sub.studentId.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {format(new Date(sub.submittedAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${sub.status === 'ON_TIME'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPlagiarismColor(sub.plagiarismScore)}`}>
                      {sub.plagiarismScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {sub.grade !== undefined ? sub.grade : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <a
                        href={`http://localhost:5000/${sub.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Download File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setGradeModal({ show: true, submissionId: sub._id, grade: sub.grade || '', feedback: sub.feedback || '' })}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title="Grade"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No submissions found for this assignment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {gradeModal.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Grade Submission</h2>
            </div>
            <form onSubmit={handleGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade (0-100)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={gradeModal.grade}
                  onChange={(e) => setGradeModal({ ...gradeModal, grade: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback</label>
                <textarea
                  rows="4"
                  value={gradeModal.feedback}
                  onChange={(e) => setGradeModal({ ...gradeModal, feedback: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Great work!"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setGradeModal({ ...gradeModal, show: false })}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
