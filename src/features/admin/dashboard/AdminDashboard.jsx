import { useState, useEffect } from 'react';
import { adminService } from '../../../services/admin';
import { toast } from 'react-toastify';
import Card from '../../../components/Card';
import Loader from '../../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const tenantsData = await adminService.listTenants();
      const totalTenants = tenantsData.total || 0;
      const activeTenants = tenantsData.items?.filter(tenant => tenant.is_active).length || 0;
      
      setStats({
        totalTenants,
        activeTenants
      });
    } catch (error) {
      toast.error('Failed to load dashboard stats');
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

  const dashboardStats = [
    { label: 'Total Tenants', value: stats.totalTenants, color: 'text-blue-600', icon: '🏢' },
    { label: 'Active Tenants', value: stats.activeTenants, color: 'text-green-600', icon: '✅' },
    { label: 'System Health', value: 'Good', color: 'text-green-600', icon: '💚' },
    { label: 'Platform Status', value: 'Online', color: 'text-blue-600', icon: '🌐' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
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

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="font-medium text-gray-900">Manage Tenants</h3>
              <p className="text-sm text-gray-600">Add, edit, or deactivate university tenants</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-medium text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600">Configure platform-wide settings</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View system usage and performance</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* System Status */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">✅</div>
                <div>
                  <p className="font-medium text-green-900">Database Connection</p>
                  <p className="text-sm text-green-700">All systems operational</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">✅</div>
                <div>
                  <p className="font-medium text-green-900">API Services</p>
                  <p className="text-sm text-green-700">All endpoints responding</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">✅</div>
                <div>
                  <p className="font-medium text-green-900">File Storage</p>
                  <p className="text-sm text-green-700">CV uploads working normally</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminDashboard;