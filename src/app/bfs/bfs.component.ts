// @ts-nocheck
import { Component } from '@angular/core';
import { concatMap, delay, of, Subject, Subscription } from 'rxjs';


export interface Point {
  [index: number]: number;
}

@Component({
  selector: 'app-bfs',
  templateUrl: './bfs.component.html',
  styleUrls: ['./bfs.component.scss']
})
export class BFSComponent {
  mazeValue = [
    [{value: 'S', q: false, v: false}, {value: ' ', q: false, v: false}, {value: ' ', q: false, v: false}, {value: ' ', q: false, v: false},{value: ' ', q: false, v: false}],
    [{value: ' ', q: false, v: false}, {value: '', q: false, v: false}, {value: ' ', q: false, v: false}, {value: ' ', q: false, v: false},{value: ' ', q: false, v: false}],
    [{value: ' ', q: false, v: false}, {value: ' ', q: false, v: false}, {value: 'X', q: false, v: false}, {value: ' ', q: false, v: false},{value: 'X', q: false, v: false}],
    [{value: ' ', q: false, v: false}, {value: 'X', q: false, v: false}, {value: 'F', q: false, v: false}, {value: ' ', q: false, v: false},{value: ' ', q: false, v: false}],
    [{value: 'X', q: false, v: false}, {value: ' ', q: false, v: false}, {value: ' ', q: false, v: false}, {value: ' ', q: false, v: false},{value: ' ', q: false, v: false}],
  ];
  maze = JSON.parse(JSON.stringify(this.mazeValue));

  start: Point = [0, 0];
  target: Point = [3,2];
  speed = 300;

  styleSubject = new Subject<any>();
  subscription: Subscription | null = null;
  distanceText: number | null = null;
  distance: number | null = null;

  run() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.maze = JSON.parse(JSON.stringify(this.mazeValue));
      this.distanceText = null;
      this.distance = null;
    }

    this.subscription = this.styleSubject.pipe(
      concatMap((x) => of(x).pipe(delay(this.speed))),
    )
      .subscribe(([maze, x, y, state]: any) => {
        if (state === 'q') {
          maze[x][y].q = true;
        } else {
          maze[x][y].v = true;
        }

        if (state === 'v' && x === this.target[0] && y == this.target[1]) {
          this.distanceText = this.distance;
        }
      });

    this.distance = this.findShortestPath(this.maze, this.start, this.target);
  }


  findShortestPath(maze: any[], start, target) {
    const queue = [start];
    const visited = new Set([start.toString()]);
    const distances = {[start.toString()]: 0};
    this.styleNode(maze, 0, 0, 'q');
    this.styleNode(maze, 0, 0, 'v');

    while (queue.length > 0) {
      const current = queue.shift();

      this.styleNode(maze, current[0], current[1], 'v');

      if (current[0] === target[0] && current[1] === target[1]) {
        return distances[current.toString()];
      }

      const neighbors = this.getNeighbors(maze, current);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.toString())) {
          visited.add(neighbor.toString());
          distances[neighbor.toString()] = distances[current.toString()] + 1;
          queue.push(neighbor);
        }
      }
    }

    return -1; // No path found
  }


  getNeighbors(maze, cell): any {
    const [row, col] = cell;
    const neighbors = [];

    if (row > 0 && maze[row - 1][col].value !== 'X') {
      neighbors.push([row - 1, col]);
      this.styleNode(maze, row - 1, col, 'q');
    }

    if (row < maze.length - 1 && maze[row + 1][col].value !== 'X') {
      neighbors.push([row + 1, col]);
      this.styleNode(maze, row + 1, col, 'q');
    }

    if (col > 0 && maze[row][col - 1].value !== 'X') {
      neighbors.push([row, col - 1]);
      this.styleNode(maze, row, col - 1, 'q');
    }

    if (col < maze[0].length - 1 && maze[row][col + 1].value !== 'X') {
      neighbors.push([row, col + 1]);
      this.styleNode(maze, row, col + 1, 'q');
    }

    return neighbors;
  }


  styleNode(maze, x, y, state): void {
    this.styleSubject.next([maze, x, y, state]);
  }
}
