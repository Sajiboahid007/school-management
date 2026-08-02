import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

// PrimeNG Modules & Services
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardOverviewComponent } from './components/dashboard/dashboard-overview/dashboard-overview.component';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserInsertUpdateComponent } from './components/user-list/user-insert-update/user-insert-update.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RoleComponent } from './components/role/role';
import { RoleInsertUpdateComponent } from './components/role/role-insert-update/role-insert-update.component';
import { StudentComponent } from './components/student.component/student.component';
import { StudentInsertUpdateComponent } from './components/student.component/student-insert-update/student-insert-update';
import { TeacherComponent } from './components/teacher.component/teacher.component';
import { TeacherInsertUpdateComponent } from './components/teacher.component/teacher-insert-update/teacher-insert-update';
import { DepartmentComponent } from './components/department.component/department.component';
import { DepartmentInsertUpdateComponent } from './components/department.component/department-insert-update/department-insert-update';
import { ClassComponent } from './components/class.component/class.component';
import { ClassInsertUpdateComponent } from './components/class.component/class-insert-update/class-insert-update';
import { SubjectComponent } from './components/subject.component/subject.component';
import { SubjectInsertUpdateComponent } from './components/subject.component/subject-insert-update/subject-insert-update';
import { ClassesSubjectsComponent } from './components/classes-subjects/classes-subjects';
import { AttendanceComponent } from './components/attendance.component/attendance.component';
import { AttendanceInsertUpdateComponent } from './components/attendance.component/attendance-insert-update/attendance-insert-update';
import { ExamsComponent } from './components/exams.component/exams.component';
import { ExamInsertUpdateComponent } from './components/exams.component/exam-insert-update/exam-insert-update';
import { ScheduleComponent } from './components/schedule.component/schedule.component';
import { ScheduleInsertUpdateComponent } from './components/schedule.component/schedule-insert-update/schedule-insert-update';
import { FeeManagementComponent } from './components/fee-management.component/fee-management.component';
import { FeeCollectComponent } from './components/fee-management.component/fee-collect/fee-collect';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardOverviewComponent,
    LoginComponent,
    UserListComponent,
    UserInsertUpdateComponent,
    ProfileComponent,
    RoleComponent,
    RoleInsertUpdateComponent,
    StudentComponent,
    StudentInsertUpdateComponent,
    TeacherComponent,
    TeacherInsertUpdateComponent,
    DepartmentComponent,
    DepartmentInsertUpdateComponent,
    ClassComponent,
    ClassInsertUpdateComponent,
    SubjectComponent,
    SubjectInsertUpdateComponent,
    ClassesSubjectsComponent,
    AttendanceComponent,
    AttendanceInsertUpdateComponent,
    ExamsComponent,
    ExamInsertUpdateComponent,
    ScheduleComponent,
    ScheduleInsertUpdateComponent,
    FeeManagementComponent,
    FeeCollectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    SelectModule,
    MultiSelectModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    BadgeModule,
    ConfirmDialogModule,
    DynamicDialogModule
  ],
  providers: [
    ConfirmationService,
    DialogService,
    DecimalPipe
  ]
})
export class AdminModule { }
