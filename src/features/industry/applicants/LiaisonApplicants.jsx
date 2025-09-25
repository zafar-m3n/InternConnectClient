import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { applicationsService } from "../../../services/applications";
import { internshipsService } from "../../../services/internships";
import { toast } from "react-toastify";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import Select from "../../../components/Select";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";

const LiaisonApplicants = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]); // [{ value, label }]
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const { control } = useForm();

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "reviewing", label: "Reviewing" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "interviewed", label: "Interviewed" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    const internshipId = searchParams.get("internship");
    if (!internshipId || internships.length === 0) return;

    // options are { value, label }, not { id, ... }
    const match = internships.find((i) => String(i.value) === String(internshipId));
    if (match) {
      setSelectedInternship(match);
      fetchApplications(match.value);
    }
  }, [searchParams, internships]);

  const fetchInternships = async () => {
    try {
      const data = await internshipsService.list();
      const options = (data.internships || []).map((internship) => ({
        value: internship.id,
        label: internship.title,
      }));
      setInternships(options);
    } catch (error) {
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (internshipId) => {
    if (!internshipId) {
      setApplications([]);
      return;
    }

    setLoading(true);
    try {
      const data = await applicationsService.byInternship(internshipId);
      setApplications(data);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleInternshipChange = (option) => {
    setSelectedInternship(option);
    if (option) {
      fetchApplications(option.value);
    } else {
      setApplications([]);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationsService.changeStatus(applicationId, newStatus.value);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus.value } : app))
      );
      toast.success("Application status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getCVPreviewUrl = (cvPath) => {
    if (!cvPath) return null;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const serverBase = apiBase.replace("/api/v1", "");
    return serverBase + cvPath;
  };

  if (loading && internships.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Applicants</h1>
        <p className="text-gray-600">Review and manage internship applications</p>
      </div>

      <Card>
        <Card.Content>
          <Controller
            name="internship"
            control={control}
            render={() => (
              <Select
                label="Select Internship"
                options={internships}
                value={selectedInternship}
                onChange={handleInternshipChange}
                placeholder="Choose an internship to view applicants..."
                isClearable
              />
            )}
          />
        </Card.Content>
      </Card>

      {!selectedInternship ? (
        <EmptyState
          title="Select an internship"
          description="Choose an internship from the dropdown above to view its applicants."
          icon={() => <div className="text-4xl">👥</div>}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="No students have applied to this internship yet."
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
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Applied Date</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {applications.map((application) => (
                  <Table.Row key={application.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-gray-900">{application.student.full_name}</p>
                        <p className="text-sm text-gray-500">
                          {application.student.StudentProfile?.student_id || "N/A"}
                        </p>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-1">📧</span>
                          {application.student.email}
                        </div>
                        {application.student.StudentProfile?.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-1">📞</span>
                            {application.student.StudentProfile.phone}
                          </div>
                        )}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="text-sm">
                        <p className="text-gray-900">{application.student.StudentProfile?.degree || "Not specified"}</p>
                        <p className="text-gray-500">
                          Year {application.student.StudentProfile?.year_of_study || "N/A"}
                        </p>
                        {application.student.StudentProfile?.skills && (
                          <p className="text-xs text-gray-500 mt-1">{application.student.StudentProfile.skills}</p>
                        )}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      {application.student.StudentProfile?.cv_file_path ? (
                        <div className="flex items-center space-x-2">
                          <Badge variant={application.student.StudentProfile.cv_status}>
                            {application.student.StudentProfile.cv_status}
                          </Badge>
                          {application.student.StudentProfile.cv_status === "approved" && (
                            <a
                              href={getCVPreviewUrl(application.student.StudentProfile.cv_file_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500"
                            >
                              📄
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No CV</span>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <Select
                        options={statusOptions}
                        value={statusOptions.find((option) => option.value === application.status)}
                        onChange={(option) => handleStatusChange(application.id, option)}
                        className="min-w-[120px]"
                      />
                    </Table.Cell>

                    <Table.Cell>
                      <span className="text-sm text-gray-500">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </span>
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

export default LiaisonApplicants;
