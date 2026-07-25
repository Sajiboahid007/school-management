import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FeeManagement, FeeService } from '../../../shared/services/fee-service';
import { FeeCollectComponent } from './fee-collect/fee-collect';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

interface ClassFeeRow {
  StudentId: number;
  RollNumber: string;
  Name: string;
  TotalBilled: number;
  TotalPaid: number;
  Balance: number;
  Status: string;
  Invoices: FeeManagement[];
}

@Component({
  selector: 'app-fee-management',
  standalone: false,
  templateUrl: './fee-management.component.html',
  styleUrl: './fee-management.component.scss'
})
export class FeeManagementComponent implements OnInit {
  activeTab: 'classes' | 'report' | 'history' = 'classes';

  classes: any[] = [];
  classOptions: { label: string; value: any }[] = [];
  fees: FeeManagement[] = [];

  isLoadingClasses: boolean = false;
  isLoadingHistory: boolean = false;
  isLoadingReport: boolean = false;

  // Report tab
  selectedClassId?: number;
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  reportRows: ClassFeeRow[] = [];

  selectedFeeType: string = '';

  feeTypeFilterOptions = [
    { label: 'All Fee Types', value: '' },
    { label: 'Tuition Fee', value: 'Tuition Fee' },
    { label: 'Exam Fee', value: 'Exam Fee' },
    { label: 'Admission Fee', value: 'Admission Fee' },
    { label: 'Library Fee', value: 'Library Fee' }
  ];

  monthOptions = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 }
  ];

  yearOptions = [
    { label: '2025', value: 2025 },
    { label: '2026', value: 2026 },
    { label: '2027', value: 2027 },
    { label: '2028', value: 2028 }
  ];

  // Receipt dialog
  selectedReceipt: FeeManagement | null = null;
  receiptVisible: boolean = false;

  constructor(
    private readonly feeService: FeeService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getClasses();
    this.getFees();
  }

  getClasses(): void {
    this.isLoadingClasses = true;
    this.feeService.getClasses().subscribe({
      next: (response) => {
        this.classes = response.data || [];
        this.classOptions = this.classes.map((c) => ({
          label: `${c.Name} (${c.Section})`,
          value: c.Id
        }));
        if (this.classOptions.length > 0) {
          this.selectedClassId = this.classOptions[0].value;
        }
        this.isLoadingClasses = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.classes = [];
        this.isLoadingClasses = false;
        this.cdr.markForCheck();
      },
    });
  }

  getFees(): void {
    this.isLoadingHistory = true;
    this.feeService.getFees().subscribe({
      next: (response) => {
        this.fees = response.data || [];
        this.isLoadingHistory = false;
        this.onReportParamChange();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching fees logs:', error);
        this.fees = [];
        this.isLoadingHistory = false;
        this.cdr.markForCheck();
      },
    });
  }

  switchTab(tab: 'classes' | 'report' | 'history'): void {
    this.activeTab = tab;
    if (tab === 'report') {
      this.onReportParamChange();
    }
  }

  onReportParamChange(): void {
    if (!this.selectedClassId) {
      this.reportRows = [];
      return;
    }
    this.isLoadingReport = true;

    this.feeService.getStudents().subscribe({
      next: (res) => {
        const classStudents = (res.data || []).filter(
          (s: any) => Number(s.ClassId) === Number(this.selectedClassId)
        );

        // Filter fees by class students, selected month/year, and optional fee type
        const filteredFees = this.fees.filter((f) => {
          const studentIds = classStudents.map((s: any) => Number(s.Id));
          const feeDate = new Date(f.DueDate);
          const matchesClass = studentIds.includes(Number(f.StudentId));
          const matchesMonth = feeDate.getMonth() === Number(this.selectedMonth);
          const matchesYear = feeDate.getFullYear() === Number(this.selectedYear);
          const matchesType = !this.selectedFeeType || f.FeeType === this.selectedFeeType;
          return matchesClass && matchesMonth && matchesYear && matchesType;
        });

        this.reportRows = classStudents.map((s: any) => {
          const studentFees = filteredFees.filter(
            (f) => Number(f.StudentId) === Number(s.Id)
          );
          const totalBilled = studentFees.reduce(
            (sum, f) => sum + Number(f.Amount), 0
          );
          const totalPaid = studentFees.reduce(
            (sum, f) => sum + Number(f.PaidAmount), 0
          );
          const balance = totalBilled - totalPaid;
          let status = 'UNPAID';
          if (studentFees.length > 0) {
            if (totalPaid >= totalBilled) status = 'PAID';
            else if (totalPaid > 0) status = 'PARTIAL';
          }
          return {
            StudentId: s.Id,
            RollNumber: s.RollNumber || 'N/A',
            Name: s.Name,
            TotalBilled: totalBilled,
            TotalPaid: totalPaid,
            Balance: balance,
            Status: status,
            Invoices: studentFees
          };
        });

        this.isLoadingReport = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading report:', err);
        this.isLoadingReport = false;
        this.cdr.markForCheck();
      }
    });
  }

  onCollectFees(cls: any): void {
    const dialogRef = this.dialog.open(FeeCollectComponent, {
      header: `Collect Fees - ${cls.Name} (${cls.Section})`,
      width: '680px',
      modal: true,
      dismissableMask: true,
      styleClass: 'fee-collect-modal-dialog',
      data: cls,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getFees();
        }
      });
    }
  }

  onViewReceipt(fee: FeeManagement): void {
    this.selectedReceipt = fee;
    this.receiptVisible = true;
  }

  onPrintReceipt(): void {
    const printContent = document.getElementById('receipt-print-area');
    if (!printContent) return;
    const printWindow = window.open('about:blank', new Date().getTime().toString(), 'left=50,top=50,width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fee Receipt - ${this.selectedReceipt?.InvoiceNo}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #334155; }
              .receipt-header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
              .receipt-title { font-size: 24px; font-weight: bold; color: #1e1b4b; }
              .receipt-school { font-size: 14px; color: #64748b; }
              .receipt-meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
              .meta-block p { margin: 4px 0; }
              .receipt-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .receipt-table th { background: #f1f5f9; padding: 10px; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
              .receipt-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
              .text-right { text-align: right; }
              .receipt-footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 20px; margin-top: 40px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  onDeleteFee(id?: number): void {
    if (!id) return;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this fee payment entry?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.feeService.deleteFee(id).subscribe({
          next: () => this.getFees(),
          error: (error) => console.error('Error deleting fee:', error)
        });
      }
    });
  }

  getStatusSeverity(status?: string): 'success' | 'danger' | 'warn' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'PAID': return 'success';
      case 'UNPAID': return 'danger';
      case 'PARTIAL': return 'warn';
      default: return 'secondary';
    }
  }
}
