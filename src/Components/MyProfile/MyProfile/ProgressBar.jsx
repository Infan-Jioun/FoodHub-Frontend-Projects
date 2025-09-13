const ProgressBar = ({ percentage }) => {
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
        <div 
          className="bg-[#ff1818] dark:bg-red-400 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };
  
  export default ProgressBar;