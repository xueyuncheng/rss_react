import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

import { Asset } from './asset'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const MyChart = ({ items }: { items: Asset[] }) => {
  const data = {
    labels: items.map((item) => item.date),
    datasets: [
      {
        label: 'Money',
        data: items.map((item) => item.money_yuan),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  }

  return (
    <div className="flex items-center justify-center">
      <Line data={data} />
    </div>
  )
}

export default MyChart
