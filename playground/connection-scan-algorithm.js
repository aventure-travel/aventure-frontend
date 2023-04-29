class Connection {
  constructor(line) {
    const tokens = line.trim().split(" ");

    this.departureStation = parseInt(tokens[0]);
    this.arrivalStation = parseInt(tokens[1]);
    this.departureTimestamp = parseInt(tokens[2]);
    this.arrivalTimestamp = parseInt(tokens[3]);
  }
}

class Timetable {
  constructor(lines) {
    this.connections = [];

    for (let line of lines) {
      this.connections.push(new Connection(line));
    }
  }
}

class CSA {
  constructor(lines) {
    this.timetable = new Timetable(lines);
  }

  mainLoop(arrivalStation) {
    let earliest = Number.MAX_VALUE;

    for (let connection of this.timetable.connections) {
      if (
        connection.departureTimestamp >=
          this.earliestArrival[connection.departureStation] &&
        connection.arrivalTimestamp <
          this.earliestArrival[connection.arrivalStation]
      ) {
        this.earliestArrival[connection.arrivalStation] =
          connection.arrivalTimestamp;
        this.inConnection[connection.arrivalStation] = connection;

        if (connection.arrivalStation === arrivalStation) {
          earliest = Math.min(earliest, connection.arrivalTimestamp);
        }
      } else if (connection.arrivalTimestamp > earliest) {
        return;
      }
    }
  }

  printResult(arrivalStation) {
    if (this.inConnection[arrivalStation] === null) {
      console.log("NO_SOLUTION");

      return;
    }

    const route = [];

    let lastConnection = this.inConnection[arrivalStation];

    while (lastConnection !== null) {
      route.push(lastConnection);
      lastConnection = this.inConnection[lastConnection.departureStation];
    }

    route.reverse();

    for (let connection of route) {
      console.log(
        connection.departureStation +
          " " +
          connection.arrivalStation +
          " " +
          connection.departureTimestamp +
          " " +
          connection.arrivalTimestamp
      );
    }
  }

  compute(departureStation, arrivalStation, departureTimestamp) {
    const MAX_STATIONS = 100000;

    this.inConnection = new Array(MAX_STATIONS);
    this.earliestArrival = new Array(MAX_STATIONS);

    for (let i = 0; i < MAX_STATIONS; ++i) {
      this.inConnection[i] = null;
      this.earliestArrival[i] = Number.MAX_VALUE;
    }

    this.earliestArrival[departureStation] = departureTimestamp;

    if (departureStation <= MAX_STATIONS && arrivalStation <= MAX_STATIONS) {
      this.mainLoop(arrivalStation);
    }

    this.printResult(arrivalStation);
  }

  static main() {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (line) => {
      const tokens = line.trim().split(" ");

      if (tokens.length === 3) {
        const csa = new CSA([
          "1 4 0 10",
          "1 2 5 7",
          "2 4 8 10",
          "2 3 8 10",
          "2 4 10 13",
          "3 4 15 20",
        ]);

        csa.compute(
          parseInt(tokens[0]),
          parseInt(tokens[1]),
          parseInt(tokens[2])
        );
      }
    });

    rl.on("close", () => {
      process.exit(0);
    });
  }
}

CSA.main();
