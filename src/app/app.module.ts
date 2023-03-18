import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BFSComponent } from './bfs/bfs.component';
import { DFSComponent } from './dfs/dfs.component';
import { BestFsComponent } from './best-fs/best-fs.component';

@NgModule({
  declarations: [
    AppComponent,
    BFSComponent,
    DFSComponent,
    BestFsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
