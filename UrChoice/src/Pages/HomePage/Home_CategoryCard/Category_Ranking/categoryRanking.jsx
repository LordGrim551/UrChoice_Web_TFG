import React from 'react';
import {  ScatterChart,  Scatter,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  ResponsiveContainer,  LabelList} from 'recharts';
import Logo from './logoHeader.png';

const Ranking = ({ categoryId, handleBack }) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F'];
  const fetchRanking = async() =>{
    
  }

  const rankings = [
    { id: 1, name: 'card 1', score: 95, image: Logo },
    { id: 2, name: 'card 2', score: 90, image: Logo },
    { id: 3, name: 'card 3', score: 50, image: Logo },
    { id: 4, name: 'card 4', score: 80, image: Logo },
    { id: 5, name: 'card 5', score: 75, image: Logo },
  ];

  const maxScore = Math.max(...rankings.map(item => item.score));

  const chartData = rankings.map(item => ({
    x: item.score,
    y: item.name,
    isMax: item.score === maxScore,
    id: item.id,
    image: item.image,
    lineColor: COLORS[item.id % COLORS.length]
  }));

  const CustomImageComponent = ({ x, y, payload, color }) => {
    const startX = 100;
    const startY = y;

    return (
      <g>
        {/* Línea horizontal desde el eje X hasta el punto */}
        <line x1={startX} y1={startY} x2={x} y2={y} stroke={color} strokeWidth={2} />
        <circle cx={startX} cy={startY} r={5} fill={color} />
        <image
          x={x - 15}
          y={y - 15}
          width={30}
          height={30}
          xlinkHref={payload.image}
        />
      </g>
    );
  };

  return (
    <div className="border-2 border-cyan-400 p-4 rounded-lg w-full mx-auto overflow-y-auto scrollbar-custom max-h-[78vh] ">
      <img src="asddas" alt="category image" className='border-2 border-cyan-400 h-32 w-full rounded-t-2xl' />
      <div className="w-full bg-cyan-400 h-24 mb-5 flex justify-center items-center">Ranking category ID: {categoryId}</div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full h-auto border-2 border-cyan-400 rounded-2xl md:w-1/2">
          {rankings.map((item, index) => (
            <div key={item.id} className="flex items-center border border-cyan-400 py-2 mb-4 m-5 rounded-2xl">
              <div className="w-10 text-center">{index + 1}</div>
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full" />
              <div className="ml-4 font-semibold">{item.name}</div>
              <div className="ml-auto mr-2">Score: {item.score}</div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2 h-auto border-2 border-cyan-400 rounded-2xl">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="Score"
                domain={[0, 100]}
                label={{ value: 'Puntuación', position: 'bottom' }}
              />
              <YAxis
                type="category"
                dataKey="y"
                name="Card"
                width={80}
                label={{ value: 'Cartas', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Puntuaciones"
                data={chartData}
                shape={(props) => (
                  <CustomImageComponent {...props} color={props.payload.lineColor} />
                )}
              >
                <LabelList dataKey="x" position="right" />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full flex justify-between mt-4 gap-3.5 ">
        <button className="bg-cyan-500 w-1/4 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded" onClick={handleBack}>
          Back
        </button>
        <button className="w-3/4 bg-red-600 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Partida en solitario
        </button>
      </div>
    </div>
  );
};

export default Ranking;
