import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input() paginador: any;
  paginas: number[];
  desde: number;
  hasta: number;
  params: any;
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.initPaginator();
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    let paginadorActualizado = changes['paginador'];

    if (paginadorActualizado != null && paginadorActualizado != undefined)
      if (paginadorActualizado.previousValue)
        this.initPaginator();

  }

  public navigate(page) {    
    let params = {
      page: page + 1
    };
    
    for (const key in this.params) {
      if (key != 'page')
        params[key] = this.params[key];
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: params });
  }

  private initPaginator(): void {
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);

    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }

}
