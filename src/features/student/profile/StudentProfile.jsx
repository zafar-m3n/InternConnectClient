import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { profileService } from '../../../services/profile';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Loader from '../../../components/Loader';
import Modal from '../../../components/Modal';
import CVUploadModal from './CVUploadModal';

const schema = yup.object({
  student_id: yup.string(),
  phone: yup.string(),
  degree: yup.string(),
  year_of_study: yup.number().min(1).max(5),
  skills: yup.string()
});

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [showCVUpload, setShowCVUpload] = useState(false);

  const {
    register,
    handleSubmit,
    setValue, 
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  });

  const skillOptions = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'SQL', label: 'SQL' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getMe();
      setProfile(data);
      
      // Set form values
      setValue('student_id', data.student_id || '');
      setValue('phone', data.phone || '');
      setValue('degree', data.degree || '');
      setValue('year_of_study', data.year_of_study || '');
      setValue('skills', data.skills || '');
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updatedProfile = await profileService.updateMe(data);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCVUploaded = () => {
    fetchProfile();
  };

  const getCVPreviewUrl = () => {
    if (!profile?.cv_file_path) return null;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const serverBase = apiBase.replace('/api/v1', '');
    return serverBase + profile.cv_file_path;
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
      <div className="flex justify-between items-start">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600">Manage your profile information and CV</p>
      </div>
        <Button onClick={() => setShowCVUpload(true)}>
          Upload CV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Student ID"
                    {...register('student_id')}
                    error={errors.student_id?.message}
                  />

                  <Input
                    label="Phone"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>

                <Input
                  label="Degree"
                  {...register('degree')}
                  error={errors.degree?.message}
                />

                <Input
                  label="Year of Study"
                  type="number"
                  min="1"
                  max="5"
                  {...register('year_of_study')}
                  error={errors.year_of_study?.message}
                />

                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Select
                  label="Skills"
                      options={skillOptions}
                      value={skillOptions.filter(option => 
                        field.value?.split(', ').includes(option.value)
                      )}
                      onChange={(selected) => 
                        field.onChange(selected?.map(s => s.value).join(', ') || '')
                      }
                      isMulti
                      placeholder="Select your skills..."
                  error={errors.skills?.message}
                    />
                  )}
                />

                <Button
                  type="submit"
                  loading={saving}
                  className="w-full"
                >
                  Update Profile
                </Button>
              </form>
            </Card.Content>
          </Card>
        </div>

        {/* CV Section */}
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">CV Management</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {profile?.cv_file_path ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm text-gray-600 mb-2">CV Status:</p>
                    <Badge variant={profile.cv_status} className="mb-4">
                      {profile.cv_status}
                    </Badge>
                    
                    {profile.cv_feedback && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Feedback:</p>
                        <p className="text-sm text-gray-600">{profile.cv_feedback}</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCVPreview(true)}
                      className="mt-4"
                    >
                      Preview CV
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📤</div>
                    <p className="text-sm text-gray-600 mb-4">No CV uploaded</p>
                    <p className="text-xs text-gray-500">PDF only, max 5MB</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* CV Upload Modal */}
      <CVUploadModal
        open={showCVUpload}
        onClose={() => setShowCVUpload(false)}
        onUploaded={handleCVUploaded}
      />

      {/* CV Preview Modal */}
      <Modal
        isOpen={showCVPreview}
        onClose={() => setShowCVPreview(false)}
        title="CV Preview"
        size="xl"
      >
        {getCVPreviewUrl() ? (
          <div className="space-y-4">
          <object
            data={getCVPreviewUrl()}
            type="application/pdf"
            className="w-full h-[80vh]"
          >
              <p className="text-center py-8">
                Unable to display PDF in browser.
              </p>
          </object>
            <div className="flex justify-center space-x-4">
              <a
                href={getCVPreviewUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500"
              >
                Open in new tab
              </a>
              <span className="text-gray-400">·</span>
              <a
                href={getCVPreviewUrl()}
                download
                className="text-primary-600 hover:text-primary-500"
              >
                Download
              </a>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No CV available</p>
        )}
      </Modal>
    </div>
  );
};

export default StudentProfile;