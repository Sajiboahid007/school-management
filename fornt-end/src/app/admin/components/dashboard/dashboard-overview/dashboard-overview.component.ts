import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: false,
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss'
})
export class DashboardOverviewComponent implements OnInit {
  currentUser: any = null;
  userRole: string = 'Super-Admin';
  isLoadingStats: boolean = true;

  stats = {
    totalStudents: 0,
    totalTeachers: 0,
    todayAbsents: 0,
    feeCollected: 0,
    totalDEO: 0
  };

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.userRole = this.currentUser?.Role?.Name || localStorage.getItem('userType') || 'Super-Admin';
      } catch (e) {
        this.currentUser = { Name: 'Administrator', Email: 'admin@school.com' };
      }
    } else {
      this.currentUser = { Name: 'Super Admin', Email: 'superadmin@school.com' };
    }

    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoadingStats = true;

    // 1. Students Count
    this.apiService.get<any>('student/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.stats.totalStudents = res.data.length;
        }
      },
      error: () => (this.stats.totalStudents = 0),
    });

    // 2. Teachers Count
    this.apiService.get<any>('teacher/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.stats.totalTeachers = res.data.length;
        }
      },
      error: () => (this.stats.totalTeachers = 0),
    });

    // 3. Absents Count
    this.apiService.get<any>('attendance/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          const absents = res.data.filter(
            (a: any) =>
              String(a.Status).toLowerCase() === 'absent' ||
              String(a.Status).toLowerCase() === 'a'
          );
          this.stats.todayAbsents = absents.length;
        }
      },
      error: () => (this.stats.todayAbsents = 0),
    });

    // 4. Fee Collection
    this.apiService.get<any>('feeManagement/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          const totalPaid = res.data.reduce(
            (sum: number, fee: any) => sum + Number(fee.PaidAmount || 0),
            0
          );
          this.stats.feeCollected = totalPaid;
        }
      },
      error: () => (this.stats.feeCollected = 0),
    });

    // 5. DEO / Users Count
    this.apiService.get<any>('user/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.stats.totalDEO = res.data.length;
        }
        this.isLoadingStats = false;
      },
      error: () => {
        this.stats.totalDEO = 0;
        this.isLoadingStats = false;
      },
    });
  }
}
