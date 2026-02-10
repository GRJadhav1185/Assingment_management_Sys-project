import { Link } from 'react-router-dom';
import { Users, FileText, CheckSquare, PlusCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const stats = [
    { title: 'Active Students', value: '24', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Assignments', value: '12', icon: FileText, color: 'bg-purple-500' },
    { title: 'Pending Submissions', value: '5', icon: CheckSquare, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Faculty Dashboard</h1>
        <Link
          to="/faculty/assignments"
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Create Assignment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`h-6 w-6 text-${stat.color.replace('bg-', '')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-600 dark:text-gray-300">Assignment {i} submission received</span>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Pending Grading</h3>
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <CheckSquare className="w-12 h-12 mb-2 opacity-20" />
            <p>No pending items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
