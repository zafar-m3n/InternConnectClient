import { useState, useEffect } from "react";
import { cvService } from "../../../services/cv";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import CVPreviewModal from "./CVPreviewModal";

const LiaisonCVQueue = () => {
  const [pendingCVs, setPendingCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchPendingCVs();
  }, []);

  const fetchPendingCVs = async () => {
    try {
      const data = await cvService.pending();
      setPendingCVs(data);
    } catch (error) {
      toast.error("Failed to load pending CVs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId, feedback = "") => {
    try {
      await cvService.approve(studentId, feedback);
      setPendingCVs((prev) => prev.filter((cv) => cv.User.id !== studentId));
      toast.success("CV approved successfully");
    } catch (error) {
      toast.error("Failed to approve CV");
    }
  };

  const handleReject = async (studentId, feedback) => {
    if (!feedback.trim()) {
      toast.error("Feedback is required when rejecting a CV");
      return;
    }

    try {
      await cvService.reject(studentId, feedback);
      setPendingCVs((prev) => prev.filter((cv) => cv.User.id !== studentId));
      toast.success("CV rejected successfully");
    } catch (error) {
      toast.error("Failed to reject CV");
    }
  };

  const handlePreviewCV = (cvProfile) => {
    setSelectedCV(cvProfile);
    setShowPreviewModal(true);
  };

  const handleQuickApprove = (studentId) => {
    handleApprove(studentId);
  };

  const handleQuickReject = (studentId) => {
    const feedback = prompt("Please provide feedback for rejection:");
    if (feedback) {
      handleReject(studentId, feedback);
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
        <h1 className="text-3xl font-bold text-gray-900">CV Review Queue</h1>
        <p className="text-gray-600">Review and approve student CVs</p>
      </div>

      {pendingCVs.length === 0 ? (
        <EmptyState
          title="No pending CVs"
          description="All student CVs have been reviewed."
          icon={() => <div className="text-4xl">📄</div>}
        />
      ) : (
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Student</Table.Head>
                  <Table.Head>Contact</Table.Head>
                  <Table.Head>Profile</Table.Head>
                  <Table.Head>CV</Table.Head>
                  <Table.Head>Submitted</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {pendingCVs.map((profile) => (
                  <Table.Row key={profile.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-gray-900">{profile.User.full_name}</p>
                        <p className="text-sm text-gray-500">{profile.student_id || "N/A"}</p>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">{profile.User.email}</p>
                        {profile.phone && <p className="text-sm text-gray-600">{profile.phone}</p>}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="text-sm">
                        <p className="text-gray-900">{profile.degree || "Not specified"}</p>
                        <p className="text-gray-500">Year {profile.year_of_study || "N/A"}</p>
                        {profile.skills && <p className="text-xs text-gray-500 mt-1">{profile.skills}</p>}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={profile.cv_status}>{profile.cv_status}</Badge>
                        {profile.cv_file_path && (
                          <Button size="sm" variant="outline" onClick={() => handlePreviewCV(profile)}>
                            👁️
                          </Button>
                        )}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <span className="text-sm text-gray-500">{new Date(profile.updated_at).toLocaleDateString()}</span>
                    </Table.Cell>

                    <Table.Cell>
                      {profile.cv_status === "pending" ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleQuickApprove(profile.User.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleQuickReject(profile.User.id)}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge variant={profile.cv_status}>{profile.cv_status}</Badge>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      )}

      <CVPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        profile={selectedCV}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default LiaisonCVQueue;
