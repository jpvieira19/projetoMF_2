import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndGetProjectComponent } from './create-and-get-project.component';

describe('ProjetosComponent', () => {
  let component: CreateAndGetProjectComponent;
  let fixture: ComponentFixture<CreateAndGetProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAndGetProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAndGetProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
