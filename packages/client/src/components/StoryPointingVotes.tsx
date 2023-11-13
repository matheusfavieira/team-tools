import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

export const StoryPointingVotes = ({ users, meeting }) => {
  const getSectionTitle = () => <h2>Votes:</h2>;

  if (!meeting.users.length) {
    return (
      <>
        {getSectionTitle()}
        <p>
          <i>No users yet</i>
        </p>
      </>
    );
  }

  const rows = meeting.users.map((userId) => {
    const { name } = users[userId];
    let vote = meeting.votes[userId];

    return { name, vote };
  });

  return (
    <>
      {getSectionTitle()}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 150 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="td" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {meeting.showVotes ? (
                    row.vote
                  ) : row.vote ? (
                    <HourglassTopIcon fontSize="12px" />
                  ) : (
                    <></>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
