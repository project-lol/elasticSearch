const elasticsearch = require("elasticsearch");
const express = require("express");

const app = express();

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST || "elasticsearch:9200",
  log: "error",
});

function connectWithRetry() {
  client.ping(
    {
      requestTimeout: 30000,
    },
    function (error) {
      if (error) {
        console.error(
          "Elasticsearch에 연결할 수 없습니다. 10초 후 재시도합니다...",
          error
        );
        setTimeout(connectWithRetry, 10000);
      } else {
        console.log("Elasticsearch에 성공적으로 연결되었습니다");
        startServer();
      }
    }
  );
}

function startServer() {
  app.get("/search", function (req, res) {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).send("Search query is missing");
    }

    client
      .search({
        index: "books",
        body: {
          query: {
            multi_match: {
              query: searchQuery,
              fields: ["title^3", "author^2"],
            },
          },
        },
      })
      .then(response => {
        const hits = response.hits.hits;
        const results = hits.map(hit => hit._source);
        res.send(results);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("An error occurred");
      });
  });

  app.listen(3000, function () {
    console.log("서버가 3000 포트에서 실행 중입니다");
  });
}

connectWithRetry();
