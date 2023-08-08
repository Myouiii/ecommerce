import { merge } from 'lodash';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
//
import BaseOptionChart from '../charts/BaseOptionChart';
import * as api from '../../api';

// ----------------------------------------------------------------------

// const CHART_DATA = [
//   {
//     year: 2019,
//     data: [
//       { name: 'Total Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
//       { name: 'Total Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] }
//     ]
//   },
//   {
//     year: 2020,
//     data: [
//       { name: 'Total Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
//       { name: 'Total Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] }
//     ]
//   }
// ];
const CHART_DATA = [
  {
    year: 2019,
    data: [{ name: 'Total Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] }]
  },
  {
    year: 2020,
    data: [{ name: 'Total Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] }]
  }
];
export default function StatisticYearlySales() {
  const [seriesData, setSeriesData] = useState(new Date().getFullYear());
  const [charData, setCharData] = useState([]);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const charOptions = [];
    await api.getStaMonthlyRevenue().then((data) => {
      const result = data.data;
      const charThisYear = {
        year: new Date().getFullYear(),
        data: [
          {
            name: 'Total',
            data: result?.thisYear
          }
        ]
      };
      const charLastYear = {
        year: new Date().getFullYear() - 1,
        data: [
          {
            name: 'Total',
            data: result?.lastYear
          }
        ]
      };
      charOptions.push(charThisYear);
      charOptions.push(charLastYear);
    });
    setCharData(charOptions);
  }, []);
  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  });

  return (
    <Card>
      <CardHeader
        title="Thống kê doanh thu"
        subheader="(+43%) than last year"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
            }}
          >
            {charData.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {charData.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
