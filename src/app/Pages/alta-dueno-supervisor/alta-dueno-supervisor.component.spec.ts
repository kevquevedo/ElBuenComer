import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaDuenoSupervisorComponent } from './alta-dueno-supervisor.component';

describe('AltaDuenoSupervisorComponent', () => {
  let component: AltaDuenoSupervisorComponent;
  let fixture: ComponentFixture<AltaDuenoSupervisorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaDuenoSupervisorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaDuenoSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
