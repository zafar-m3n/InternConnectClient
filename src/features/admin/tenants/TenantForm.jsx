import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { adminService } from '../../../services/admin';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

const schema = yup.object({
  name: yup.string().required('University name is required'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  contact_email: yup.string().email('Invalid email').required('Contact email is required'),
  is_active: yup.boolean().required('Status is required')
});

const TenantForm = ({ tenant, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const isEdit = !!tenant;

  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: tenant?.name || '',
      slug: tenant?.slug || '',
      contact_email: tenant?.contact_email || '',
      is_active: tenant?.is_active ?? true
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        is_active: data.is_active?.value ?? data.is_active
      };

      if (isEdit) {
        await adminService.updateTenant(tenant.id, submitData);
        toast.success('Tenant updated successfully');
      } else {
        await adminService.createTenant(submitData);
        toast.success('Tenant created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(isEdit ? 'Failed to update tenant' : 'Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? 'Edit Tenant' : 'Create New Tenant'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="University Name *"
          {...register('name')}
          error={errors.name?.message}
          placeholder="e.g., University of Colombo"
        />

        <Input
          label="Slug *"
          {...register('slug')}
          error={errors.slug?.message}
          placeholder="e.g., uoc"
          helpText="Used in URLs and system identification. Only lowercase letters, numbers, and hyphens."
        />

        <Input
          label="Contact Email *"
          type="email"
          {...register('contact_email')}
          error={errors.contact_email?.message}
          placeholder="e.g., admin@university.edu"
        />

        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <Select
              label="Status *"
              options={statusOptions}
              value={statusOptions.find(option => option.value === field.value)}
              onChange={(option) => field.onChange(option)}
              error={errors.is_active?.message}
            />
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {isEdit ? 'Update Tenant' : 'Create Tenant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TenantForm;