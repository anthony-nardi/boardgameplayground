import React from "react";
import Form from "../localbgtrader/Form";
import GamesTable from "../localbgtrader/GamesTable";
import Loader from "../localbgtrader/Loader";
import { fromJS, Map } from "immutable";

function getJSON(response) {
  return response.json();
}

function getRows(data) {
  return data.reduce((map, item) => {
    if (map[item.name]) {
      map[item.name].push(item);
    } else {
      map[item.name] = [item];
    }
    return map;
  }, {});
}

class Page extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      country: "US",
      zipcode: null,
      radius: "5",
      username: null,
      lastLogin: "All time",
      type: null,
      tableData: null,
      isLoading: false,
      loadingData: {},
      nonResultsMessage: null,
      userCollection: null,
      userWanting: [],
      userTrading: [],
      matches: Map(),
    };
  }

  getUrlFromState = () => {
    const { country, zipcode, radius, lastLogin, type } = this.state;

    const path = type === "sellers" ? "getSellers" : "getBuyers";

    return `/${path}?country=${country}&zip=${zipcode}&radius=${radius}&last_login=${lastLogin}`;
  };

  getCollectionByUserName = () => {
    return fetch(`/collectionByUserName?user_name=${this.state.username}`)
      .then(getJSON)
      .then(({ collection, statusCode }) => {
        if (statusCode === 202) {
          this.setState({
            nonResultsMessage: `Unable to load collection for ${this.state.username} due to too many attempts. Try again later.`,
          });
        }

        const userWanting = [];
        const userTrading = [];

        collection.forEach((item) => {
          if (item.want === "1") {
            userWanting.push(item.name);
          }
          if (item.trade === "1") {
            userTrading.push(item.name);
          }
        });

        console.log(
          `Total wants: ${userWanting.length}. Total trading: ${userTrading.length}`
        );

        this.setState({ userCollection: collection, userWanting, userTrading });
      })
      .catch((e) => {
        console.error(e);
        if (e.message) {
          this.setState({ nonResultsMessage: e.message });
        }
      });
  };

  getBuyers = () => {
    const url = this.getUrlFromState();

    return fetch(url)
      .then(getJSON)
      .then((json) => {
        this.getParsedJSON(json, this.getBuyers);
      })
      .catch((e) => {
        console.error(e);
        if (e.message) {
          this.setState({ nonResultsMessage: e.message });
        }
      });
  };

  getParsedJSON = (response, refetch) => {
    response.message = response.message || "";

    const shouldContinuePolling =
      response.continuePolling === true &&
      response.message.indexOf("Found 0 users") === -1;

    if (shouldContinuePolling) {
      this.setState({ loadingData: response });
      setTimeout(refetch, 250);
      return;
    }

    if (response.message && !response.data) {
      this.setState({
        nonResultsMessage: response.message,
        isLoading: false,
        loadingData: {},
      });
      return;
    }

    const tableData = getRows(response.data);

    this.setState(
      {
        tableData: fromJS(tableData),
        nonResultsMessage: null,
        isLoading: false,
        loadingData: {},
      },
      () => {
        this.getMatches();
      }
    );
  };

  getSellers = () => {
    const url = this.getUrlFromState();

    return fetch(url)
      .then(getJSON)
      .then((json) => {
        this.getParsedJSON(json, this.getSellers);
      })
      .catch((e) => {
        if (e.message) {
          this.setState({ nonResultsMessage: e.message });
        }
        console.error(e);
      });
  };

  getMatches = () => {
    let matches = Map();

    const { tableData, userWanting, userTrading } = this.state;

    if (!tableData || !tableData.size) {
      return;
    }

    userWanting.map((wantedItem) => {
      let matchingWantedItem = tableData.get(wantedItem);
      if (matchingWantedItem) {
        let itemsForTrade = matchingWantedItem.filter(
          (item) => item.get("trade") === "1"
        );
        if (itemsForTrade.size) {
          itemsForTrade = itemsForTrade.set("isMatch", true);
          matches = matches.set(wantedItem, itemsForTrade);
        }
      }
    });

    userTrading.map((itemForTrade) => {
      let matchingTradingItem = tableData.get(itemForTrade);
      if (matchingTradingItem) {
        let itemsWanted = matchingTradingItem.filter(
          (item) => item.get("want") === "1"
        );
        if (itemsWanted.size) {
          matchingTradingItem = itemsWanted.set("isMatch", true);
          matches = matches.set(itemForTrade, itemsWanted);
        }
      }
    });
    this.setState({ matches });
  };

  handleSubmitForm = (data) => {
    this.setState({
      isLoading: true,
      tableData: null,
      loadingData: {},
      nonResultsMessage: null,
    });

    this.setState(data, () => {
      const promises = [];

      if (data.username) {
        promises.push(this.getCollectionByUserName());
      }

      if (data.type === "sellers") {
        promises.push(this.getSellers());
      } else {
        promises.push(this.getBuyers());
      }

      Promise.all(promises).then(() => {
        this.getMatches();
      });
    });
  };

  render() {
    return (
      <div style={{ padding: "16px" }}>
        Please send me a geekmail message to anthonygt if you encounter bugs or
        have some thoughts. Thanks!
        <div id="formContainer">
          <h1>Find games in your area</h1>
          <Form
            onSubmit={this.handleSubmitForm}
            isLoading={this.state.isLoading}
          />
        </div>
        <div style={{ marginTop: "32px" }}>
          <GamesTable
            tableData={this.state.tableData}
            matches={this.state.matches}
          />
        </div>
        <Loader
          isLoading={this.state.isLoading}
          message={this.state.loadingData.message}
          completed={this.state.loadingData.completed}
          totalCollections={this.state.loadingData.totalCollections}
        />
        {this.state.nonResultsMessage}
      </div>
    );
  }
}

export default Page;
