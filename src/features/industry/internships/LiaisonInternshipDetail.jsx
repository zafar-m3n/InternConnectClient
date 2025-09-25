import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { internshipsService } from "../../../services/internships";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import Loader from "../../../components/Loader";

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

const LiaisonInternshipDetail = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const data = await internshipsService.get(id);
      setInternship(data);
    } catch (error) {
      toast.error("Failed to load internship details");
    } finally {
      setLoading(false);
    }
  };

  // --- Frontend-only mock helpers ---
  const base64url = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  };

  const generateToken = (len = 32) => {
    const arr = new Uint8Array(len);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return base64url(arr);
  };

  const buildStaticMagicLink = (job) => {
    const params = new URLSearchParams({
      token: job.token,
      job: job.internshipId,
    });
    return `${window.location.origin}/p/company?${params.toString()}`;
  };

  const getKey = (internshipId) => `cpl_${internshipId}`;

  const handleGenerateMagicLink = async () => {
    if (!internship) return;
    setGenerating(true);
    try {
      const deadline = internship.application_deadline ? new Date(internship.application_deadline) : null;
      const expiresAt = deadline ? new Date(deadline.getTime() + TWO_WEEKS_MS) : new Date(Date.now() + TWO_WEEKS_MS);

      const key = getKey(internship.id);
      const now = new Date();
      let record = null;

      // Reuse if exists and not expired
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.token && parsed?.expiresAt && new Date(parsed.expiresAt) > now) {
            record = parsed;
          }
        }
      } catch (_) {
        // ignore parse errors
      }

      if (!record) {
        record = {
          internshipId: internship.id,
          token: generateToken(32),
          expiresAt: expiresAt.toISOString(),
        };
        localStorage.setItem(key, JSON.stringify(record));
      }

      const url = buildStaticMagicLink(record);

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Magic link generated and copied to clipboard");
      } else {
        toast.success("Magic link generated");
      }
    } catch {
      toast.error("Failed to generate magic link");
    } finally {
      setGenerating(false);
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
        <Link to="/industry/internships" className="text-primary-600 hover:text-primary-500">
          Back to internships
        </Link>
      </div>
    );
  }

  // Compute visibility for the magic link button:
  const deadline = internship.application_deadline ? new Date(internship.application_deadline) : null;
  const now = new Date();
  const showMagicLink =
    !!deadline &&
    now.getTime() > deadline.getTime() && // deadline passed
    now.getTime() <= deadline.getTime() + TWO_WEEKS_MS; // within 14 days after

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/industry/internships"
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
          <div className="flex items-center space-x-4">
            <Badge variant={internship.status}>{internship.status}</Badge>
            <Link to={`/industry/internships/${internship.id}/edit`}>
              <Button>
                <span className="mr-2">✏️</span>
                Edit
              </Button>
            </Link>
          </div>
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
                  {internship.skills.split(", ").map((skill, index) => (
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
                      <p className="font-medium">{new Date(internship.application_deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          <Button className="w-full !my-4" size="lg" onClick={handleGenerateMagicLink} loading={generating}>
            Generate Company Link
          </Button>

          <Link to={`/industry/applicants?internship=${internship.id}`}>
            <Button className="w-full" size="lg">
              View Applicants
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiaisonInternshipDetail;
