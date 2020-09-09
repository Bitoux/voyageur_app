import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateLocationPage } from './create-location.page';

describe('CreateLocationPage', () => {
  let component: CreateLocationPage;
  let fixture: ComponentFixture<CreateLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
