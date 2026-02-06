import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-detail-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './member-detail-page.component.html',
  styleUrl: './member-detail-page.component.css'
})
export class MemberDetailPageComponent {
  unitSystem: 'Metric' | 'Imperial' = 'Metric';
  weight = 0;
  height = 0;
  heightFeet = 0;
  heightInches = 0;
  glucose = 0;
}