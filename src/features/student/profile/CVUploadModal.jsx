import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { profileService } from '../../../services/profile';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';

const schema = yup.object({
  cv: yup
    .mixed()
    .required('Please select a CV file')
    .test('fileType', 'Only PDF files are allowed', (value) => {
      return value && value[0] && value[0].type === 'application/pdf';
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024;
    })
});

const CVUploadModal = ({ open, onClose, onUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  const selectedFile = watch('cv');

  const onSubmit = async (data) => {
    const file = data.cv[0];
    if (!file) return;

    setUploading(true);
    try {
      await profileService.uploadCV(file);
      toast.success('CV uploaded successfully!');
      reset();
      onUploaded();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="Upload CV" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CV File *
          </label>
          <input
            type="file"
            accept="application/pdf"
            {...register('cv')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.cv && (
            <p className="mt-1 text-sm text-red-600">{errors.cv.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
        </div>

        {selectedFile && selectedFile[0] && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Selected:</strong> {selectedFile[0].name}
            </p>
            <p className="text-sm text-gray-500">
              Size: {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={uploading}
            disabled={!selectedFile || selectedFile.length === 0}
          >
            Upload CV
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CVUploadModal;