import React from 'react';
import { Modal, Typography, Space, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const MetricExplanationModal = ({ open, onClose }) => {
  const metrics = [
    {
      name: 'Gestational Sac Diameter',
      unit: 'mm',
      description: 'The diameter of the fluid-filled structure that surrounds the embryo in early pregnancy. Used to estimate gestational age in early pregnancy.'
    },
    {
      name: 'Yolk Sac Diameter',
      unit: 'mm',
      description: 'The diameter of the yolk sac, which provides nutrients to the embryo before the placenta is fully formed. Important in early pregnancy assessment.'
    },
    {
      name: 'Beta-hCG',
      unit: 'mIU/mL',
      description: 'Human Chorionic Gonadotropin, a hormone produced during pregnancy. Levels help confirm pregnancy and assess its progression.'
    },
    {
      name: 'Mean Sac Diameter',
      unit: 'mm',
      description: 'The average diameter of the gestational sac, calculated from measurements in three perpendicular planes. Used for dating early pregnancies.'
    },
    {
      name: 'Biparietal Diameter',
      unit: 'mm',
      description: 'The diameter across the widest part of the fetal skull. Used to estimate fetal age and monitor brain growth.'
    },
    {
      name: 'Crown-Rump Length',
      unit: 'mm',
      description: 'The length from the top of the head to the bottom of the buttocks. The most accurate measurement for dating pregnancy between 7-13 weeks.'
    },
    {
      name: 'Abdominal Circumference',
      unit: 'mm',
      description: 'The measurement around the abdomen at the level of the liver and stomach. Used to assess fetal growth and nutrition status.'
    },
    {
      name: 'Fetal Heart Rate',
      unit: 'bpm',
      description: 'The number of heartbeats per minute. Normal range varies by gestational age, typically 110-160 beats per minute.'
    },
    {
      name: 'Weight',
      unit: 'g',
      description: 'Estimated fetal weight calculated from various measurements. Important for tracking growth and identifying growth abnormalities.'
    },
    {
      name: 'Femur Length',
      unit: 'mm',
      description: 'The length of the thigh bone. Used to assess fetal growth and helps in estimating gestational age.'
    },
  ];

  return (
    <Modal
      title={<Title level={3}>Understanding Pregnancy Metrics</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Paragraph>
        These measurements help track your baby's growth and development throughout pregnancy.
        Different metrics are more relevant at different stages of pregnancy.
      </Paragraph>

      <Space direction="vertical" style={{ width: '100%' }}>
        {metrics.map((metric, index) => (
          <div key={index}>
            <Title level={4}>{metric.name} ({metric.unit})</Title>
            <Paragraph>{metric.description}</Paragraph>
            {index < metrics.length - 1 && <Divider />}
          </div>
        ))}
      </Space>
    </Modal>
  );
};

export default MetricExplanationModal;
