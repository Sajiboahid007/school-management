import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardOverviewComponent } from './components/dashboard/dashboard-overview/dashboard-overview.component';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RoleComponent } from './components/role/role';
import { StudentComponent } from './components/student.component/student.component';
import { TeacherComponent } from './components/teacher.component/teacher.component';
import { DepartmentComponent } from './components/department.component/department.component';
import { ClassComponent } from './components/class.component/class.component';
import { SubjectComponent } from './components/subject.component/subject.component';
import { ClassesSubjectsComponent } from './components/classes-subjects/classes-subjects';
import { AttendanceComponent } from './components/attendance.component/attendance.component';
import { ExamsComponent } from './components/exams.component/exams.component';
import { ScheduleComponent } from './components/schedule.component/schedule.component';
import { FeeManagementComponent } from './components/fee-management.component/fee-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardOverviewComponent },
      { path: 'user', component: UserListComponent },
      { path: 'role', component: RoleComponent },
      { path: 'student', component: StudentComponent },
      { path: 'teacher', component: TeacherComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'class', component: ClassComponent },
      { path: 'subject', component: SubjectComponent },
      { path: 'classes', component: ClassesSubjectsComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'fees', component: FeeManagementComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
