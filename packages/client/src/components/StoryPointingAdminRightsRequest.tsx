import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

export default function StoryPointingAdminRightsRequest({
  userRequestingAdminRights,
  isAdmin,
  onAllowAdminRights,
  onDenyAdminRights,
}: StoryPointingAdminRightsRequestParams) {
  if (!userRequestingAdminRights || !isAdmin) {
    return <></>;
  }

  const onAllow = () => {
    onAllowAdminRights();
  };

  const onDeny = () => {
    onDenyAdminRights();
  };

  const AdminRightsAction = (
    <>
      <Button size="small" aria-label="close" color="inherit" onClick={onAllow}>
        Transfer admin
      </Button>

      <Button size="small" aria-label="close" color="inherit" onClick={onDeny}>
        Deny
      </Button>
    </>
  );

  return (
    <Snackbar
      open={!!userRequestingAdminRights}
      message={`${userRequestingAdminRights.name} is requesting admin rights:`}
      action={AdminRightsAction}
    />
  );
}
