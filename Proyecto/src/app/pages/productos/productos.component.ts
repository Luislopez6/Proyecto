import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos : any;
  paginador: any;
  page:number;
  searching: boolean;
  params: any;
  buscar: string;
  constructor(private productosService: ProductosService,private router: Router, private activatedRoute: ActivatedRoute){  }

  ngOnInit(): void{

    this.buscar="";
    this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
      
          this.page = +params['page'];
  
          if (!this.page) {
              this.page = 0;
          }

          this.getProductos();
      
    });
    
  }

  search(){
    this.page=0;
    this.getProductos();
  }


  getProductos(){
    
    let queryParams=[];
    if(this.page>0){
      queryParams["page"] = this.page;
    }

    if(this.buscar.length > 0){
      queryParams["search"] = this.buscar;
    }
    
    this.productosService.getProductos(queryParams).subscribe(productos => {
      this.productos = productos.content;
      this.paginador = productos;
    });
  }

}
