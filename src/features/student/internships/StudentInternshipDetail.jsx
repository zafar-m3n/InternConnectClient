import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { internshipsService } from '../../../services/internships';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Loader from '../../../components/Loader';
import ApplyModal from './ApplyModal';

const StudentInternshipDetail = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const data = await internshipsService.get(id);
      setInternship(data);
    } catch (error) {
      toast.error('Failed to load internship details');
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

  if (!internship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Internship not found</h2>
        <Link to="/student/internships" className="text-primary-600 hover:text-primary-500">
          Back to internships
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/student/internships"
          className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
        >
          <span className="mr-2">←</span>
          Back to internships
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
            <p className="text-xl text-gray-600">{internship.company}</p>
          </div>
          <Badge variant={internship.status}>{internship.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
            </Card.Content>
          </Card>

          {internship.requirements && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700 whitespace-pre-line">{internship.requirements}</p>
              </Card.Content>
            </Card>
          )}

          {internship.skills && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Required Skills</h2>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.split(', ').map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Internship Details</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="mr-3">🏢</span>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{internship.company}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="mr-3">📍</span>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{internship.location}</p>
                  </div>
                </div>

                {internship.duration && (
                  <div className="flex items-center">
                    <span className="mr-3">📅</span>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{internship.duration}</p>
                    </div>
                  </div>
                )}

                {internship.stipend && (
                  <div className="flex items-center">
                    <span className="mr-3">💰</span>
                    <div>
                      <p className="text-sm text-gray-600">Stipend</p>
                      <p className="font-medium">LKR {internship.stipend.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="mr-3">📧</span>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium">{internship.company_email}</p>
                  </div>
                </div>

                {internship.application_deadline && (
                  <div className="flex items-center">
                    <span className="mr-3">⏰</span>
                    <div>
                      <p className="text-sm text-gray-600">Application Deadline</p>
                      <p className="font-medium">
                        {new Date(internship.application_deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          <Button
            onClick={() => setShowApplyModal(true)}
            className="w-full"
            size="lg"
          >
            Apply Now
          </Button>
        </div>
      </div>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        internship={internship}
      />
    </div>
  );
};

export default StudentInternshipDetail;