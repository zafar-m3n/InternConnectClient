// src/pages/public/CompanyPortalPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Select from "../../components/Select";
import { internshipsService } from "../../services/internships";
import { applicationsService } from "../../services/applications";

const getQuery = (search) => new URLSearchParams(search);
const keyForToken = (jobId) => `cpl_${jobId}`;
const keyForSnapshot = (jobId) => `cpl_${jobId}_snapshot`;

const baseUrlFromEnv = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (!apiBase) return null;
  try {
    return apiBase.replace("/api/v1", "");
  } catch {
    return null;
  }
};

const getCVPreviewUrl = (cvPath) => {
  if (!cvPath) return null;
  const serverBase = baseUrlFromEnv();
  return serverBase ? serverBase + cvPath : cvPath;
};

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default function CompanyPortalPage() {
  const { search } = useLocation();
  const qs = useMemo(() => getQuery(search), [search]);
  const token = qs.get("token");
  const jobId = qs.get("job");

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [expiry, setExpiry] = useState(null);
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [filterStatus, setFilterStatus] = useState(statusOptions[0]);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [acceptanceModalOpen, setAcceptanceModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Validate token
  useEffect(() => {
    const doCheck = () => {
      if (!token || !jobId) {
        setChecking(false);
        setValid(false);
        return;
      }
      try {
        const raw = localStorage.getItem(keyForToken(jobId));
        if (!raw) {
          setValid(false);
          setChecking(false);
          return;
        }
        const rec = JSON.parse(raw);
        const exp = rec?.expiresAt ? new Date(rec.expiresAt) : null;
        const ok = rec?.token === token && exp instanceof Date && !isNaN(exp.getTime()) && new Date() <= exp;

        setExpiry(exp || null);
        setValid(!!ok);
      } catch {
        setValid(false);
      } finally {
        setChecking(false);
      }
    };
    doCheck();
  }, [token, jobId]);

  // Load data
  useEffect(() => {
    const load = async () => {
      if (!valid || !jobId) return;
      setLoadingData(true);
      try {
        const localApps = localStorage.getItem(`cpl_apps_${jobId}`);
        if (localApps) {
          setApplications(JSON.parse(localApps));
        }

        const [internshipResp, appsResp] = await Promise.all([
          internshipsService.get(jobId),
          applicationsService.byInternship(jobId),
        ]);
        setInternship(internshipResp);
        setApplications(appsResp || []);

        localStorage.setItem(`cpl_apps_${jobId}`, JSON.stringify(appsResp || []));
        localStorage.setItem(
          keyForSnapshot(jobId),
          JSON.stringify({ internship: internshipResp, applications: appsResp || [] })
        );
      } catch (err) {
        try {
          const snapRaw = localStorage.getItem(keyForSnapshot(jobId));
          if (snapRaw) {
            const snap = JSON.parse(snapRaw);
            setInternship(snap?.internship || null);
            setApplications(snap?.applications || []);
            toast.info("Showing cached snapshot (no live connection).");
          } else {
            toast.error("Unable to load data for this link.");
          }
        } catch {
          toast.error("Unable to load data for this link.");
        }
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [valid, jobId]);

  const handleStatusChange = async (applicationId, status, rejection_reason = null) => {
    try {
      const payload = { status, rejection_reason };
      const updatedApp = await applicationsService.changeStatus(applicationId, payload);

      const updatedApps = applications.map((app) =>
        app.id === applicationId ? { ...app, status: updatedApp.status, rejection_reason: updatedApp.rejection_reason } : app
      );
      setApplications(updatedApps);
      localStorage.setItem(`cpl_apps_${jobId}`, JSON.stringify(updatedApps));
      toast.success("Applicant status updated!");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update status.");
    }
  };

  const openRejectionModal = (applicant) => {
    setSelectedApplicant(applicant);
    setRejectionReason("");
    setRejectionModalOpen(true);
  };

  const openAcceptanceModal = (applicant) => {
    setSelectedApplicant(applicant);
    setAcceptanceModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    handleStatusChange(selectedApplicant.id, "rejected", rejectionReason);
    setRejectionModalOpen(false);
  };

  const handleAcceptSubmit = () => {
    handleStatusChange(selectedApplicant.id, 'accepted');
    setAcceptanceModalOpen(false);
  };

  const filteredApplications = useMemo(() => {
    if (filterStatus.value === "all") {
      return applications;
    }
    return applications.filter((app) => app.status === filterStatus.value);
  }, [applications, filterStatus]);

  if (checking) {
    return <div className="flex items-center justify-center py-16"><Loader size="lg" /></div>;
  }

  if (!valid) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Link unavailable</h1>
        <p className="text-gray-600">This portal link is invalid or has expired.</p>
        {expiry && <p className="text-sm text-gray-500 mt-2">Expired on {formatDate(expiry)}.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-800">
        {expiry ? `This link expires on ${formatDate(expiry)}` : "This link has a limited validity period"}
      </div>

      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{internship?.title || "Internship"}</h1>
              <p className="text-gray-600">{internship?.company} • {internship?.location}</p>
            </div>
            {internship?.status && <Badge variant={internship.status}>{internship.status}</Badge>}
          </div>
        </Card.Header>
      </Card>

      {loadingData && applications.length === 0 ? (
        <div className="flex items-center justify-center py-16"><Loader size="lg" /></div>
      ) : !applications || applications.length === 0 ? (
        <EmptyState title="No applicants" description="No applications found for this internship." />
      ) : (
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Applicants ({filteredApplications.length})</h2>
              <div className="w-48">
                <Select
                  options={statusOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                />
              </div>
            </div>
          </Card.Header>
          <Card.Content className="p-0">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Student</Table.Head>
                  <Table.Head>Contact</Table.Head>
                  <Table.Head>CV</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredApplications.map((app) => {
                  const s = app.student || {};
                  const prof = s.StudentProfile || {};
                  const cvUrl = getCVPreviewUrl(prof.cv_file_path);

                  return (
                    <Table.Row key={app.id}>
                      <Table.Cell>
                        <div>
                          <p className="font-medium text-gray-900">{s.full_name}</p>
                          <p className="text-xs text-gray-500">{prof.student_id || "—"}</p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div>📧 {s.email}</div>
                          {prof.phone && <div>📞 {prof.phone}</div>}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {prof.cv_file_path ? (
                          <div className="flex items-center space-x-2">
                            <Badge variant={prof.cv_status || "pending"}>{prof.cv_status || "pending"}</Badge>
                            {prof.cv_status === "approved" && cvUrl && (
                              <a href={cvUrl} target="_blank" rel="noopener noreferrer" title="Open CV">📄</a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No CV</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant={app.status}>{app.status}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          {app.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleStatusChange(app.id, 'shortlisted')}>
                                Shortlist
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => openRejectionModal(app)}>
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === 'shortlisted' && (
                            <>
                              <Button size="sm" onClick={() => toast.info(`Interview for ${s.full_name}`)}>
                                Schedule Interview
                              </Button>
                              <Button size="sm" variant="success" onClick={() => openAcceptanceModal(app)}>
                                Accept
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => openRejectionModal(app)}>
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      )}

      <Modal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        title={`Reject Applicant: ${selectedApplicant?.student?.full_name}`}>
        <div>
          <p className="mb-4">Please provide a reason for rejecting this applicant. This will be saved for your records.</p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="4"
            placeholder="e.g., Not a good fit for the role..."
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setRejectionModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleRejectSubmit}>Confirm Rejection</Button>
        </div>
      </Modal>

      <Modal
        isOpen={acceptanceModalOpen}
        onClose={() => setAcceptanceModalOpen(false)}
        title={`Accept Applicant: ${selectedApplicant?.student?.full_name}`}>
        <div>
          <p>Are you sure you want to accept this applicant?</p>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setAcceptanceModalOpen(false)}>Cancel</Button>
          <Button variant="success" onClick={handleAcceptSubmit}>Confirm Acceptance</Button>
        </div>
      </Modal>
    </div>
  );
}
