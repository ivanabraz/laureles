import React, { useState, useEffect, useMemo } from "react";

const ANIMALS = [
  {
    name: "perrito",
    frames: [
      `${process.env.PUBLIC_URL}/images/loading/perrito-01.svg`,
      `${process.env.PUBLIC_URL}/images/loading/perrito-02.svg`,
    ],
  },
  {
    name: "gatito",
    frames: [
      `${process.env.PUBLIC_URL}/images/loading/gatito-01.svg`,
      `${process.env.PUBLIC_URL}/images/loading/gatito-02.svg`,
    ],
  },
  {
    name: "salchicha",
    frames: [
      `${process.env.PUBLIC_URL}/images/loading/salchicha-01.svg`,
      `${process.env.PUBLIC_URL}/images/loading/salchicha-02.svg`,
    ],
  },
];

const Loading = () => {
  const animal = useMemo(
    () => ANIMALS[Math.floor(Math.random() * ANIMALS.length)],
    []
  );
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev === 0 ? 1 : 0));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <img
        src={animal.frames[frameIndex]}
        alt={`Animación ${animal.name} corriendo`}
        className="h-16"
      />
    </div>
  );
};

export default Loading;
