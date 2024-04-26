import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import {
  Option,
  Select,
  FormControl,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Button,
  Avatar,
  Card,
  CardContent,
  Typography,
  Box,
  Input,
  LinearProgress,
  Stack,
  Grid,
} from "@mui/joy";
import { useState } from "react";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import {
  getAttendanceStatusByCode,
  getCurrentDate,
  makeDoubleDigit,
} from "utilities/UtilitiesFunctions";
import { enqueueSnackbar } from "notistack";
import { db } from "../../firebase";
import { StudentAttendanceGlobalSchema } from "types/attendance";
import { Paper } from "@mui/material";
import { Print } from "@mui/icons-material";
import OverViewTab from "./viewAttendanceTabs/OverViewTab";
import { AttendanceReportGenerator } from "components/AttendanceReport/AttendanceReportGenerator";
import Search from "@mui/icons-material/Search";
import { StudentDetailsType } from "types/student";
// import { StudentDetailsType } from "types/student";

type AttendanceHeaderDataType = {
  totalStudent: number;
  totalAbsent: number;
  totalPresent: number;
  totalLeave: number;
  totalHoliday: number;
};

function ViewAttendance() {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [individualAttendanceData, setIndividualAttendanceData] = useState<
    StudentAttendanceGlobalSchema[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filterdata, setfilterdata] = useState<StudentDetailsType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceHeaderData, setAttendanceHeaderData] =
    useState<AttendanceHeaderDataType | null>(null);
  const [attendancedata, setattendancedata] = useState<
    StudentAttendanceGlobalSchema[]
  >([]);

  function handlesearch(): void {
    // setfilterdata(undefined)
    if (searchInput) {
      setLoading(true)
      // setfilterdata(undefined)
      console.log(searchInput);
      db.collection("STUDENTS")
        .where("admission_no", "==", searchInput)
        .get()
        .then((snapshot) => {
          if (snapshot.size > 0) {
            let tempArr: StudentDetailsType[] = [];
            snapshot.forEach((student) => {
              const resData = student.data() as StudentDetailsType;
              tempArr.push(resData);
              setfilterdata(tempArr);
            });
            db.collection("STUDENTS")
              .doc(filterdata[0].id)
              .collection("ATTENDANCE").where("attendanceDate","==",selectedDate)
              .get()
              .then((document) => {
                if (document.size > 0) {
                  let arrAttendance: StudentAttendanceGlobalSchema[] = [];
                  document.forEach((doc) => {
                    const data = doc.data() as StudentAttendanceGlobalSchema;
                    arrAttendance.push(data);
                    setattendancedata(arrAttendance);
                  });
                }
              });
            setLoading(false)
            console.log(filterdata);
            console.log(attendancedata);
          } else {
            setLoading(false);
            enqueueSnackbar("No student with this student ID!", {
              variant: "info",
            });
          }
        })
        .catch((e) => {
          enqueueSnackbar("INVALID STUDENT ID", e);
          setLoading(false);
        });
    } else {
      setLoading(false)
      enqueueSnackbar("Please enter Student Id", { variant: "error" });
    }
  }

  const fetchStudentAtt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedClass === null) {
      enqueueSnackbar("Please select class!", { variant: "error" });
    } else {
      setLoading(true);
      const classDate = `${makeDoubleDigit(
        selectedClass!.toString()
      )}_${selectedDate}`;

      setIndividualAttendanceData([]);
      setAttendanceHeaderData(null);
      db.collection("ATTENDANCE")
        .doc(classDate)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data() as any;
            const total_student = data.total_student;

            const headerData: AttendanceHeaderDataType = {
              totalStudent: data[`total_student`],
              totalAbsent: data[`total_absent`],
              totalLeave: data[`total_leave`],
              totalPresent: data[`total_present`],
              totalHoliday: data[`total_holiday`],
            };
            setAttendanceHeaderData(headerData);

            let attendanceDataTempArr: StudentAttendanceGlobalSchema[] = [];
            for (let i = 0; i < total_student; i++) {
              const dataObj: StudentAttendanceGlobalSchema = {
                studentName: data[`student_${i}_name`],
                studentId: data[`student_${i}_id`],
                studentFatherName: data[`student_${i}_father`],
                studentProfile: data[`student_${i}_profile`],
                studentRegId: data[`student_${i}_regId`],
                studentContact: data[`student_${i}_contact`],
                attendanceStatus: data[`student_${i}_status`],
                isSmartAttendance: false,
                createdAt: data[`student_${i}_timestamp`]
                  .toDate()
                  .toLocaleString(),
                comment: data[`student_${i}_comment`],
              };
              attendanceDataTempArr.push(dataObj);
            }
            setIndividualAttendanceData(attendanceDataTempArr);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    }
  };

  const handleNewWindowOpen = async () => {
    const attendanceHeaderDataa = attendanceHeaderData!;
    const pdfRes = await AttendanceReportGenerator(
      attendanceHeaderDataa,
      individualAttendanceData
    );
    const features =
      "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    window.open(pdfRes, "_blank", features);
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={FingerprintIcon}
          Path="Attendance/View Student Attendance"
        />
        <br />
        <Tabs aria-label="Basic tabs" defaultValue={0}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>By Class</Tab>
            <Tab>By Student ID</Tab>
          </TabList>
          <TabPanel value={0}>
            <OverViewTab />
          </TabPanel>
          <TabPanel value={2}>
            <Grid container spacing={2} marginTop={2}>
              <Paper
                sx={{
                  padding: "8px",
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={2}
                  marginBottom={1.5}
                  marginTop={1}
                  marginLeft={0.5}
                  marginRight={0.5}
                >
                  <Input
                    placeholder="Student ID"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  
                    <FormLabel>Select Date</FormLabel>
                    <Input
                      required
                      placeholder="Placeholder"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    {/* <FormHelperText>This is a helper text.</FormHelperText> */}
                  
                  <Button
                    startDecorator={<Search />}
                    variant="soft"
                    onClick={handlesearch}
                  />
                </Stack>
                {loading ? <LinearProgress /> : null}
                <Table
                  aria-label="table variants"
                  variant="plain"
                  color="neutral"
                  stripe={"odd"}
                >
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>FATHER</th>
                      <th>CONTACT</th>
                      
                      <th>STATUS</th>
                      <th>COMMENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterdata &&
                      filterdata.map((student, i) => {
                        return (
                          <tr key={student.student_name}>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Avatar src={student.profil_url} />
                                {student.student_name}
                              </div>
                            </td>
                            <td>{student.father_name}</td>
                            <td>{student.contact_number}</td>
                            {attendancedata &&
                              attendancedata.map((student, i) => {
                                return (
                                  
                                <tr
                                >
                                <td>{student.attendanceStatus}</td>
                                <td>{student.comment}</td>
                                </tr>
                                
                                )
                              })}
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Paper>
            </Grid>
          </TabPanel>
          <TabPanel value={1}>
            {/* <b>Third</b> tab panel */}
            <Paper sx={{ p: 2, border: "1px solid var(--bs-gray-300)" }}>
              <Box
                component="form"
                onSubmit={fetchStudentAtt}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <FormControl>
                    <FormLabel>Select Date</FormLabel>
                    <Input
                      required
                      placeholder="Placeholder"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    {/* <FormHelperText>This is a helper text.</FormHelperText> */}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Class</FormLabel>
                    <Select
                      required
                      placeholder="Class"
                      defaultValue={null}
                      value={selectedClass}
                      onChange={(e, val) => setSelectedClass(val)}
                      sx={{ minWidth: 200 }}
                    >
                      {SCHOOL_CLASSES.map((item, i) => {
                        return (
                          <Option value={item.value} key={item.id}>
                            {item.title}{" "}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Button sx={{ height: 20 }} type="submit">
                    Fetch
                  </Button>
                  {individualAttendanceData.length > 0 ? (
                    <Button
                      sx={{ height: 20 }}
                      endDecorator={<Print />}
                      color="primary"
                      onClick={handleNewWindowOpen}
                    >
                      Export
                    </Button>
                  ) : null}
                </div>
              </Box>
              <br />
              {loading ? <LinearProgress /> : null}

              {individualAttendanceData.length > 0 ? (
                <>
                  <Card variant="soft" color="primary" invertedColors>
                    <CardContent orientation="horizontal">
                      <CardContent>
                        <Typography level="body-md">Total Student</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalStudent}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">Total Present</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalPresent}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">Total Absent</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalAbsent}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">Total On Leave</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalLeave}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">
                          Total On Holiday
                        </Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalHoliday}
                        </Typography>
                      </CardContent>
                    </CardContent>
                  </Card>
                  <br />
                  <Table
                    aria-label="table variants"
                    variant="plain"
                    color="neutral"
                    stripe={"odd"}
                  >
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th>FATHER</th>
                        <th>CONTACT</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: "center", width: "190px" }}>
                          COMMENT
                        </th>
                        <th style={{ textAlign: "end", width: "190px" }}>
                          TIMESTAMP
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {individualAttendanceData &&
                        individualAttendanceData.map((student, i) => {
                          return (
                            <tr key={student.studentRegId}>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <Avatar src={student.studentProfile} />
                                  {student.studentName}
                                </div>
                              </td>
                              <td>{student.studentFatherName}</td>
                              <td>{student.studentContact}</td>
                              <td>
                                {getAttendanceStatusByCode(
                                  student.attendanceStatus
                                )}
                              </td>
                              <td
                                style={{ textAlign: "center", width: "190px" }}
                              >
                                {student.comment !== "" ? student.comment : "_"}
                              </td>
                              <td style={{ textAlign: "end", width: "190px" }}>
                                {"" + student.createdAt}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </>
              ) : null}
            </Paper>
          </TabPanel>
        </Tabs>
      </LSPage>
    </PageContainer>
  );
}

export default ViewAttendance;
