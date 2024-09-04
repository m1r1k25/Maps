import React, { useEffect, useRef } from 'react';

const MyMap = () => {
  const mapRef = useRef(null);
  const mapInitialized = useRef(false); // Используем для контроля инициализации карты

  useEffect(() => {
    const loadMap = () => {
      if (window.ymaps && mapRef.current && !mapInitialized.current) {
        const ymaps = window.ymaps;
        ymaps.ready(() => {
          const map = new ymaps.Map(mapRef.current, {
            center: [55.751574, 37.573856], // Координаты центра карты
            zoom: 9, // Уровень масштабирования
          });
  
          // Добавление метки
          const placemark = new ymaps.Placemark([55.751574, 37.573856], {
            balloonContent: 'Москва',
          });
  
          map.geoObjects.add(placemark);
          mapInitialized.current = true; // Отметим, что карта была инициализирована
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
  }, []);  

  return <div ref={mapRef} style={{ width: '700px', height: '700px' }} />;
};

export default MyMap;
