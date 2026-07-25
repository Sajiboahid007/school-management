import { Component, OnInit, Optional } from '@angular/core';
import { FeeManagement, FeeService } from '../../../../shared/services/fee-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface StudentFeeRow {
  StudentId: number;
  Name: string;
  RollNumber: string;
  Amount: number;
  PaidAmount: number;
  IsPaying: boolean;
  Status: 'PAID' | 'UNPAID' | 'PARTIAL';
}

@Component({
  selector: 'app-fee-collect',
  standalone: false,
  templateUrl: './fee-collect.html',
  styleUrl: './fee-collect.scss'
})
export class FeeCollectComponent implements OnInit {
  classData: any = null;

  feeType: string = 'Tuition Fee';
  dueDate: string = '';
  paymentDate: string = '';
  paymentMethod: string = 'CASH';

  students: StudentFeeRow[] = [];

  paymentMethodOptions = [
    { label: 'Cash', value: 'CASH' },
    { label: 'Card', value: 'CARD' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' }
  ];

  feeTypeOptions = [
    { label: 'Tuition Fee', value: 'Tuition Fee' },
    { label: 'Admission Fee', value: 'Admission Fee' },
    { label: 'Exam Fee', value: 'Exam Fee' },
    { label: 'Library Fee', value: 'Library Fee' }
  ];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly feeService: FeeService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.paymentDate = today.toISOString().split('T')[0];
    
    // Set due date to end of current month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dueDate = endOfMonth.toISOString().split('T')[0];

    if (this.config?.data) {
      this.classData = this.config.data;
      this.loadStudents();
    } else {
      this.errorMessage = 'Class details were not provided.';
    }
  }

  getFixedFeeForClass(className: string): number {
    const name = className.toLowerCase();
    if (name.includes('12')) return 200;
    if (name.includes('11')) return 180;
    if (name.includes('10')) return 150;
    if (name.includes('9')) return 130;
    return 100; // default base fee
  }

  loadStudents(): void {
    this.isLoading = true;
    const baseFee = this.getFixedFeeForClass(this.classData.Name || '');

    this.feeService.getStudents().subscribe({
      next: (res) => {
        const allStudents = res.data || [];
        const filtered = allStudents.filter((s: any) => Number(s.ClassId) === Number(this.classData.Id));

        this.students = filtered.map((s: any) => ({
          StudentId: s.Id,
          Name: s.Name,
          RollNumber: s.RollNumber || 'N/A',
          Amount: baseFee,
          PaidAmount: baseFee, // Default full paid
          IsPaying: true,
          Status: 'PAID'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load students for this class.';
      }
    });
  }

  onPayingToggle(row: StudentFeeRow): void {
    if (!row.IsPaying) {
      row.PaidAmount = 0;
      row.Status = 'UNPAID';
    } else {
      row.PaidAmount = row.Amount;
      row.Status = 'PAID';
    }
  }

  onPaidAmountChange(row: StudentFeeRow): void {
    if (row.PaidAmount >= row.Amount) {
      row.PaidAmount = row.Amount;
      row.Status = 'PAID';
    } else if (row.PaidAmount <= 0) {
      row.PaidAmount = 0;
      row.Status = 'UNPAID';
    } else {
      row.Status = 'PARTIAL';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.feeType || !this.dueDate) {
      this.errorMessage = 'Fee Type and Due Date are required.';
      return;
    }

    const payingStudents = this.students.filter(s => s.IsPaying || s.Status !== 'UNPAID');
    if (payingStudents.length === 0) {
      this.errorMessage = 'No student fee transactions to record.';
      return;
    }

    this.isLoading = true;

    // Submit each student's fee as a separate POST to avoid bulk-array issues
    // and guarantee unique InvoiceNo per record using randomUUID
    let completed = 0;
    let hasFailed = false;

    const submitNext = (index: number): void => {
      if (index >= payingStudents.length) {
        this.isLoading = false;
        if (!hasFailed) {
          this.successMessage = 'Fee payments recorded successfully!';
          setTimeout(() => this.ref?.close(true), 500);
        }
        return;
      }

      const s = payingStudents[index];
      const uniquePart = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
        : (Date.now() + index * 7 + Math.random().toString(36).slice(2, 6)).toString().toUpperCase();

      const record: FeeManagement = {
        InvoiceNo: `INV-${uniquePart}-${s.StudentId}`,
        StudentId: s.StudentId,
        FeeType: this.feeType,
        Amount: Number(s.Amount),
        PaidAmount: Number(s.PaidAmount),
        DueDate: this.dueDate,
        PaymentDate: s.PaidAmount > 0 ? this.paymentDate : undefined,
        PaymentMethod: s.PaidAmount > 0 ? this.paymentMethod : undefined,
        Status: s.Status
      };

      this.feeService.addFee(record).subscribe({
        next: () => {
          completed++;
          submitNext(index + 1);
        },
        error: (err) => {
          hasFailed = true;
          this.isLoading = false;
          this.errorMessage = err?.error?.error || err?.error?.message || 'Failed to record fee for ' + s.Name;
        }
      });
    };

    submitNext(0);
  }

  onCancel(): void {
    if (this.ref) {
      this.ref.close(false);
    }
  }
}
