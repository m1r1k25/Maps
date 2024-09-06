import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const MyMap = ({ circles }) => {
  const mapRef = useRef(null);
  const mapInitialized = useRef(false);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const loadMap = () => {
      if (window.ymaps && mapRef.current && !mapInitialized.current) {
        const ymaps = window.ymaps;
        ymaps.ready(() => {
          const map = new ymaps.Map(mapRef.current, {
            center: [55.751574, 37.573856], // Координаты центра карты
            zoom: 10, // Уровень масштабирования
          });

          // Функция для вычисления координат секторов
          const getSectorCoords = (center, radius, angleStart, angleEnd) => {
            const coords = [];
            const steps = 10; // Количество шагов для сглаживания сектора
            for (let i = 0; i <= steps; i++) {
              const angle = angleStart + ((angleEnd - angleStart) / steps) * i;
              const rad = angle * Math.PI / 180;
              const lat = center[0] + (radius / 111320) * Math.sin(rad);
              const lon = center[1] + (radius / (40008000 * Math.cos(center[0] * Math.PI / 180) / 360)) * Math.cos(rad);
              coords.push([lat, lon]);
            }
            coords.push(center); // Закрываем сектор
            return coords;
          };

          // Добавление динамических кругов и секторов
          circles.forEach((circle) => {
            // Добавление секторов
            circle.sectors.forEach((sector) => {
              const polygonCoords = getSectorCoords(
                circle.center,
                circle.radius,
                sector.angleStart,
                sector.angleEnd
              );
              const polygon = new ymaps.Polygon([polygonCoords], {}, {
                fillColor: sector.color, // Цвет заливки
                strokeColor: '#000000', // Цвет границы
                strokeWidth: 2, // Толщина границы
              });

              map.geoObjects.add(polygon);
            });

            // Центральный кружок
            const centralCircle = new ymaps.Circle([
              circle.center,
              circle.radius / 5 // Радиус маленького центрального кружка
            ], {}, {
              fillColor: '#FFFFFF', // Цвет заливки
              strokeColor: '#000000', // Цвет границы
              strokeWidth: 2, // Толщина границы
            });

            map.geoObjects.add(centralCircle);

            // Создание SVG с текстом для центра кружка
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                <circle cx="25" cy="25" r="20" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
                <text x="50%" y="50%" font-size="20" text-anchor="middle" dy=".3em" fill="#000000">${circle.text}</text>
              </svg>`;
            
            // Добавление текста в центр кружка
            const text = new ymaps.Placemark(circle.center, {}, {
              iconLayout: 'default#imageWithContent',
              iconImageHref: `data:image/svg+xml;base64,${window.btoa(svg)}`,
              iconImageSize: [50, 50],
              iconImageOffset: [-25, -25]
            });

            map.geoObjects.add(text);
          });

          mapInitialized.current = true;
        });
      }
    };

    if (!window.ymaps) {
      // Проверяем, нет ли уже скрипта на странице
      const existingScript = document.querySelector('script[src^="https://api-maps.yandex.ru"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=4c7a5c01-1328-40ba-b78c-a524dd5f8e07`;
        script.onload = loadMap;
        document.body.appendChild(script);
      } else {
        // Скрипт уже загружен, сразу вызываем инициализацию карты
        loadMap();
      }
    } else {
      loadMap();
    }
  }, [circles]);

  return (
    <div style={{ position: 'relative', width: '700px', height: '700px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <select
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000 // Убедитесь, что селект находится поверх карты
        }}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="">Выберите значение</option>
        <option value="option1">Значение 1</option>
        <option value="option2">Значение 2</option>
        <option value="option3">Значение 3</option>
        {/* Добавьте другие опции по необходимости */}
      </select>
    </div>
  );
};

MyMap.propTypes = {
  circles: PropTypes.arrayOf(
    PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number).isRequired,
      radius: PropTypes.number.isRequired,
      sectors: PropTypes.arrayOf(
        PropTypes.shape({
          angleStart: PropTypes.number.isRequired,
          angleEnd: PropTypes.number.isRequired,
          color: PropTypes.string.isRequired, // Цвет заливки в формате '#RRGGBB' или 'rgba(...)'
        })
      ).isRequired,
      text: PropTypes.string.isRequired, // Текст для центрального кружка
    })
  ).isRequired,
};

export default MyMap;
