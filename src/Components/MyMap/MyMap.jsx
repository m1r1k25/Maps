import React, { useEffect, useRef, useState } from 'react';

const MyMap = ({ points }) => {
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

          // Создание кластеризатора
          const clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
          });

          // Кастомный макет для маркеров
          const customIconLayout = ymaps.templateLayoutFactory.createClass(
            `<div style="color: white; background: blue; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;">
              <span>{{ properties.balloonContent }}</span>
            </div>`
          );

          // Создание меток с кастомным содержимым
          const placemarks = points.map(point => new ymaps.Placemark(
            point.coords,
            { balloonContent: point.text || 'Место' }, // Текст для отображения в балуне и метке
            {
              iconLayout: 'default#imageWithContent',
              iconContentLayout: customIconLayout, // Подключаем кастомный макет
              iconImageSize: [40, 40], // Размер кастомной метки
              iconImageOffset: [-20, -20], // Сдвиг для правильного позиционирования
            }
          ));

          // Добавляем метки в кластеризатор
          clusterer.add(placemarks);
          map.geoObjects.add(clusterer);

          mapInitialized.current = true;
        });
      }
    };

    if (!window.ymaps) {
      const existingScript = document.querySelector('script[src^="https://api-maps.yandex.ru"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=4c7a5c01-1328-40ba-b78c-a524dd5f8e07`;
        script.onload = loadMap;
        document.body.appendChild(script);
      } else {
        loadMap();
      }
    } else {
      loadMap();
    }
  }, [points]);

  return (
    <div style={{ position: 'relative', width: '700px', height: '700px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <select
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000
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

export default MyMap;
