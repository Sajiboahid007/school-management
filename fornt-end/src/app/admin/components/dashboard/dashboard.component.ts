import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';

export interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
}

export interface MenuGroup {
  groupId: string;
  label: string | null;
  icon?: string;
  collapsible?: boolean;
  roles: string[];
  items: MenuItem[];
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  userRole: string = 'Super-Admin';
  isSidebarMobileOpen: boolean = false;
  collapsedGroups: { [groupId: string]: boolean } = {};
  isLoadingStats: boolean = true;

  menuGroups: MenuGroup[] = [
    // 1. Dashboard — always flat, always visible
    {
      groupId: 'main',
      label: null,
      roles: ['Student', 'Teacher', 'Admin', 'Super-Admin', 'Super Admin', 'Staff', 'Reviewer'],
      items: [
        {
          label: 'Dashboard',
          route: '/admin/dashboard',
          icon: 'home',
          roles: ['Student', 'Teacher', 'Admin', 'Super-Admin', 'Super Admin', 'Staff', 'Reviewer'],
        },
      ],
    },

    // 2. Administration — collapsible, Admin / Super-Admin only
    {
      groupId: 'Administration',
      label: 'Administration',
      icon: 'cog',
      collapsible: true,
      roles: ['Admin', 'Super-Admin', 'Super Admin', 'Reviewer'],
      items: [
        {
          label: 'Users',
          route: '/admin/dashboard/user',
          icon: 'users',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Role',
          route: '/admin/dashboard/role',
          icon: 'shield',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Student',
          route: '/admin/dashboard/student',
          icon: 'UserGroupIcon',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Teacher',
          route: '/admin/dashboard/teacher',
          icon: 'briefcase',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Department',
          route: '/admin/dashboard/department',
          icon: 'sitemap',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Class',
          route: '/admin/dashboard/class',
          icon: 'building',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Subject',
          route: '/admin/dashboard/subject',
          icon: 'book',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Batch',
          route: '/admin/dashboard/batch',
          icon: 'box',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Category',
          route: '/admin/dashboard/categories',
          icon: 'bookmark',
          roles: ['Admin', 'Super-Admin', 'Super Admin'],
        },
      ],
    },

    // 3. Academics Management — Teachers & Admins
    {
      groupId: 'Academics',
      label: 'Academics',
      icon: 'academic-cap',
      collapsible: true,
      roles: ['Teacher', 'Admin', 'Super-Admin', 'Super Admin', 'Student'],
      items: [
        {
          label: 'Classes & Subjects',
          route: '/admin/dashboard/classes',
          icon: 'book-open',
          roles: ['Teacher', 'Admin', 'Super-Admin', 'Super Admin'],
        },
        {
          label: 'Class Schedule',
          route: '/admin/dashboard/schedule',
          icon: 'calendar',
          roles: ['Teacher', 'Admin', 'Super-Admin', 'Super Admin', 'Student'],
        },
        {
          label: 'Exams & Results',
          route: '/admin/dashboard/exams',
          icon: 'clipboard-list',
          roles: ['Teacher', 'Admin', 'Super-Admin', 'Super Admin', 'Student'],
        },
        {
          label: 'Attendance Tracking',
          route: '/admin/dashboard/attendance',
          icon: 'user-check',
          roles: ['Teacher', 'Admin', 'Super-Admin', 'Super Admin'],
        },
      ],
    },

    // 4. Finance & Admissions — Admins & DEO / Staff
    {
      groupId: 'Finance',
      label: 'Finance & Admissions',
      icon: 'credit-card',
      collapsible: true,
      roles: ['Admin', 'Super-Admin', 'Super Admin', 'Staff'],
      items: [
        {
          label: 'Fee Management',
          route: '/admin/dashboard/fees',
          icon: 'currency-dollar',
          roles: ['Admin', 'Super-Admin', 'Super Admin', 'Staff'],
        },
        {
          label: 'Student Admissions',
          route: '/admin/dashboard/admissions',
          icon: 'user-add',
          roles: ['Admin', 'Super-Admin', 'Super Admin', 'Staff'],
        },
      ],
    },
  ];

  // Dynamic Dashboard Stats (Fetched directly from API)
  stats = {
    totalStudents: 0,
    totalTeachers: 0,
    todayAbsents: 0,
    feeCollected: 0,
    totalDEO: 0
  };

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService
  ) { }

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

    // 1. Fetch Students Count
    this.apiService.get<any>('student/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.stats.totalStudents = res.data.length;
        }
      },
      error: () => (this.stats.totalStudents = 0),
    });

    // 2. Fetch Teachers Count
    this.apiService.get<any>('teacher/get').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.stats.totalTeachers = res.data.length;
        }
      },
      error: () => (this.stats.totalTeachers = 0),
    });

    // 3. Fetch Absents Count
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

    // 4. Fetch Fee Management Collection
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

    // 5. Fetch Total DEO / Users Count
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

  toggleGroup(groupId: string): void {
    this.collapsedGroups[groupId] = !this.collapsedGroups[groupId];
  }

  isGroupCollapsed(groupId: string): boolean {
    return !!this.collapsedGroups[groupId];
  }

  hasRolePermission(roles: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    if (this.userRole === 'Super-Admin' || this.userRole === 'Super Admin' || this.userRole === 'USER') return true;
    return roles.includes(this.userRole);
  }

  toggleMobileSidebar(): void {
    this.isSidebarMobileOpen = !this.isSidebarMobileOpen;
  }

  onLogout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    this.router.navigate(['/admin/login']);
  }
}
