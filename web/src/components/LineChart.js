import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function LineChart(props) {

    const [getData, setGetData] = useState([])
    const [lineData, setLineData] = useState({
        label: [],
        c2: [],
        c3: [],
        c4: [],
        c5: [],
        c6: [],
        c7: [],
    });

    const options = {
        responsive: true,
    };

    const data = {
        labels: lineData.label,
        datasets: [
            {
                label: 'ระทึกขวัญ',
                data: lineData.c2,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4,
            },
            {
                label: 'สืบสวน',
                data: lineData.c3,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.4,
            },
            {
                label: 'แฟนตาซี',
                data: lineData.c4,
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                tension: 0.4,
            },
            {
                label: 'วิทยาศาสตร์',
                data: lineData.c5,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4,
            },
            {
                label: 'แอ๊คชั่น',
                data: lineData.c6,
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                tension: 0.4,
            },
            {
                label: 'รักดราม่า',
                data: lineData.c7,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                tension: 0.4,
            },
        ],
    };

    useEffect(() => {
        setGetData(props.chapterList)
    })

    useEffect(() => {
        const newData = {
            label: [],
            c2: [],
            c3: [],
            c4: [],
            c5: [],
            c6: [],
            c7: [],
        }
        props.chapterList?.map((item, index) => {
            newData['label'].push(item.chapter)
            switch (item.category) {
                case 2:
                    newData.c2.push(item.probability)
                    newData.c3.push(0)
                    newData.c4.push(0)
                    newData.c5.push(0)
                    newData.c6.push(0)
                    newData.c7.push(0)
                    break;
                case 3:
                    newData.c2.push(0)
                    newData.c3.push(item.probability)
                    newData.c4.push(0)
                    newData.c5.push(0)
                    newData.c6.push(0)
                    newData.c7.push(0)
                    break;
                case 4:
                    newData.c2.push(0)
                    newData.c3.push(0)
                    newData.c4.push(item.probability)
                    newData.c5.push(0)
                    newData.c6.push(0)
                    newData.c7.push(0)
                    break;
                case 5:
                    newData.c2.push(0)
                    newData.c3.push(0)
                    newData.c4.push(0)
                    newData.c5.push(item.probability)
                    newData.c6.push(0)
                    newData.c7.push(0)
                    break;
                case 6:
                    newData.c2.push(0)
                    newData.c3.push(0)
                    newData.c4.push(0)
                    newData.c5.push(0)
                    newData.c6.push(item.probability)
                    newData.c7.push(0)
                    break;
                case 7:
                    newData.c2.push(0)
                    newData.c3.push(0)
                    newData.c4.push(0)
                    newData.c5.push(0)
                    newData.c6.push(0)
                    newData.c7.push(item.probability)
                    break;
            }
            switch (item.sub_category1) {
                case 2:
                    newData.c2[index] = item.probability_sub_1
                    break;
                case 3:
                    newData.c3[index] = item.probability_sub_1
                    break;
                case 4:
                    newData.c4[index] = item.probability_sub_1
                    break;
                case 5:
                    newData.c5[index] = item.probability_sub_1
                    break;
                case 6:
                    newData.c6[index] = item.probability_sub_1
                    break;
                case 7:
                    newData.c7[index] = item.probability_sub_1
                    break;
            }
            switch (item.sub_category2) {
                case 2:
                    newData.c2[index] = item.probability_sub_2
                    break;
                case 3:
                    newData.c3[index] = item.probability_sub_2
                    break;
                case 4:
                    newData.c4[index] = item.probability_sub_2
                    break;
                case 5:
                    newData.c5[index] = item.probability_sub_2
                    break;
                case 6:
                    newData.c6[index] = item.probability_sub_2
                    break;
                case 7:
                    newData.c7[index] = item.probability_sub_2
                    break;
            }
        })
        setLineData(newData)
        console.log(newData);

    }, [getData])

    return <Line options={options} data={data} />;
}

export default LineChart;