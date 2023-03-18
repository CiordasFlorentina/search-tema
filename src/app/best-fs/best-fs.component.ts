// @ts-nocheck
import { Component } from '@angular/core';
import { concatMap, delay, of, Subject, Subscription } from 'rxjs';
import { Point } from '../bfs/bfs.component';

@Component({
  selector: 'app-best-fs',
  templateUrl: './best-fs.component.html',
  styleUrls: ['./best-fs.component.scss']
})
export class BestFsComponent {

  // const maze = [
  //   ['S', '.', '.', '.', '.'],
  //   ['.', '.', '.', '.', '.'],
  //   ['.', '.', '#', '.', '#'],
  //   ['.', '#', 'T', '.', '.'],
  //   ['#', '.', '.', '.', '.'],
  // ];

  mazeValue = [
    [{value: 'S', hf: '', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}, {
      value: ' ',
      hf: '',
      q: false,
      v: false
    }, {value: ' ', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}],
    [{value: ' ', hf: '', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}, {
      value: ' ',
      hf: '',
      q: false,
      v: false
    }, {value: ' ', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}],
    [{value: ' ', hf: '', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}, {
      value: 'X',
      hf: '',
      q: false,
      v: false
    }, {value: ' ', q: false, v: false}, {value: 'X', hf: '', q: false, v: false}],
    [{value: ' ', hf: '', q: false, v: false}, {value: 'X', hf: '', q: false, v: false}, {
      value: 'F',
      hf: '',
      q: false,
      v: false
    }, {value: ' ', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}],
    [{value: 'X', hf: '', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}, {
      value: ' ',
      hf: '',
      q: false,
      v: false
    }, {value: ' ', q: false, v: false}, {value: ' ', hf: '', q: false, v: false}],
  ];
  maze = JSON.parse(JSON.stringify(this.mazeValue));

  start: Point = [0, 0];
  target: Point = [3, 2];
  speed = 300;

  styleSubject = new Subject<any>();
  subscription: Subscription | null = null;


  constructor() {
    this.calculateHeuristic(this.maze, this.target);
  }

  calculateHeuristic(maze, end) {
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[0].length; j++) {
        if (maze[i][j].value === 'X') {
          maze[i][j].hf = 0;
        } else {
          maze[i][j].hf = Math.abs(i - end[0]) + Math.abs(j - end[1]);
        }
      }
    }
  }

  run() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.maze = JSON.parse(JSON.stringify(this.mazeValue));
      this.calculateHeuristic(this.maze, this.target);
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

    // Initialize visited set and priority queue
    const visited = new Set();
    const queue = [start];

    while (queue.length) {
      // Sort the queue in ascending order of heuristic value
      queue.sort((a, b) => maze[a[0]][a[1]].hf -  maze[b[0]][b[1]].hf);

      // Select the cell with the lowest heuristic value
      const current = queue.shift();
      const [x, y] = current;

      // Mark the current cell as visited
      visited.add(`${x},${y}`);
      this.styleNode(maze, x, y, 'v');

      // Check if we have reached the goal
      if (maze[x][y].value === 'F') {
        return true;
      }

      // Generate neighbors and add to queue if not visited and not a wall
      const neighbors = this.getNeighbors(maze, current);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.toString())) {
          queue.push(neighbor);
        }
      }
    }

    return -1;

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
