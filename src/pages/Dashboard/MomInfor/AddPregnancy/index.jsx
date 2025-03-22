import { Button, Checkbox, Form, Input, Modal, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../utils/apiCaller';
import './AddPregnancy.css';

const AddPregnancy = ({ week, open, onClose, id, fetchAllGrowthMetricByWeek }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [form] = Form.useForm();
  const [fetusStandardsByWeek, setFetusStandardsByWeek] = useState([]);
  const [existingMetrics, setExistingMetrics] = useState([]);

  // Reset form when modal opens or when week changes
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, week, form]);

  useEffect(() => {
    if (open && week) {
      const fetchGrowthMetricByWeek = async () => {
        try {
          setFetchingData(true);
          const response = await axiosClient.get(`/metrics/week/${week}`);

          if (response.code === 200) {
            setFetusStandardsByWeek(response.data);
          } else {
            message.error('Failed to fetch metrics data');
            console.error('API error:', response);
          }
        } catch (error) {
          message.error('An error occurred while fetching metrics');
          console.error("error", error);
        } finally {
          setFetchingData(false);
        }
      };
      fetchGrowthMetricByWeek();
    }
  }, [open, week]);

  // Fetch existing metrics for this fetus and week
  useEffect(() => {
    if (open && id && week) {
      const fetchExistingMetrics = async () => {
        try {
          setFetchingData(true);
          setExistingMetrics([]); // Clear existing metrics when fetching new ones
          const response = await axiosClient.get(`/fetus-metrics/fetus/${id}/weeks/${week}`);
          console.log("Existing metrics response for week " + week + ":", response);

          if (response.code === 200) {
            setExistingMetrics(response.data || []);

            // Only pre-populate the form if response.data.length > 0
            if (response.data && response.data.length > 0) {
              console.log("Pre-filling form with existing data for week " + week);
              const formValues = {};
              response.data.forEach(metric => {
                formValues[metric.metricName] = metric.value;
              });
              form.setFieldsValue(formValues);
              message.info('Loaded existing data for this week');
            } else {
              console.log("No existing data for week " + week + ", form not pre-filled");
              form.resetFields(); // Ensure form is reset if no data exists
            }
          } else {
            console.error('API error when fetching existing metrics:', response);
            form.resetFields(); // Reset form on error
          }
        } catch (error) {
          console.error("Error fetching existing metrics for week " + week, error);
          form.resetFields(); // Reset form on error
        } finally {
          setFetchingData(false);
        }
      };
      fetchExistingMetrics();
    }
  }, [open, id, week, form]);

  console.log("fetusStandardsByWeek", fetusStandardsByWeek);

  const handleSubmit = async (values) => {
    if (!id) {
      message.error('No pregnancy ID provided');
      return;
    }

    try {
      setLoading(true);

      // Format data as an array of objects with fetusId, metricId, and value
      const formattedData = fetusStandardsByWeek.map(field => ({
        fetusId: Number(id),
        metricId: field.metricId, // Assuming each metric in fetusStandardsByWeek has an id field
        value: Number(values[field.metricName]) || 0
      }));

      console.log("Sending formatted data:", formattedData);

      // Submit data to server
      const response = await axiosClient.post(`/fetus-metrics?week=${week}`, formattedData);

      if (response.code === 200 || response.code === 201) {
        message.success('Metrics saved successfully');
        fetchAllGrowthMetricByWeek(); // Refresh metrics data
        onClose();
      } else {
        message.error('Failed to save metrics');
      }
    } catch (error) {
      message.error('An error occurred while saving metrics');
      console.error('error', error);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = `Week ${week} Details`;

  return (
    <Modal title={modalTitle} open={open} onCancel={onClose} footer={null}>
      {loading || fetchingData ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              Loading...
            </div>
          </Spin>
        </div>
      ) : fetusStandardsByWeek.length > 0 ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {fetusStandardsByWeek.map((field) => (
            <Form.Item
              key={field.id}
              label={
                <div className='formItemLabel'>
                  <span className={'metricName'}>{field.metricName}</span>
                  <span className={'metricUnit'}>({field.unit})</span>
                  {(field.min !== null || field.max !== null) && (
                    <div className={'metricRange'}>
                      {field.min !== null && <span>Min: {field.min + (field.min * 0.1)}</span>}
                      {field.min !== null && field.max !== null && <span> • </span>}
                      {field.max !== null && <span>Max: {field.max + (field.max * 0.1)}</span>}
                    </div>
                  )}
                </div>
              }
              name={field.metricName}
              rules={[
                {
                  validator: (_, value) => {
                    const numValue = Number(value);
                    const minVal = field.min !== null ? field.min + (field.min * 0.1) : null;
                    const maxVal = field.max !== null ? field.max + (field.max * 0.1) : null;

                    if (value === undefined || value === '') {
                      return Promise.reject(new Error(`Please enter a value for ${field.metricName}`));
                    }

                    if (minVal !== null && numValue < minVal) {
                      return Promise.reject(new Error(`Value cannot be less than ${minVal.toFixed(2)}`));
                    }

                    if (maxVal !== null && numValue > maxVal) {
                      return Promise.reject(new Error(`Value cannot be greater than ${maxVal.toFixed(2)}`));
                    }

                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                type="number"
                placeholder={`Enter ${field.metricName}`}
                step="0.01"
              />
            </Form.Item>
          ))}

          {/* Note about metrics ranges */}
          <div className="note-container" style={{
            backgroundColor: '#f9f9f9',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            border: '1px solid #e8e8e8'
          }}>
            <p style={{ margin: 0, color: '#666' }}>
              <strong>Note:</strong> The values must be within the minimum and maximum ranges shown.
              These ranges are suitable for a single child pregnancy.
              For multiple pregnancies, please consult with your healthcare provider.
            </p>
          </div>

          <Form.Item
            name="confirmation"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Please confirm your data')),
              },
            ]}
          >
            <Checkbox>I confirm that the entered values are accurate</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={loading}
            loading={loading}
            className={'update-button-subscription'}
          >
            Submit
          </Button>
        </Form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No metrics data available for this week
        </div>
      )}
    </Modal>
  );
};

export default AddPregnancy;
