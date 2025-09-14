import React from 'react';
import FuzzyText from './FuzzyText';

const ErrorElement = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ff1818] ">
            <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.5} 
                enableHover={true}   
            >
                404
            </FuzzyText>
        </div>
    );
};

export default ErrorElement;
