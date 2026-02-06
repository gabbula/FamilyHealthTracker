import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  familyMembers = [
    { id: '1', name: 'Alex Rivera', age: 34, gender: 'Male' },
    { id: '2', name: 'Mia Rivera', age: 29, gender: 'Female' }
  ];
}