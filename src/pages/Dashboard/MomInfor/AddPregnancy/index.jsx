import { Button, Form, Input, Modal, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './AddPregnancy.module.css';
import axiosClient from '../../../../utils/apiCaller';

const AddPregnancy = ({ week, open, onClose, id }) => {
  console.log("id", id);
  console.log("week", week);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [form] = Form.useForm();
  const [fetusStandardsByWeek, setFetusStandardsByWeek] = useState([]);

  useEffect(() => {
    if (open && week) {
      const fetchGrowthMetricByWeek = async () => {
        try {
          setFetchingData(true);
          const response = await axiosClient.get(`/metrics/week/${week}`);
          console.log("API response:", response);

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
        metricId: field.id, // Assuming each metric in fetusStandardsByWeek has an id field
        value: Number(values[field.name]) || 0
      }));

      console.log("Sending formatted data:", formattedData);

      // // Submit data to server
      // const response = await axiosClient.post(`/pregnancies/${id}/metrics`, formattedData);

      // if (response.code === 200 || response.code === 201) {
      //   message.success('Metrics saved successfully');
      //   onClose();
      // } else {
      //   message.error('Failed to save metrics');
      // }
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
          className={styles.form}
        >
          {fetusStandardsByWeek.map((field) => (
            <Form.Item
              key={field.name}
              label={`${field.name} (${field.unit})`}
              name={field.name}
            >
              <Input type="number" placeholder={`Enter ${field.name}`} />
            </Form.Item>
          ))}
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
