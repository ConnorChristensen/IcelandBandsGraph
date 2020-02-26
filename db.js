require('dotenv').config()
const Airtable = require('airtable');
var fs = require("fs");

class Table {
  constructor(name) {
    this.name = name;
    this.base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
      .base(process.env.AIRTABLE_ID);
    this.view = "Grid view";
  }

  async getAll() {
    const recordsObject = {};
    const records = await this.base(this.name)
      .select({ view: this.view })
      .firstPage();
    records.forEach((record) => recordsObject[record._rawJson.id] = { id: record._rawJson.id, ...record._rawJson.fields });
    return recordsObject;
  }

  async find(id) {
    return this.base(this.name).find(id);
  }
}

const tables = ['bands', 'artists', 'producers', 'albums', 'songs', 'collaborations'];
const data = {};

// Write to files
// (async function(){
//   for (let table of tables) {
//     const ResultTable = new Table(table);
//     const results = await ResultTable.getAll();
//     const writeStream = fs.createWriteStream(table + '.json');
//     writeStream.write(JSON.stringify(results));
//     writeStream.end();
//   }
// })()

(async function(){
  const BandsTable = new Table('bands');
  const bands = await BandsTable.getAll();
  data.bands = bands;

  const ArtistsTable = new Table('artists');
  const artists = await ArtistsTable.getAll();
  data.artists = artists;
  
  const CollaboratorsTable = new Table('collaborations');
  const collaborations = await CollaboratorsTable.getAll();
  data.collaborations = collaborations;

  for (let x in bands) {
    for (let y = 0; y < data.bands[x].artists.length; y++) {
      data.bands[x].artists[y] = data.artists[data.bands[x].artists[y]];
    }
  }
  
  const nodes = [];
  const links = [];
  
  // add collbaorations
  for (let x in collaborations) {
    links.push({ 
      source: collaborations[x].band[0],
      target: collaborations[x].artist[0],
      kind: 'collbaoration',
    })
  }  
  
  for (let x in bands) {
    const bandName = bands[x].name;
    const bandID = bands[x].id;
    nodes.push({ id: bands[x].id, name: bandName, type: 'band' });

    for (let artist of bands[x].artists) {
      // if we have not already added this artist

      if (!nodes.find(e => e.id === artist.id)) {
        const artistInfo = { id: artist.id, name: artist.name, type: 'artist', instruments: artist.instruments }
        nodes.push(artistInfo);
      }
      links.push({ source: artist.id, target: bandID, kind: 'member' });
    }
  }
  console.log(JSON.stringify({nodes, links}));
})()
