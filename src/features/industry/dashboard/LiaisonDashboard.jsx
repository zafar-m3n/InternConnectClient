import Card from '../../../components/Card';
import Badge from '../../../components/Badge';

const LiaisonDashboard = () => {
  // Static dashboard data as requested
  const stats = [
    { label: 'Total Internships', value: 12, color: 'text-blue-600', icon: '💼' },
    { label: 'Published Internships', value: 8, color: 'text-green-600', icon: '✅' },
    { label: 'Total Applications', value: 45, color: 'text-purple-600', icon: '📄' },
    { label: 'Pending Applications', value: 15, color: 'text-yellow-600', icon: '⏳' },
    { label: 'Total Students', value: 120, color: 'text-indigo-600', icon: '👥' },
    { label: 'Pending CVs', value: 8, color: 'text-red-600', icon: '📋' }
  ];

  const recentApplications = [
    {
      id: 1,
      student: 'Kamala Perera',
      internship: 'Software Development Intern',
      company: 'TechCorp Lanka',
      status: 'pending',
      appliedAt: '2024-01-15'
    },
    {
      id: 2,
      student: 'Nimal Silva',
      internship: 'UI/UX Design Intern',
      company: 'Creative Studios LK',
      status: 'reviewing',
      appliedAt: '2024-01-14'
    },
    {
      id: 3,
      student: 'Sunil Fernando',
      internship: 'Data Science Intern',
      company: 'DataInsights Lanka',
      status: 'shortlisted',
      appliedAt: '2024-01-13'
    },
    {
      id: 4,
      student: 'Priya Wickramasinghe',
      internship: 'Mobile App Development Intern',
      company: 'AppSolutions Sri Lanka',
      status: 'accepted',
      appliedAt: '2024-01-12'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Liaison Dashboard</h1>
        <p className="text-gray-600">Manage internships and track student applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <Card.Content>
              <div className="flex items-center">
                <div className="text-3xl mr-4">{stat.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Recent Applications */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{application.student}</h3>
                    <Badge variant={application.status}>{application.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{application.internship}</p>
                  <p className="text-sm text-gray-500">{application.company}</p>
                  <p className="text-xs text-gray-500">Applied on {application.appliedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default LiaisonDashboard;