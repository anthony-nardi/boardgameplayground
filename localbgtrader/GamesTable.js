import React, { useState, useMemo, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MuiTable from "./MuiTable";

const styles = (theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  table: {
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
    },
  },
  tableRow: {
    cursor: "pointer",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#ccc",
    },
  },
});

const VirtualizedTable = withStyles(styles)(MuiTable);

export default function GamesTable({ tableData, matches }) {
  const [sortOrder, setSortOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState("gameTitleAsLink");
  const [searchText, setSearchText] = useState("");

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSort = ({ sortBy, sortDirection }) => {
    setSortBy(sortBy);
    setSortOrder(sortDirection);
  };

  const formattedData = useMemo(() => {
    if (!tableData) {
      return null;
    }

    let data = tableData
      .map((values, gameTitle) => {
        const sortedUserNamesArray = values
          .map((value) => value.get("user_name"))
          .sort();

        const sortedUserNamesString = sortedUserNamesArray.join(", ");
        const userNamesAsLinks = sortedUserNamesArray
          .map((value) => {
            const linkToUsersProfilePage = `https://boardgamegeek.com/user/${value}`;
            return `<a target="_blank" href="${linkToUsersProfilePage}">${value}</a>`;
          })
          .join(",");

        const gameTitleAsLink = `<a target="_blank" href="https://boardgamegeek.com/boardgame/${values
          .first()
          .get("objectid")}">${gameTitle}</a>`;

        return {
          gameTitle,
          gameTitleAsLink,
          userNamesAsLinks,
          sortedUserNamesString,
        };
      })
      .filter(({ gameTitle, sortedUserNamesString }) => {
        const text = searchText.toLowerCase();
        if (text.length) {
          return (
            sortedUserNamesString.toLowerCase().indexOf(text) > -1 ||
            gameTitle.toLowerCase().indexOf(text) > -1
          );
        }
        return true;
      })
      .valueSeq()
      .sortBy(({ gameTitle, sortedUserNamesString }) => {
        if (sortBy === "gameTitleAsLink") {
          return gameTitle.toLowerCase();
        } else {
          return sortedUserNamesString.toLowerCase();
        }
      });

    if (sortOrder === "DESC") {
      data = data.reverse();
    }

    return data;
  }, [tableData, sortOrder, sortBy, searchText]);

  const formattedMatchedData = useMemo(() => {
    if (!matches) {
      return null;
    }

    let data = matches
      .map((values, gameTitle) => {
        const sortedUserNamesArray = values
          .map((value) => value.get("user_name"))
          .sort();
        const sortedUserNamesString = sortedUserNamesArray.join(", ");
        const userNamesAsLinks = sortedUserNamesArray
          .map((value) => {
            const linkToUsersProfilePage = `https://boardgamegeek.com/user/${value}`;
            return `<a target="_blank" href="${linkToUsersProfilePage}">${value}</a>`;
          })
          .join(",");

        const gameTitleAsLink = `<a target="_blank" href="https://boardgamegeek.com/boardgame/${values
          .first()
          .get("objectid")}">${gameTitle}</a>`;

        return {
          gameTitle,
          gameTitleAsLink,
          userNamesAsLinks,
          sortedUserNamesString,
        };
      })
      .filter(({ gameTitle, sortedUserNamesString }) => {
        const text = searchText.toLowerCase();
        if (text.length) {
          return (
            sortedUserNamesString.toLowerCase().indexOf(text) > -1 ||
            gameTitle.toLowerCase().indexOf(text) > -1
          );
        }
        return true;
      })
      .valueSeq()
      .sortBy(({ gameTitle, sortedUserNamesString }) => {
        if (sortBy === "gameTitleAsLink") {
          return gameTitle.toLowerCase();
        } else {
          return sortedUserNamesString.toLowerCase();
        }
      });

    if (sortOrder === "DESC") {
      data = data.reverse();
    }

    return data;
  }, [matches, sortOrder, sortBy, searchText]);

  if (!formattedData || !formattedMatchedData) {
    return null;
  }

  const formContainerHeight =
    document.getElementById("formContainer").clientHeight;

  const rowsToRender = formattedMatchedData.concat(formattedData);

  const tableHeight = window.innerHeight - formContainerHeight - 128;
  return (
    <div>
      <div style={{ paddingBottom: "8px" }}>
        <Input
          inputProps={{
            name: "searchText",
          }}
          onChange={handleChange}
          placeholder="Search"
          value={searchText}
        />
      </div>
      <Paper style={{ height: Math.max(tableHeight, 400), width: "100%" }}>
        <VirtualizedTable
          sort={handleSort}
          sortBy={sortBy}
          sortDirection={sortOrder}
          rowCount={rowsToRender.size}
          matchedRowsCount={formattedMatchedData.size}
          rowGetter={({ index }) => rowsToRender.get(index)}
          columns={[
            {
              width: window.document.body.clientWidth / 2 - 16,
              label: "Games",
              dataKey: "gameTitleAsLink",
            },
            {
              width: window.document.body.clientWidth / 2 - 16,
              label: "Users",
              dataKey: "userNamesAsLinks",
            },
          ]}
        />
      </Paper>
    </div>
  );
}
