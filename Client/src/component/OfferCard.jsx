import React from "react";

const OfferCard = ({ icon: IconComponent, title, description }) => {
  return (
    <div className="bg-transparent border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
      <div className="flex flex-col items-center text-center space-y-4">
        <IconComponent className="size-10 text-blue-400" />
        <h1 className="text-xl text-white">{title}</h1>
        <p className="text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default OfferCard;
