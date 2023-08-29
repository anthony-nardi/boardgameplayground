import LinearProgress from "@material-ui/core/LinearProgress";

const normalise = (value, min, max) => ((value - min) * 100) / (max - min);

export default function Loader({
  message,
  isLoading,
  completed,
  totalCollections,
}) {
  if (!isLoading) {
    return null;
  }
  if (totalCollections) {
    const progress = Math.round((completed / totalCollections) * 100);
    return (
      <div style={{ width: "100%" }}>
        <h4>{message}</h4>
        <LinearProgress
          color="secondary"
          variant="determinate"
          value={progress}
        />
      </div>
    );
  }

  return (
    <div>
      <h4>{message}</h4>
      <div className="loader" />
    </div>
  );
}
