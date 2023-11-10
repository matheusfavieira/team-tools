export const StoryPointingAdminControllers = ({ onToggleResults, onReset, showVotes }) => {
  return (
    <>
      <button type="button" onClick={() => onToggleResults()}>
        {showVotes ? 'Hide Votes' : 'Show Votes'}
      </button>

      <button type="button" onClick={() => onReset()}>
        Reset
      </button>
    </>
  );
}