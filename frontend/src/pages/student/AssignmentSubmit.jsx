import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Upload, FileText, ArrowLeft } from 'lucide-react';

const AssignmentSubmit = () => {
  const { id } = useParams(); // Assignment ID
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await api.get(`/assignments/${id}`);
        setAssignment(data);
      } catch (err) {
        console.error('Failed to fetch assignment');
      }
    };
    fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', id);

    try {
      await api.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 dark:text-gray-400 mb-6 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{assignment.title}</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
            {assignment.courseCode}
          </span>
          <span>•</span>
          <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Instructions</h3>
          <p>{assignment.description}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/30">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                {file ? file.name : 'Click to upload assignment'}
              </span>
              <span className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmit;
