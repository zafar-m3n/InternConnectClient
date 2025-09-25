import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { internshipsService } from "../../../services/internships";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import SearchBar from "../../../components/SearchBar";
import Select from "../../../components/Select";
import Pagination from "../../../components/Pagination";

const StudentInternshipsList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { control, watch } = useForm({
    defaultValues: {
      skill: null,
      location: null,
    },
  });

  const skillFilter = watch("skill");
  const locationFilter = watch("location");

  const skillOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "UI/UX Design", label: "UI/UX Design" },
  ];

  const locationOptions = [
    { value: "Colombo", label: "Colombo" },
    { value: "Kandy", label: "Kandy" },
    { value: "Galle", label: "Galle" },
    { value: "Jaffna", label: "Jaffna" },
    { value: "Kurunegala", label: "Kurunegala" },
  ];

  useEffect(() => {
    fetchInternships();
  }, [currentPage, skillFilter, locationFilter]);

  const fetchInternships = async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(skillFilter && { skill: skillFilter.value }),
        ...(locationFilter && { location: locationFilter.value }),
      };

      const data = await internshipsService.list(params);
      setInternships(data.internships || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setCurrentPage(1);
    fetchInternships(searchTerm);
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
        <h1 className="text-3xl font-bold text-gray-900">Available Internships</h1>
        <p className="text-gray-600">Discover internship opportunities that match your interests</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchBar onSearch={handleSearch} placeholder="Search internships..." />

            <Controller
              name="skill"
              control={control}
              render={({ field }) => (
                <Select
                  options={skillOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Filter by skill..."
                  isClearable
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  options={locationOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Filter by location..."
                  isClearable
                />
              )}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Internships List */}
      {internships.length === 0 ? (
        <EmptyState
          title="No internships found"
          description="Try adjusting your search criteria or check back later for new opportunities."
          icon={() => <div className="text-4xl">🔍</div>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {internships.map((internship) => (
              <Card key={internship.id}>
                <Card.Content>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{internship.title}</h3>
                      <p className="text-gray-600 font-medium">{internship.company}</p>
                    </div>
                    <Badge variant={internship.status}>{internship.status}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      {internship.location}
                    </div>
                    {internship.duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📅</span>
                        {internship.duration}
                      </div>
                    )}
                    {internship.stipend && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">💰</span>
                        LKR {internship.stipend.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{internship.description}</p>

                  {internship.skills && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {internship.skills.split(", ").map((skill, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Deadline:{" "}
                      {internship.application_deadline
                        ? new Date(internship.application_deadline).toLocaleDateString()
                        : "Not specified"}
                    </span>
                    <Link to={`/student/internships/${internship.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default StudentInternshipsList;
