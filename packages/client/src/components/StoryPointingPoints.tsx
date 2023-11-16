import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export const StoryPointingPoints = ({
  points,
  onVote,
  userVote,
}: StoryPointingPointsParams) => {
  if (!points.length) {
    return <></>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        {points.map((point) => (
          <Button
            key={point}
            name="point"
            value={point}
            variant={userVote === point ? "contained" : "outlined"}
            onClick={() => onVote(point)}
            sx={{ width: "150px" }}
          >
            {point}{" "}
            {point !== "?"
              ? `point${["1", "0.5"].includes(point) ? "" : "s"}`
              : ""}
          </Button>
        ))}
      </Box>
    </>
  );
};
