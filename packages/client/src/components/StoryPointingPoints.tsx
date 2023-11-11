export const StoryPointingPoints = ({ points, onVote, userVote }) => {
  if (!points.length) {
    return (<></>);
  }

  return (
    <>
      {points.map(point => (
          <button
            key={point}
            name="point"
            value={point}
            className={userVote === point ? 'active' : ''}
            onClick={() => onVote(point)}
          >
            {point} {point !== '?' ? (`point${['1', '0.5'].includes(point) ? '' : 's'}`) : ''}
          </button>
      ))}
    </>
  );
}