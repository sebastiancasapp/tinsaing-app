import { FadeLoader } from "react-spinners";

const Loader: React.FC = () => {
  return (
    <div
      style={{
        display: "block",
        margin: "0 auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <FadeLoader
        color="#9f9f9f"
        cssOverride={{}}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
