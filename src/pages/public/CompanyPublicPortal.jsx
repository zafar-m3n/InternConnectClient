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
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
};

export default function CompanyPortalPage() {
  const { search } = useLocation();
  const qs = useMemo(() => getQuery(search), [search]);
  const token = qs.get("token");
  const jobId = qs.get("job");

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [expiry, setExpiry] = useState(null); // Date | null
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Validate token against localStorage & expiry window
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

  // Load data: API first, fallback to snapshot
  useEffect(() => {
    const load = async () => {
      if (!valid || !jobId) return;
      setLoadingData(true);
      try {
        const [internshipResp, appsResp] = await Promise.all([
          internshipsService.get(jobId),
          applicationsService.byInternship(jobId),
        ]);
        setInternship(internshipResp);
        setApplications(appsResp || []);
        // Save snapshot for offline / backend-less display later
        localStorage.setItem(
          keyForSnapshot(jobId),
          JSON.stringify({ internship: internshipResp, applications: appsResp || [] })
        );
      } catch (err) {
        // Fallback to snapshot
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

  const disabled = useMemo(() => !valid, [valid]);

  if (checking) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size="lg" />
      </div>
    );
  }

  if (!valid) {
    // Expired or invalid
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Link unavailable</h1>
        <p className="text-gray-600">This portal link is invalid or has expired.</p>
        {expiry && <p className="text-sm text-gray-500 mt-2">Expired on {formatDate(expiry)}.</p>}
      </div>
    );
  }

  const expiryBanner = expiry
    ? `This link expires on ${formatDate(expiry)}`
    : "This link has a limited validity period";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-800">{expiryBanner}</div>

      {/* Job header */}
      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{internship?.title || "Internship"}</h1>
              <p className="text-gray-600">
                {internship?.company} • {internship?.location}
              </p>
            </div>
            {internship?.status && <Badge variant={internship.status}>{internship.status}</Badge>}
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            {internship?.application_deadline && (
              <div className="text-sm text-gray-600">
                Application deadline: <span className="font-medium">{formatDate(internship.application_deadline)}</span>
              </div>
            )}
            {internship?.description && <p className="text-gray-800 whitespace-pre-line">{internship.description}</p>}
          </div>
        </Card.Content>
      </Card>

      {/* Applicants */}
      {loadingData ? (
        <div className="flex items-center justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : !applications || applications.length === 0 ? (
        <EmptyState
          title="No applicants"
          description="No student applications were found for this internship."
          icon={() => <div className="text-4xl">📭</div>}
        />
      ) : (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Applicants ({applications.length})</h2>
          </Card.Header>
          <Card.Content className="p-0">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Student</Table.Head>
                  <Table.Head>Contact</Table.Head>
                  <Table.Head>Profile</Table.Head>
                  <Table.Head>CV</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {applications.map((app) => {
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
                          <div className="flex items-center">
                            <span className="mr-1">📧</span>
                            {s.email}
                          </div>
                          {prof.phone && (
                            <div className="flex items-center">
                              <span className="mr-1">📞</span>
                              {prof.phone}
                            </div>
                          )}
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="text-sm">
                          <div className="text-gray-900">{prof.degree || "—"}</div>
                          <div className="text-gray-500">Year {prof.year_of_study || "—"}</div>
                          {prof.skills && <div className="text-xs text-gray-500 mt-1">{prof.skills}</div>}
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        {prof.cv_file_path ? (
                          <div className="flex items-center space-x-2">
                            <Badge variant={prof.cv_status || "pending"}>{prof.cv_status || "pending"}</Badge>
                            {prof.cv_status === "approved" && cvUrl && (
                              <a
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-500"
                                title="Open CV"
                              >
                                📄
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No CV</span>
                        )}
                      </Table.Cell>

                      {/* Actions */}
                      <Table.Cell>
                        <Button
                          size="sm"
                          onClick={() => {
                            toast.success(`Schedule interview for ${s.full_name}`);
                          }}
                          disabled={disabled}
                        >
                          Schedule Interview
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
