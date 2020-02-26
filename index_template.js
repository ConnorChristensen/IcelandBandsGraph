const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const width = 680;
const height = 680;

const links = json.links;
const nodes = json.nodes;

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
    .id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-40))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

simulation.nodes(json.nodes).on("tick", ticked);

simulation.force("link").links(json.links);

function ticked() {
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2 + 40);

  context.beginPath();
  json.links.forEach(drawLink);
  context.strokeStyle = "#aaa";
  context.stroke();

  context.beginPath();
  json.nodes.forEach(drawNode);
  context.fill();
  context.strokeStyle = "#fff";
  context.stroke();

  context.restore();
}

function drawLink(d) {
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}

// end old code

// start new code

function drag(simulation) {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

function color(d) {
  return d.type === 'band' ? '#1eeaad' : '#6c1eea';
}

function cirlceStroke(d) {
  if (d.type !== 'artist') return '#fff';

  const instruments = d.instruments;
  if (!instruments || instruments.length === 0) { return '#fff'; }

  switch (instruments[0].toLowerCase()) {
    case 'drums':
      return '#87fc5d';
      break;
    case 'vocals':
      return '#07a2fc';
      break;
    case 'piano':
      return '#fc9607';
      break;
    case 'guitar':
      return '#fc07db';
      break;
    case 'bass':
      return '#83a5fc';
      break;
    default:
      return '#fff';
  }
}

function lineColor(d) {
  if (!d.kind) { return '#999'; }
  return d.kind === 'member' ? "#999" : "#fcaa11"
}

const svg = d3.create("svg").attr("viewBox", [-width / 2, -height / 2, width, height]);
const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke", lineColor)
  .attr("stroke-opacity", 0.6)
  .attr("stroke-width", 2);

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 5)
  .attr("fill", color)
  .attr("stroke", cirlceStroke)
  .attr("stroke-width", 1.5)
  .call(drag(simulation));

node.append("title").text(d => d.name);

node.append("text")
  .attr("dx", 12)
  .attr("dy", ".35em")
  .text(function(d) { return d.name });

simulation.on("tick", () => {
  link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
});

document.getElementById('new').appendChild(svg.node());
