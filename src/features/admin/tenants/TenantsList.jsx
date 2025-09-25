import { useState, useEffect } from 'react';
import { adminService } from '../../../services/admin';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Table from '../../../components/Table';
import Loader from '../../../components/Loader';
import EmptyState from '../../../components/EmptyState';
import SearchBar from '../../../components/SearchBar';
import TenantForm from './TenantForm';

const TenantsList = () => {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const data = await adminService.listTenants();
      setTenants(data.items || []);
      setFilteredTenants(data.items || []);
    } catch (error) {
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredTenants(tenants);
    } else {
      const filtered = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenants(filtered);
    }
  };

  const handleCreate = () => {
    setEditingTenant(null);
    setShowForm(true);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTenant(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTenant(null);
    fetchTenants();
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Tenants</h1>
          <p className="text-gray-600">Manage university tenants and their settings</p>
        </div>
        <Button onClick={handleCreate}>
          <span className="mr-2">➕</span>
          Add Tenant
        </Button>
      </div>

      <Card>
        <Card.Content>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search tenants..."
          />
        </Card.Content>
      </Card>

      {filteredTenants.length === 0 ? (
        <EmptyState
          title="No tenants found"
          description="No university tenants match your search criteria."
          icon={() => <div className="text-4xl">🏢</div>}
        />
      ) : (
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>University</Table.Head>
                  <Table.Head>Slug</Table.Head>
                  <Table.Head>Contact Email</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Created</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredTenants.map((tenant) => (
                  <Table.Row key={tenant.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-gray-900">{tenant.name}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {tenant.slug}
                      </code>
                    </Table.Cell>
                    <Table.Cell>{tenant.contact_email}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={tenant.is_active ? 'active' : 'inactive'}>
                        {tenant.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tenant)}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      )}

      {showForm && (
        <TenantForm
          tenant={editingTenant}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default TenantsList;