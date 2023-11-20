import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { EncuestaService } from 'src/app/services/encuesta.service';


@Component({
  selector: 'app-graficos-encuestas',
  templateUrl: './graficos-encuestas.component.html',
  styleUrls: ['./graficos-encuestas.component.scss'],
})
export class GraficosEncuestasComponent  implements OnInit {

  spin!: boolean;
  encuestas! : any;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['1','2','3','4','5','6','7','8','9','10'],
    datasets: [{ data: [ 0 ,0 ,0 ,0 ,0 ,0 ,0, 0, 0, 0],label: 'Puntajes', fill: true, tension: 0.5, borderColor: 'black', backgroundColor: 'rgba(255,0,0,0.3)'}]
  };
  public lineChartOptions: ChartOptions<'line'> = {responsive: false};
  public lineChartLegend = true;

  public pieChartOptions: ChartOptions<'pie'> = { responsive: false,};
  public pieChartLabels = [ [ 'Buena' ], [ 'Regular' ],  [ 'Mala' ] ];
  public pieChartDatasets = [ { data: [ 0, 0, 0 ]} ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {responsive: false,};
  public radarChartLabels: string[] = ['Ninguna', 'Lento', 'Hostil', 'Torpe', 'Grosero'];
  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [{ data: [0, 0, 0, 0, 0], label: 'Quejas'}];

  constructor(
    private encuestasService: EncuestaService
  ) {
    this.spin = true;
    this.encuestas = [];
  }

  ngOnInit() {
    this.encuestasService.obtenerEncuestasClientes().then((data)=>{
      this.encuestas = data;
      console.log(this.encuestas)
      this.lineChartEncuestaPuntaje();
      this.baseChartInconvenientes();
      this.radarChartQuejas();
    });
    setTimeout(() => {
      this.spin = false;
    }, 2000);
  }

  lineChartEncuestaPuntaje(){
    this.encuestas.forEach( (item:any) => {
      switch(item.puntaje){
        case 1:
          this.lineChartData.datasets[0].data[0] = this.lineChartData.datasets[0].data[0] as number + 1;
          break;
        case 2:
          this.lineChartData.datasets[0].data[1] = this.lineChartData.datasets[0].data[1] as number  + 1;
          break;
        case 3:
          this.lineChartData.datasets[0].data[2] = this.lineChartData.datasets[0].data[2] as number  + 1;
          break;
        case 4:
          this.lineChartData.datasets[0].data[3] = this.lineChartData.datasets[0].data[3] as number  + 1;
          break;
        case 5:
          this.lineChartData.datasets[0].data[4] = this.lineChartData.datasets[0].data[4] as number  + 1;
          break;
        case 6:
          this.lineChartData.datasets[0].data[5] = this.lineChartData.datasets[0].data[5] as number  + 1;
          break;
        case 7:
          this.lineChartData.datasets[0].data[6] = this.lineChartData.datasets[0].data[6] as number  + 1;
          break;
        case 8:
          this.lineChartData.datasets[0].data[7] = this.lineChartData.datasets[0].data[7] as number  + 1;
          break;
        case 9:
          this.lineChartData.datasets[0].data[8] = this.lineChartData.datasets[0].data[8] as number  + 1;
          break;
        case 10:
          this.lineChartData.datasets[0].data[9] = this.lineChartData.datasets[0].data[9] as number  + 1;
          break;
      }
    });
  }

  baseChartInconvenientes(){
    this.encuestas.forEach( (item:any) => {
      switch(item.inconvenientes){
        case 'ninguno':
          this.pieChartDatasets[0].data[0] = this.pieChartDatasets[0].data[0] + 1;
          break;
        case 'algunos':
          this.pieChartDatasets[0].data[1] = this.pieChartDatasets[0].data[1] + 1;
          break;
        case 'muchos':
          this.pieChartDatasets[0].data[2] = this.pieChartDatasets[0].data[2] + 1;
          break;
      }
    })
  }

  radarChartQuejas(){
    this.encuestas.forEach( (item:any) => {
      switch(item.quejas){
        case "0":
          this.radarChartDatasets[0].data[0] = this.radarChartDatasets[0].data[0] as number + 1;
          break;
        case "1":
          this.pieChartDatasets[0].data[1] = this.radarChartDatasets[0].data[1] as number + 1;
          break;
        case "2":
          this.radarChartDatasets[0].data[2] = this.radarChartDatasets[0].data[2] as number + 1;
          break;
        case "3":
          this.radarChartDatasets[0].data[3] = this.radarChartDatasets[0].data[3] as number + 1;
          break;
        case "4":
          this.radarChartDatasets[0].data[4] = this.radarChartDatasets[0].data[4] as number + 1;
          break;
      }
    })
  }
}

