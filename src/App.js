import React from "react";
import MyMap from "./Components/MyMap/MyMap";

const App = () => {
  // Пример данных для кругов и секторов
  const circles = [
    {
      center: [55.751574, 37.573856], // Координаты центра
      radius: 3000, // Радиус круга в метрах
      sectors: [
        { angleStart: 0, angleEnd: 90, color: "rgba(255, 0, 0, 0.5)" }, // Полупрозрачный красный сектор
        { angleStart: 90, angleEnd: 180, color: "rgba(0, 255, 0, 0.5)" }, // Полупрозрачный зеленый сектор
        { angleStart: 180, angleEnd: 270, color: "rgba(0, 0, 255, 0.5)" }, // Полупрозрачный синий сектор
        { angleStart: 270, angleEnd: 360, color: "rgba(255, 255, 0, 0.5)" }, // Полупрозрачный желтый сектор
      ],
      text: "25", // Текст для центрального кружка
    },
    {
      center: [55.961574, 37.583856], // Другие координаты центра
      radius: 3000, // Другой радиус
      sectors: [
        { angleStart: 0, angleEnd: 120, color: "rgba(255, 100, 100, 0.5)" },
        { angleStart: 120, angleEnd: 240, color: "rgba(100, 255, 100, 0.5)" },
        { angleStart: 240, angleEnd: 360, color: "rgba(100, 100, 255, 0.5)" },
      ],
      text: "50",
    },
    // Добавьте другие круги по необходимости
  ];

  return (
    <div>
      <h1>Api Яндекс-карт</h1>
      <MyMap circles={circles} />
    </div>
  );
};

export default App;
