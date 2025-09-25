import Card from '../../../components/Card';
import Badge from '../../../components/Badge';

const StudentDashboard = () => {
  // Static dashboard data as requested
  const stats = [
    { label: 'Total Applications', value: 8, color: 'text-blue-600', icon: '📄' },
    { label: 'Pending Applications', value: 3, color: 'text-yellow-600', icon: '⏳' },
    { label: 'Accepted Applications', value: 2, color: 'text-green-600', icon: '✅' },
    { label: 'Available Internships', value: 15, color: 'text-purple-600', icon: '💼' }
  ];

  const recentApplications = [
    {
      id: 1,
      internship: 'Software Development Intern',
      company: 'TechCorp Lanka',
      status: 'pending',
      appliedAt: '2024-01-15'
    },
    {
      id: 2,
      internship: 'UI/UX Design Intern',
      company: 'Creative Studios LK',
      status: 'reviewing',
      appliedAt: '2024-01-12'
    },
    {
      id: 3,
      internship: 'Data Science Intern',
      company: 'DataInsights Lanka',
      status: 'accepted',
      appliedAt: '2024-01-10'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'New Internship Opportunities Available',
      message: 'Check out the latest internship postings from top companies in Sri Lanka.',
      date: '2024-01-20',
      type: 'info'
    },
    {
      id: 2,
      title: 'CV Review Process Update',
      message: 'Please ensure your CV is updated and approved before applying to internships.',
      date: '2024-01-18',
      type: 'warning'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">Track your internship applications and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{application.internship}</h3>
                    <p className="text-sm text-gray-600">{application.company}</p>
                    <p className="text-xs text-gray-500">Applied on {application.appliedAt}</p>
                  </div>
                  <Badge variant={application.status}>{application.status}</Badge>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Announcements */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <Badge variant={announcement.type}>{announcement.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                  <p className="text-xs text-gray-500">{announcement.date}</p>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;