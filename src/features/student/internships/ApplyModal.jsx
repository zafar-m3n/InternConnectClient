import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { applicationsService } from '../../../services/applications';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';

const schema = yup.object({
  cover_letter: yup.string().required('Cover letter is required')
});

const ApplyModal = ({ isOpen, onClose, internship }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await applicationsService.apply(internship.id, data);
      toast.success('Application submitted successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Apply for ${internship?.title}`}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">{internship?.title}</h3>
          <p className="text-gray-600">{internship?.company}</p>
          <p className="text-sm text-gray-500">{internship?.location}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter *
          </label>
          <textarea
            {...register('cover_letter')}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Write a compelling cover letter explaining why you're interested in this internship and what you can bring to the role..."
          />
          {errors.cover_letter && (
            <p className="mt-1 text-sm text-red-600">{errors.cover_letter.message}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your approved CV will be automatically attached to this application. 
            Make sure your profile is complete and your CV is approved before applying.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;