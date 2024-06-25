import Loader from "react-js-loader";
export const LoadingBar = () => {
  return (
    <>
<div className="loading-bar-container">
      <Loader type="spinner-cub" bgColor="white" color="black" size={100} />
    </div>
    </>
  );
};