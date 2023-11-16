import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";

export default function StoryPointingSettings({
  onRequestAdminRights,
  isAdmin,
}: StoryPointingSettingsParams) {
  const actions = [
    {
      icon: <FileCopyIcon />,
      name: "Copy url",
      onClick: () => onCopyUrl(),
      show: true,
    },
    {
      icon: <LockPersonIcon />,
      name: "Request admin",
      onClick: () => onRequestAdminRights(),
      show: !isAdmin,
    },
  ];

  const onCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions
          .filter((action) => action.show)
          .map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
      </SpeedDial>
    </Box>
  );
}
