const oAthIds = require("./oAuthIds");
const algoliasearch = require("algoliasearch");
const Movie = require("../models/movie");
const mongoose = require("mongoose");

async function connection() {
  await mongoose.connect("mongodb://localhost:27017/hypertube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

const client = algoliasearch(
  oAthIds.algolia.applicationId,
  oAthIds.algolia.adminKey
);
const index = client.initIndex("Hypertube");

const fetchDataFromDatabase = async () => {
  connection();
  const actors = await Movie.find({});
  console.log(actors);
  return actors;
};

async function updateToAlgolia() {
  const records = await fetchDataFromDatabase();
  index
    .saveObjects(records, { autoGenerateObjectIDIfNotExist: true })
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    });
}

updateToAlgolia();
