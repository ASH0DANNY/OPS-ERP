import {
  EMAIL_ICON,
  LOGO_BASE_64,
  PHONE_ICON,
  POPPINS_BOLD,
  POPPINS_REGULAR,
  POPPINS_SEMIBOLD,
} from "utilities/Base64Url";

import {
  SCHOOL_ADDRESS,
  SCHOOL_CONTACT,
  SCHOOL_EMAIL,
  SCHOOL_NAME,
} from "config/schoolConfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AttendanceRegisterReport=()=>{

  let DailyAttClassHeader=[
      "#",
      "Class",
      "Name",
      "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
      "21","22","23","24","25","26","27","28","29","30","31",
      "Total",
      "HF-D",
      "Leave",
      "Absent",
  ];
  
  let DailyAttClassBody=[
      ["1","Nursary","Shrikant Loric","4","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","3", "4"],
      ["2","Nursary","Kundan Gupta","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0", "4"],
      ["3","Nursary","Harry Potter","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0", "4"],
      ["4","Class 3","John Wick","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0", "4"],
      ["5","Class 4","Peater Parker","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0", "4"],
      ["6","Class 5","Elon Musk","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0", "4"],
      ["7","Class 6","Ben","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0", "4"],
  ];

  return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF({
          orientation: "l",
          unit: "mm",
          format: "a4",
  
        });
        const cardWidth = (doc.internal.pageSize.getWidth() - 15);
        const cardHeight = (doc.internal.pageSize.getHeight() - 15);
        const margin = 2;
  
        const x = 5 + margin;
        const y = 5 + margin;
        // const y=cardHeight+margin;
  
  
        doc.setTextColor("#000");
  
        // Load fonts
        doc.addFileToVFS("Poppins-Bold", POPPINS_BOLD);
        doc.addFont("Poppins-Bold", "Poppins", "bold");
  
        doc.addFileToVFS("Poppins-Regular", POPPINS_REGULAR);
        doc.addFont("Poppins-Regular", "Poppins", "normal");
  
        doc.addFileToVFS("Poppins-Semibold", POPPINS_SEMIBOLD);
        doc.addFont("Poppins-Semibold", "Poppins", "semibold");
        ///Start of PDF Design
  
        doc.addImage(LOGO_BASE_64, x + 8, y + 2, 30, 25);
  
        const schoolHeaderStartX = x + 50;
        const schoolHeaderStartY = y + 5;
  
        doc.setFontSize(15);
        doc.setFont("Poppins", "bold");
        doc.text(SCHOOL_NAME, schoolHeaderStartX + 10, schoolHeaderStartY);
  
        doc.setFontSize(8);
        doc.setFont("Poppins", "semibold");
        doc.text(
          "An English Medium School Based on CBSE Syllabus",
          schoolHeaderStartX + 7,
          schoolHeaderStartY + 5
        );
  
        const schoolContactDetailStartY = schoolHeaderStartY + 2;
        // const schoolContactDetailStartX = schoolHeaderStartX - 5;
  
        const cardXStartPoint = x;
        const cardXEndPoint = cardWidth;
  
        doc.setFillColor("#cbc9c9");
        doc.rect(
          schoolHeaderStartX + 5,
          schoolContactDetailStartY + 5,
          cardXEndPoint - 140,
          4,
          "F"
        );
  
        doc.setFontSize(6);
        doc.setFont("Poppins", "normal");
        doc.text(
          SCHOOL_ADDRESS,
          schoolHeaderStartX + 12,
          schoolContactDetailStartY + 7.5
        );
  
        //school contact
        doc.addImage(
          PHONE_ICON,
          schoolHeaderStartX + 9,
          schoolContactDetailStartY + 10,
          3,
          3
        );
  
        doc.text(
          SCHOOL_CONTACT,
          schoolHeaderStartX + 13,
          schoolContactDetailStartY + 12
        );
  
        //school email
        doc.addImage(
          EMAIL_ICON,
          schoolHeaderStartX + 34,
          schoolContactDetailStartY + 10,
          3,
          3
        );
  
        doc.text(
          SCHOOL_EMAIL,
          schoolHeaderStartX + 38,
          schoolContactDetailStartY + 12
        );
  
        doc.setFillColor("#939393");
  
        doc.rect(cardXStartPoint, y + 26, cardXEndPoint, 6, "F");
  
        doc.setFont("Poppins", "semibold");
        doc.setFontSize(9);
        doc.setTextColor("#fff");
        doc.text("Attendance Register Report", cardWidth / 2 -8 , y + 30);
  
        let tableX = x;
        let tableY = y + 40;
  
  
        autoTable(doc, {
          head: [DailyAttClassHeader],
          body: DailyAttClassBody,
          startY: tableY,
          theme: 'grid',
          styles: {
            textColor: '#000',
            fontSize: 7,
            minCellHeight: 4,
          },
          margin: { left: tableX+2 },
          headStyles: {
            cellWidth: 6.4,
            fillColor: '#fff',
            textColor: '#000',
            minCellHeight: 3,
            fontSize:6,
          },
          columnStyles: {
            1: {cellWidth: 12}, //Class Name
            2: {cellWidth: 22}, //Student Name
            34: {cellWidth: 9},
            35: {cellWidth: 9},
            36: {cellWidth: 10},
            37: {cellWidth: 11},
          },
        });
  
  
        DailyAttClassBody.forEach((data, index) => {
  
          // Draw border around content
          doc.setDrawColor("#949494");
          doc.rect(x, y, cardWidth, cardHeight);
  
          if (index === DailyAttClassBody.length - 1) {
            // Save PDF and update state with URL
  
            // Convert PDF to Blob
            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            console.log(url)
  
            resolve(url);
          }
        });
      }
      catch (error) {
        reject(error);
      }

    });

}

export default AttendanceRegisterReport;