import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Line } from 'recharts';


const Ranking = ({ categoryId, handleBack }) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F'];
  const [rankings, setRankings] = useState([]);
  const [categoryImage, setCategoryImage] = useState('');
  const navigate = useNavigate();
  const fetchRanking = async (categoryId) => {
    const response = await fetch(`https://railwayserver-production-7692.up.railway.app/elements/ranking/${categoryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (response.ok && Array.isArray(data)) {
      const formattedCategories = data.map(categoryElement => ({
        id: categoryElement.id_elem,
        name: categoryElement.name_elem,
        score: categoryElement.victories ?? 0,
        image: `data:image/png;base64,${categoryElement.img_elem}`
      }));
      setRankings(formattedCategories);
    }
  };
  const fetchCategoryImage = async (categoryId) => {
    const response = await fetch(
      `https://railwayserver-production-7692.up.railway.app/category/${categoryId}`
    );
    const data = await response.json();
    if (response.ok) {
      const imageBase64 = `data:image/png;base64,${data.img_cat}`;
      setCategoryImage(imageBase64);
    }
  };


  const StartGame = () => {

    navigate('/IndividualGame', {
      state: { id_cat: categoryId },
    });



  };


  useEffect(() => {
    fetchRanking(categoryId);
    fetchCategoryImage(categoryId);
  }, [categoryId]);


  const maxScore = Math.max(...rankings.map(item => item.score));

  const chartData = rankings.map(item => ({
    x: item.score,
    y: item.name,
    isMax: item.score === maxScore,
    id: item.id,
    image: item.image,
    lineColor: COLORS[item.id % COLORS.length]
  }));

  const CustomImageComponent = ({ cx, cy, payload, color }) => {
    const startX = 100;
    const startY = cy;

    return (
      <g>
        <line x1={startX} y1={startY} x2={cx} y2={cy} stroke={color} strokeWidth={2} />
        <Line
          x1={0}
          y1={cy}
          x2={cx}
          y2={cy}
          stroke={payload.lineColor}
          strokeWidth={4}
          style={{ zIndex: -1 }}
        />

        <foreignObject x={cx - 16} y={cy - 16} width={64} height={64}>
          <div className="w-16 h-8  rounded-full border-2 border-cyan-400 overflow-hidden ">
            <img
              src={payload.image}
              alt="card"
              className="w-full h-full object-cover"
            />
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="border-2 border-cyan-400 p-4 rounded-lg w-full mx-auto overflow-y-auto scrollbar-custom max-h-[78vh] ">

      <img src={categoryImage} alt="category image" className='border-2 border-cyan-400 h-32 w-full rounded-t-2xl object-cover ' />

      <div className="w-full bg-cyan-400 h-24 mb-5 flex justify-center text items-center font-bold text-4xl">Ranking category ID: {categoryId}</div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full h-auto border-2 border-cyan-900 rounded-2xl md:w-1/2">
          {rankings.map((item, index) => (
            <div key={item.id} className="flex items-center border border-cyan-400 py-2 mb-4 m-5 rounded-2xl">
              <div className="w-10 text-center">{index + 1}</div>
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
              <div className="ml-4 font-semibold">{item.name}</div>
              <div className="ml-auto mr-2">Score: {item.score}</div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2 h-auto border-2 border-cyan-900 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%">
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
                domain={[0, 10]}
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
        <button className="w-3/4 bg-red-600 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={StartGame}>
          Partida en solitario
        </button>
      </div>
    </div>
  );
};

export default Ranking;