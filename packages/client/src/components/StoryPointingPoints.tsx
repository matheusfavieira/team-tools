import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

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
      <ButtonGroup aria-label="medium button group">
        {points.map((point) => (
          <Button
            key={point}
            name="point"
            value={point}
            variant={userVote === point ? "contained" : "outlined"}
            onClick={() => onVote(point)}
          >
            {point}{" "}
            {point !== "?"
              ? `point${["1", "0.5"].includes(point) ? "" : "s"}`
              : ""}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
};
