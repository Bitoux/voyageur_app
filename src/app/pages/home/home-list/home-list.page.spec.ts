import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeListPage } from './home-list.page';

describe('HomeListPage', () => {
  let component: HomeListPage;
  let fixture: ComponentFixture<HomeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
