import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, submissionsRes] = await Promise.all([
          api.get('/assignments'),
          api.get('/submissions/my'),
        ]);
        setAssignments(assignmentsRes.data);
        setMySubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubmissionStatus = (assignmentId) => {
    const submission = mySubmissions.find((sub) => sub.assignmentId._id === assignmentId); // Populate might structure slightly differently, need to be careful
    // Check if sub.assignmentId is object or string. Based on controller: .populate('assignmentId', 'title courseCode dueDate');
    // So in mySubmissions, assignmentId is an OBJECT.
    // In assignments list, we have the ID.

    // Wait, mySubmissions stores submissions.
    // I need to check if there is a submission for the assignment ID.
    // The submission object from 'mySubmissions' has 'assignmentId' populated.

    const sub = mySubmissions.find(s => s.assignmentId && s.assignmentId._id === assignmentId);
    return sub;
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => {
          const submission = mySubmissions.find(s => s.assignmentId && s.assignmentId._id === assignment._id);
          const isSubmitted = !!submission;

          return (
            <div key={assignment._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                  {assignment.courseCode}
                </div>
                {isSubmitted ? (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" /> Submitted
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mr-1" /> Pending
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{assignment.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {assignment.description}
              </p>

              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </div>

              {isSubmitted ? (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                  <p className="text-gray-600 dark:text-gray-300">Grade: <span className="font-bold">{submission.grade !== undefined ? submission.grade : 'Pending'}</span></p>
                  <p className="text-gray-600 dark:text-gray-300">Plagiarism: <span className="font-bold text-purple-600">{submission.plagiarismScore}%</span></p>
                </div>
              ) : (
                <Link
                  to={`/student/submit/${assignment._id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Submit Assignment
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
