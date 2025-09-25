import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';

const CVPreviewModal = ({ isOpen, onClose, profile, onApprove, onReject }) => {
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const getCVPreviewUrl = () => {
    if (!profile?.cv_file_path) return null;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const serverBase = apiBase.replace('/api/v1', '');
    return serverBase + profile.cv_file_path;
  };

  const handleAction = async (data) => {
    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(profile.User.id, data.feedback || '');
      } else if (action === 'reject') {
        await onReject(profile.User.id, data.feedback);
      }
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAction(null);
    reset();
    onClose();
  };

  if (!profile) return null;

  const pdfUrl = getCVPreviewUrl();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`CV Review - ${profile.User.full_name}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Student Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900">{profile.User.full_name}</h3>
              <p className="text-sm text-gray-600">{profile.User.email}</p>
              <p className="text-sm text-gray-600">{profile.student_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Degree:</span> {profile.degree || 'Not specified'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Year:</span> {profile.year_of_study || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {profile.phone || 'Not provided'}
              </p>
            </div>
          </div>
          {profile.skills && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Skills:</span> {profile.skills}
              </p>
            </div>
          )}
        </div>

        {/* CV Preview */}
        {pdfUrl ? (
          <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <p>Unable to display PDF. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download instead</a></p>
            </object>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No CV file available
          </div>
        )}

        {/* Action Form */}
        {action && (
          <form onSubmit={handleSubmit(handleAction)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'reject' ? 'Feedback (Required)' : 'Feedback (Optional)'}
              </label>
              <textarea
                {...register('feedback', {
                  required: action === 'reject' ? 'Feedback is required for rejection' : false
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={
                  action === 'approve' 
                    ? 'Optional feedback for the student...'
                    : 'Please provide specific feedback on what needs to be improved...'
                }
              />
              {errors.feedback && (
                <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAction(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant={action === 'reject' ? 'danger' : 'primary'}
              >
                {action === 'approve' ? 'Approve CV' : 'Reject CV'}
              </Button>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        {!action && (
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => setAction('reject')}
            >
              Reject
            </Button>
            <Button
              onClick={() => setAction('approve')}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CVPreviewModal;