// @ts-nocheck
import { Component } from '@angular/core';
import { concatMap, delay, of, Subject, Subscription } from 'rxjs';
import { Point } from '../bfs/bfs.component';

@Component({
  selector: 'app-dfs',
  templateUrl: './dfs.component.html',
  styleUrls: ['./dfs.component.scss']
})
export class DFSComponent {
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
      this.distanceText = null;
      this.distance = null;
      this.maze = JSON.parse(JSON.stringify(this.mazeValue));
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
        if (x === this.target[0] && y == this.target[1]) {
          this.distanceText = this.distance;
        }
      });


    this.distance = this.findShortestPathDFS(this.maze, this.start, this.target);
  }


  findShortestPathDFS(maze, start, target) {
    const visited = new Set();
    let foundPath = false;


    const dfs = (current) => {
      this.styleNode(maze, current[0], current[1], 'v');
      if (current[0] === target[0] && current[1] === target[1]) {
        foundPath = true
        return true;
      }

      visited.add(current.toString());
      const neighbors = this.getNeighbors(maze, current);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.toString()) && !foundPath) {
          dfs(neighbor)
        }
      }

      visited.delete(current.toString());
    }

    dfs(start);

    return foundPath;
  }


  getNeighbors(maze, cell): any {
    const [row, col] = cell;
    const neighbors = [];

    if (row > 0 && maze[row - 1][col].value !== 'X') {
      neighbors.push([row - 1, col]);
    }

    if (row < maze.length - 1 && maze[row + 1][col].value !== 'X') {
      neighbors.push([row + 1, col]);
    }

    if (col > 0 && maze[row][col - 1].value !== 'X') {
      neighbors.push([row, col - 1]);
    }

    if (col < maze[0].length - 1 && maze[row][col + 1].value !== 'X') {
      neighbors.push([row, col + 1]);
    }

    return neighbors;
  }


  styleNode(maze, x, y, state): void {
    this.styleSubject.next([maze, x, y, state]);
  }


}
