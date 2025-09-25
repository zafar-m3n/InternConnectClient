import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsService } from '../../../services/applications';
import { toast } from 'react-toastify';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Loader from '../../../components/Loader';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/Button';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationsService.myApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track the status of your internship applications</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="You haven't applied to any internships yet. Browse available internships and start applying!"
          action={
            <Link to="/student/internships">
              <Button>Browse Internships</Button>
            </Link>
          }
          icon={() => <div className="text-4xl">📄</div>}
        />
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.id}>
              <Card.Content>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {application.Internship.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{application.Internship.company}</p>
                  </div>
                  <Badge variant={application.status}>{application.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🏢</span>
                    {application.Internship.company}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    {application.Internship.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    Applied {new Date(application.applied_at).toLocaleDateString()}
                  </div>
                </div>

                {application.cover_letter && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(application.updated_at).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/student/internships/${application.Internship.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View Internship
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;