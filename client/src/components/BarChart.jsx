import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { BAR_CHART } from '../utils/routes';
import { Heading } from '@chakra-ui/react';

const BarChart = ({ month }) => {

  const [counts, setCounts] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);

  useEffect(() => {
    const fetchBarData = async () => {
      const { data } = await axios.get(`${BAR_CHART}?month=${month}`);

      const priceR = data.data.map(item => item.priceRange);
      const noOfItems = data.data.map(item => item.count);

      setPriceRanges(priceR);
      setCounts(noOfItems);
    }

    fetchBarData();
  }, [month])

  const state = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: priceRanges,
        title: {
          text: 'Price Range'
        }
      },
      yaxis: {
        title: {
          text: 'Number of Items'
        }
      }
    },
    series: [
      {
        name: 'Count',
        data: counts
      },
    ],
  };

  return (
    <div>
      <Heading w={'100%'} textAlign={'center'} size='md' mt={10} mb={-2}>Bar Charts Statistics - {month}</Heading>
      <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
