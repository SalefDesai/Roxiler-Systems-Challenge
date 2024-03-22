import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { PIE_CHART } from '../utils/routes';
import { Heading } from '@chakra-ui/react';

const PieChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${PIE_CHART}?month=${month}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [month]);

  const options = {
    labels: data.map((item) => item.category),
    legend: {
      show: true,
    },
  };

  const series = data.map((item) => item.count);

  return (
    <div>
      <Heading w={'100%'} textAlign={'center'} size='md' mt={10} mb={2}>Pie Chart - {month}</Heading>
      <ReactApexChart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default PieChart;
