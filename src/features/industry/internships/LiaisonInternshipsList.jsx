import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipsService } from '../../../services/internships';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Loader from '../../../components/Loader';
import EmptyState from '../../../components/EmptyState';
import SearchBar from '../../../components/SearchBar';
import Table from '../../../components/Table';

const LiaisonInternshipsList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async (searchTerm = '') => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const data = await internshipsService.list(params);
      setInternships(data.internships || []);
    } catch (error) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      await internshipsService.remove(id);
      setInternships(prev => prev.filter(internship => internship.id !== id));
      toast.success('Internship deleted successfully');
    } catch (error) {
      toast.error('Failed to delete internship');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Internships</h1>
          <p className="text-gray-600">Create and manage internship opportunities</p>
        </div>
        <Link to="/industry/internships/new">
          <Button>
            <span className="mr-2">➕</span>
            Create Internship
          </Button>
        </Link>
      </div>

      <Card>
        <Card.Content>
          <SearchBar
            onSearch={fetchInternships}
            placeholder="Search internships..."
            className="mb-6"
          />
        </Card.Content>
      </Card>

      {internships.length === 0 ? (
        <EmptyState
          title="No internships created"
          description="Start by creating your first internship opportunity for students."
          action={
            <Link to="/industry/internships/new">
              <Button>
                <span className="mr-2">➕</span>
                Create Internship
              </Button>
            </Link>
          }
          icon={() => <div className="text-4xl">💼</div>}
        />
      ) : (
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Title</Table.Head>
                  <Table.Head>Company</Table.Head>
                  <Table.Head>Location</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Created</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {internships.map((internship) => (
                  <Table.Row key={internship.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-gray-900">{internship.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{internship.description}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{internship.company}</Table.Cell>
                    <Table.Cell>{internship.location}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={internship.status}>{internship.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(internship.created_at).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Link to={`/industry/internships/${internship.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Link to={`/industry/internships/${internship.id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/industry/applicants?internship=${internship.id}`}>
                          <Button size="sm" variant="outline">
                            Applicants
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(internship.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default LiaisonInternshipsList;