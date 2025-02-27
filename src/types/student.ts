import firebase from "firebase";

export type StudentDetailsType = {
  aadhar_number: string;
  address: string;
  admission_no: string;
  alternate_number: string;
  blood_group: string;
  cast: string;
  city: string;
  class: number;
  class_roll: string;
  contact_number: string;
  date_of_addmission: string;
  dob: string;
  email: string;
  father_name: string;
  father_occupation: string;
  father_qualification: string;
  gender: string;
  id: string;
  mother_name: string;
  mother_occupation: string;
  motherqualifiation: string;
  postal_code: string;
  profil_url: string;
  religion: string;
  section: string;
  state: string;
  student_id: string;
  student_name: string;
  monthly_fee?: number;
  computer_fee:number;
  created_at?: firebase.firestore.Timestamp|firebase.firestore.FieldValue;
  transportation_fee:number;
  generated_fee:string[]
};

export interface StudentFeeDetailsType  {
  credit_by: string;
  discount_amount: number;
  student_id: string;
  fee_title: string;
  fee_total: number;
  computer_fee:number;
  transportation_fee:number;
  id: string;
  late_fee: number;
  paid_amount: number;
  payment_date: firebase.firestore.Timestamp|firebase.firestore.FieldValue|null;
  payment_mode: string;
  payment_remarks: string;
  created_at?: firebase.firestore.Timestamp|firebase.firestore.FieldValue;
  fee_month_year?:string
  is_payment_done:boolean,
  doc_id:string
  payment_due_date:firebase.firestore.Timestamp|firebase.firestore.FieldValue|Date;
  fee_header_type:string;
  monthly_fee?: number;
  
};

type feeHeadType = {
  title:string,
  value:number,
}

export type DueRecieptPropsType = {
  reciept_id:string,
  current_session:string,
  due_date:string,
  due_month:string,
  student_name:string,  
  class:string,
  father_name:string,
  dob:string,
  phone_number:number,
  roll_number:number,
  admission_no:string,
  section:string,
  address:string,
  fee_heads:feeHeadType[],
  note:string
}


export type BalanceSheetType={
  tran_id:string,
  tran_type:string,
  tran_name:string,
  tran_desc:string,
  tran_amount:string
}