// (world: boolean[][]) => boolean[][]
// implement your state transition logic here
export const next = (world) => {
  const worldClone = JSON.parse(JSON.stringify(world));
  world.forEach((row, rowIdx) =>
    row.forEach((alive, cellIdx) => {
      let neighbourCount = 0;
      // left neighbour ONLY if NOT first cell of row
      if (cellIdx > 0) {
        const leftNeighbour = row[cellIdx - 1];

        if (leftNeighbour) {
          neighbourCount = neighbourCount + 1;
        }
      }
      // right neighbour ONLY if NOT last cell of row
      if (cellIdx < row.length - 1) {
        const rightNeighbour = row[cellIdx + 1];
        if (rightNeighbour) {
          neighbourCount = neighbourCount + 1;
        }
      }

      // top neighbours ONLY if NOT first row
      if (rowIdx > 0) {
        const topArrRow = world[rowIdx - 1];
        const topNeighbour = topArrRow[cellIdx];

        if (topNeighbour) {
          neighbourCount = neighbourCount + 1;
        }
        // TOP - LEFT ONLY if NOT first cell in row
        if (cellIdx > 0) {
          const topLeftNeighbour = topArrRow[cellIdx - 1];
          if (topLeftNeighbour) {
            neighbourCount = neighbourCount + 1;
          }
        }
        // TOP - RIGHT only if not last cell in row
        if (cellIdx < row.length - 1) {
          const topRightNeighbour = topArrRow[cellIdx + 1];
          if (topRightNeighbour) {
            neighbourCount = neighbourCount + 1;
          }
        }
      }
      // bottom neighbours ONLY if NOT last row
      if (rowIdx < world.length - 1) {
        const bottomArrRow = world[rowIdx + 1];
        const bottomNeighbour = bottomArrRow[cellIdx];

        if (bottomNeighbour) {
          neighbourCount = neighbourCount + 1;
        }
        // BOTTOM - LEFT ONLY if NOT first cell in row
        if (cellIdx > 0) {
          const bottomLeftNeighbour = bottomArrRow[cellIdx - 1];
          if (bottomLeftNeighbour) {
            neighbourCount = neighbourCount + 1;
          }
        }
        // BOTTOM - RIGHT only if NOT last cell in row
        if (cellIdx < row.length - 1) {
          const bottomRightNeighbour = bottomArrRow[cellIdx + 1];
          if (bottomRightNeighbour) {
            neighbourCount = neighbourCount + 1;
          }
        }
      }
      // Checking conditions for neightbour count
      if (alive) {
        // FOR a space that is populated
        if (neighbourCount <= 1 || neighbourCount >= 4) {
          // CELL DIES
          worldClone[rowIdx][cellIdx] = false;
        }
      }
      // FOR a space that is empty or unpopulated
      else {
        if (neighbourCount === 3) {
          // CELL SURVIVES
          worldClone[rowIdx][cellIdx] = true;
        }
      }
    })
  );
  return worldClone;
};
// (pattern: string) => boolean[][]
// implement your lexicon parsing logic here
export const parse = (pattern) => {
  const splitPattern = pattern.split("\n");
  let boolPattern = [];

  for (const row of splitPattern) {
    if (row) {
      const cell = Array.from(row).map((i) => (i === "." ? false : true));
      boolPattern = [...boolPattern, cell];
    }
  }

  return boolPattern;
};
