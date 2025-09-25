import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { adminService } from '../../../services/admin';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Select from '../../../components/Select';
import Loader from '../../../components/Loader';

const schema = yup.object({
  allowRegistration: yup.boolean().required(),
  emailTransport: yup.string().required(),
  defaultPasswordPolicy: yup.object({
    min: yup.number().min(6).max(20).required(),
    requireNumber: yup.boolean().required(),
    requireCase: yup.boolean().required()
  })
});

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emailTransportOptions = [
    { value: 'json', label: 'JSON (Development)' },
    { value: 'ethereal', label: 'Ethereal Email' }
  ];

  const booleanOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      allowRegistration: true,
      emailTransport: 'json',
      defaultPasswordPolicy: {
        min: 8,
        requireNumber: true,
        requireCase: true
      }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();
      const settings = data.items || [];
      
      settings.forEach(setting => {
        if (setting.key === 'defaultPasswordPolicy') {
          setValue('defaultPasswordPolicy', setting.value);
        } else {
          setValue(setting.key, setting.value);
        }
      });
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const settings = [
        { key: 'allowRegistration', value: data.allowRegistration?.value ?? data.allowRegistration },
        { key: 'emailTransport', value: data.emailTransport?.value ?? data.emailTransport },
        { key: 'defaultPasswordPolicy', value: data.defaultPasswordPolicy }
      ];

      await adminService.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings and policies</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Settings */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <Controller
                name="allowRegistration"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Allow User Registration"
                    options={booleanOptions}
                    value={booleanOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option)}
                    error={errors.allowRegistration?.message}
                    helpText="Controls whether new users can register for accounts"
                  />
                )}
              />

              <Controller
                name="emailTransport"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Email Transport"
                    options={emailTransportOptions}
                    value={emailTransportOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option)}
                    error={errors.emailTransport?.message}
                    helpText="Method used for sending system emails"
                  />
                )}
              />
            </div>
          </Card.Content>
        </Card>

        {/* Password Policy */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Password Policy</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  {...register('defaultPasswordPolicy.min')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.defaultPasswordPolicy?.min && (
                  <p className="mt-1 text-sm text-red-600">{errors.defaultPasswordPolicy.min.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Minimum number of characters required</p>
              </div>

              <Controller
                name="defaultPasswordPolicy.requireNumber"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Require Numbers"
                    options={booleanOptions}
                    value={booleanOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option)}
                    error={errors.defaultPasswordPolicy?.requireNumber?.message}
                    helpText="Require at least one number in passwords"
                  />
                )}
              />

              <Controller
                name="defaultPasswordPolicy.requireCase"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Require Mixed Case"
                    options={booleanOptions}
                    value={booleanOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option)}
                    error={errors.defaultPasswordPolicy?.requireCase?.message}
                    helpText="Require both uppercase and lowercase letters"
                  />
                )}
              />
            </div>
          </Card.Content>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={saving}
            size="lg"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;