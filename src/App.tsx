import { useState, type FormEvent, type ReactNode } from "react";
import "./App.css";
import CampusBridgeAIAssistant from "./CampusBridgeAIAssistant";

type Page =
  | "Overview"
  | "Student Registration"
  | "Provisional ID"
  | "Campus Guide"
  | "Login"
  | "COD Review";

type Student = {
  name: string;
  registrationNumber: string;
  indexNumber: string;
  programme: string;
  dateOfBirth: string;
  gender: string;
  nationalId: string;
  nationality: string;
  phone: string;
  email: string;
  county: string;
  homeAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  admissionNumber: string;
  intake: string;
  studyLevel: string;
  school: string;
  acceptanceLetterNumber?: string;
  acceptanceLetterDate?: string;
  acceptanceLetterProgramme?: string;
  declarationFullName?: string;
  declarationDate?: string;
};

const initialStudent: Student = {
  name: "",
  registrationNumber: "",
  indexNumber: "",
  programme: "",
  dateOfBirth: "",
  gender: "",
  nationalId: "",
  nationality: "Kenyan",
  phone: "",
  email: "",
  county: "",
  homeAddress: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  admissionNumber: "",
  intake: "",
  studyLevel: "Undergraduate",
  school: "",
  acceptanceLetterNumber: "",
  acceptanceLetterDate: "",
  acceptanceLetterProgramme: "",
  declarationFullName: "",
  declarationDate: "",
};

const coursesBySchool: Record<string, string[]> = {
  "Computing and Information Technology": [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Software Engineering",
    "Bachelor of Business Information Technology",
  ],

  "Engineering and Technology": [
    "Bachelor of Science in Electrical and Electronics Engineering",
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],

  "Business and Economics": [
    "Bachelor of Commerce",
    "Bachelor of Science in Human Resource Management",
    "Bachelor of Procurement and Supply Chain Management",
    "Bachelor of Science in Entrepreneurship and Enterprise Management",
  ],

  "Agriculture and Environmental Sciences": [
    "Bachelor of Science in Agriculture",
    "Bachelor of Science in Agribusiness Management",
    "Bachelor of Science in Agricultural Education and Extension",
  ],

  "Pure, Applied and Health Sciences": [
    "Bachelor of Science in Analytical Chemistry",
    "Bachelor of Science in Industrial Chemistry",
    "Bachelor of Science in Actuarial Science",
    "Bachelor of Science in Mathematics and Computer Science",
  ],

  "Hospitality and Tourism Management": [
    "Bachelor of Hospitality Management",
    "Bachelor of Tourism Management",
    "Bachelor of Travel and Tours Management",
    "Bachelor of Science in Food Science and Technology",
  ],

  "Education, Humanities and Social Sciences": [
    "Bachelor of Linguistics and Communication Studies",
    "Bachelor of Journalism and Digital Media",
    "Bachelor of Education (Arts)",
    "Bachelor of Education (Science)",
    "Bachelor of Science in Criminology and Security Studies",
  ],
};

function App() {
  const [page, setPage] = useState<Page>("Overview");

  const [student, setStudent] =
    useState<Student>(initialStudent);

  const [registrationStep, setRegistrationStep] =
    useState<1 | 2>(1);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [registrationType, setRegistrationType] =
    useState<"first-time" | "continuing">("first-time");

  const [idIssuedAt, setIdIssuedAt] =
    useState<string | null>(null);

  const [codApprovalStatus, setCodApprovalStatus] =
    useState<
      "not-submitted" | "pending" | "approved" | "rejected"
    >("not-submitted");

  const [, setCodDecisionNote] =
    useState("");

  const [loginRegistrationNumber, setLoginRegistrationNumber] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [loginMessage, setLoginMessage] =
    useState("");

  const [guideQuery, setGuideQuery] = useState("");

  const [selectedGuideTitle, setSelectedGuideTitle] =
    useState<string | null>(null);

  function updateStudent<K extends keyof Student>(
    field: K,
    value: Student[K]
  ) {
    setStudent((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      // In this prototype, the admission number mirrors
      // the university registration number.
      if (field === "registrationNumber") {
        next.admissionNumber = String(value);
      }

      if (field === "school") {
        next.programme = "";
      }

      return next;
    });

    setSubmitted(false);
  }

  function openRegistration() {
    setPage("Student Registration");
    setLoginMessage("");
  }

  function handleLoginSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoginMessage(
      "Login is a demonstration in this prototype. Account verification needs a secure backend connected to the university registration system."
    );
  }

  function handleAccountSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (password.length < 8) {
      setPasswordError(
        "Use a password with at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(
        "Passwords do not match. Please try again."
      );
      return;
    }

    setPasswordError("");
    setRegistrationStep(2);
  }

  function handleStudentDetailsSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIdIssuedAt(new Date().toISOString());
    setSubmitted(true);
    setPage("Provisional ID");
  }

  function handleContinuingStudentSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStudent((current) => ({
      ...current,
      admissionNumber: current.registrationNumber,
    }));

    // Prototype workflow: continuing students must
    // receive COD approval before an ID is issued.
    setCodApprovalStatus("pending");
    setCodDecisionNote("");
    setIdIssuedAt(null);
    setSubmitted(false);
    setPage("Provisional ID");
  }

  function handleCodDecision(
    decision: "approved" | "rejected"
  ) {
    setCodApprovalStatus(decision);

    setCodDecisionNote(
      decision === "approved"
        ? "Prototype approval recorded. In a live system, this action must be performed by an authenticated COD."
        : "Prototype request rejected. In a live system, the COD would provide an official reason."
    );

    if (decision === "approved") {
      setIdIssuedAt(new Date().toISOString());
      setSubmitted(true);
    } else {
      setIdIssuedAt(null);
      setSubmitted(false);
    }

    setPage("Provisional ID");
  }

  const expiryDate = idIssuedAt
    ? new Date(
        new Date(idIssuedAt).getTime() +
          14 * 24 * 60 * 60 * 1000
      )
    : null;

  const isIdExpired =
    registrationType === "continuing" &&
    expiryDate !== null &&
    Date.now() > expiryDate.getTime();

  const pages: Page[] = [
    "Overview",
    "Student Registration",
    "Provisional ID",
    "Campus Guide",
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">CB</div>

          <div>
            <h2>CampusBridge</h2>
            <p>Student success starts here</p>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          {pages.map((item) => (
            <button
              key={item}
              type="button"
              className={`nav-item ${
                page === item ? "active" : ""
              }`}
              onClick={() => setPage(item)}
            >
              <span className="nav-icon">
                {item === "Overview" && "⌂"}
                {item === "Student Registration" && "+"}
                {item === "Provisional ID" && "▤"}
                {item === "Campus Guide" && "⌖"}
              </span>

              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="footer-check">✓</span>

          <div>
            <strong>Student-first design</strong>
            <p>Connect. Navigate. Settle In.</p>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <span>CampusBridge / {page}</span>

          <div className="topbar-actions">
            <span className="prototype-badge">
              Prototype mode
            </span>

            {page !== "Login" && (
              <button
                className="login-button"
                type="button"
                onClick={() => {
                  setPage("Login");
                  setLoginMessage("");
                }}
              >
                Login
              </button>
            )}
          </div>
        </header>

        <div className="content">
          {page === "Overview" && (
            <>
              <section className="campusbridge-home-hero">
                <div className="campusbridge-hero-copy">
                  <p className="campusbridge-hero-kicker">
                    <span />
                    MURANG’A UNIVERSITY OF TECHNOLOGY
                  </p>

                  <h1>
                    Campus<span>Bridge</span>
                  </h1>

                  <h2>
                    Your Smart Guide to a Better University
                    Experience
                  </h2>

                  <p className="campusbridge-hero-description">
                    Get quick access to university services,
                    campus information, hostels, dining,
                    accommodation and more — all in one place.
                  </p>

                  <div className="campusbridge-hero-actions">
                    <button
                      className="campusbridge-register-button"
                      type="button"
                      onClick={openRegistration}
                    >
                      ♙ &nbsp; Register Now{" "}
                      <span aria-hidden="true">→</span>
                    </button>

                    <button
                      className="campusbridge-login-button"
                      type="button"
                      onClick={() => {
                        setPage("Login");
                        setLoginMessage("");
                      }}
                    >
                      ↪ &nbsp; Login
                    </button>
                  </div>
                </div>

                <div
                  className="campusbridge-hero-bottom-wave"
                  aria-hidden="true"
                />
                <div
                  className="campusbridge-service-strip"
                  aria-label="CampusBridge services"
                >
                  <button
                    type="button"
                    className="campusbridge-service-tile"
                    onClick={() => setPage("Campus Guide")}
                  >
                    <span
                      className="service-symbol service-blue"
                      aria-hidden="true"
                    >
                      ▦
                    </span>

                    <span>
                      <strong>Hostel Booking</strong>
                      <small>Find and book your stay</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="campusbridge-service-tile"
                    onClick={() => setPage("Campus Guide")}
                  >
                    <span className="service-symbol service-green" aria-hidden="true">
                      ⌖
                    </span>
                    <span>
                      <strong>Campus Venues</strong>
                      <small>Explore buildings &amp; facilities</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="campusbridge-service-tile"
                    onClick={() => setPage("Campus Guide")}
                  >
                    <span className="service-symbol service-orange" aria-hidden="true">
                      ♜
                    </span>
                    <span>
                      <strong>Dining Options</strong>
                      <small>Quality meals, great taste</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="campusbridge-service-tile"
                    onClick={() => setPage("Campus Guide")}
                  >
                    <span className="service-symbol service-cyan" aria-hidden="true">
                      🎓
                    </span>
                    <span>
                      <strong>Campus Facilities</strong>
                      <small>Everything you need</small>
                    </span>
                  </button>
                </div>
              </section>

              <section className="overview-section campusbridge-overview-intro">
                <p className="eyebrow">YOUR DIGITAL CAMPUS COMPANION</p>
                <h2>Explore CampusBridge</h2>
                <p>
                  Start your registration, access your provisional ID,
                  or explore the Campus Guide.
                </p>

                <div className="feature-grid">
                  <FeatureCard
                    title="Student registration"
                    description="Create an account and complete your admission details."
                    action="Register now →"
                    onClick={openRegistration}
                  />

                  <FeatureCard
                    title="Provisional ID"
                    description="View your student information card after registration."
                    action="View ID →"
                    onClick={() => setPage("Provisional ID")}
                  />

                  <FeatureCard
                    title="Campus guide"
                    description="Discover campus locations and services."
                    action="Explore guide →"
                    onClick={() => setPage("Campus Guide")}
                  />
                </div>
              </section>
            </>
          )}

          {page === "Login" && (
            <section className="page-card login-card">
              <p className="eyebrow">WELCOME BACK</p>
              <h1>Student Login</h1>
              <p className="page-description">
                Sign in with your student registration number and password.
              </p>

              <form onSubmit={handleLoginSubmit}>
                <div className="registration-grid">
                  <Field
                    label="Registration number *"
                    id="loginRegistrationNumber"
                    fullWidth
                  >
                    <input
                      id="loginRegistrationNumber"
                      value={loginRegistrationNumber}
                      onChange={(e) => {
                        setLoginRegistrationNumber(e.target.value);
                        setLoginMessage("");
                      }}
                      placeholder="Enter your university-issued registration number"
                      autoComplete="username"
                      required
                    />
                  </Field>

                  <Field label="Password *" id="loginPassword" fullWidth>
                    <input
                      id="loginPassword"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginMessage("");
                      }}
                      autoComplete="current-password"
                      required
                    />
                  </Field>
                </div>

                {loginMessage && (
                  <p className="status-message" role="status">
                    {loginMessage}
                  </p>
                )}

                <div className="form-actions">
                  <button className="primary-button" type="submit">
                    Login →
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={openRegistration}
                  >
                    Create an account
                  </button>
                </div>
              </form>
            </section>
          )}

          {page === "Student Registration" && (
            <section className="page-card registration-page">
              <p className="eyebrow">NEW STUDENT ADMISSION</p>
              <h1>Student Registration</h1>
              <p className="page-description">
                Choose the registration path that applies to you.
              </p>

              <div className="registration-type-picker">
                <button
                  type="button"
                  className={`secondary-button ${
                    registrationType === "first-time" ? "selected-type" : ""
                  }`}
                  onClick={() => {
                    setRegistrationType("first-time");
                    setRegistrationStep(1);
                    setSubmitted(false);
                  }}
                >
                  First-time applicant
                </button>

                <button
                  type="button"
                  className={`secondary-button ${
                    registrationType === "continuing" ? "selected-type" : ""
                  }`}
                  onClick={() => {
                    setRegistrationType("continuing");
                    setSubmitted(false);
                  }}
                >
                  Continuing student
                </button>
              </div>

              {registrationType === "continuing" && (
                <form onSubmit={handleContinuingStudentSubmit}>
                  <h2 className="form-section-title">
                    Continuing Student — Essential Details
                  </h2>

                  <p className="page-description">
                    Enter the key details needed to request a temporary
                    provisional ID. COD approval is required before the ID
                    can be issued.
                  </p>

                  <div className="registration-grid">
                    <Field label="Full name *" id="continuingName">
                      <input
                        id="continuingName"
                        value={student.name}
                        onChange={(e) => updateStudent("name", e.target.value)}
                        required
                      />
                    </Field>

                    <Field
                      label="Registration number *"
                      id="continuingRegNo"
                    >
                      <input
                        id="continuingRegNo"
                        value={student.registrationNumber}
                        onChange={(e) =>
                          updateStudent("registrationNumber", e.target.value)
                        }
                        placeholder="Enter your university-issued registration number"
                        required
                      />
                    </Field>

                    <Field label="School / Faculty *" id="continuingSchool">
                      <select
                        id="continuingSchool"
                        value={student.school}
                        onChange={(e) => updateStudent("school", e.target.value)}
                        required
                      >
                        <option value="">Choose your school</option>
                        {Object.keys(coursesBySchool).map((school) => (
                          <option key={school} value={school}>
                            {school}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label="Course / Programme *"
                      id="continuingProgramme"
                    >
                      <select
                        id="continuingProgramme"
                        value={student.programme}
                        onChange={(e) =>
                          updateStudent("programme", e.target.value)
                        }
                        required
                        disabled={!student.school}
                      >
                        <option value="">
                          {student.school
                            ? "Choose your course"
                            : "Choose a school first"}
                        </option>
                        {(coursesBySchool[student.school] || []).map(
                          (course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          )
                        )}
                      </select>
                    </Field>

                    <Field label="Phone number *" id="continuingPhone">
                      <input
                        id="continuingPhone"
                        type="tel"
                        value={student.phone}
                        onChange={(e) => updateStudent("phone", e.target.value)}
                        required
                      />
                    </Field>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      Submit for COD approval →
                    </button>
                  </div>
                </form>
              )}

              {registrationType === "first-time" && (
                <>
                  <div className="step-indicator">
                    <div
                      className={`step-item ${
                        registrationStep === 1 ? "current" : "complete"
                      }`}
                    >
                      <span>1</span>
                      <strong>Create account</strong>
                    </div>

                    <div
                      className={`step-line ${
                        registrationStep === 2 ? "complete" : ""
                      }`}
                    />

                    <div
                      className={`step-item ${
                        registrationStep === 2 ? "current" : ""
                      }`}
                    >
                      <span>2</span>
                      <strong>Student details</strong>
                    </div>
                  </div>

                  {registrationStep === 1 && (
                    <form onSubmit={handleAccountSubmit}>
                      <h2 className="form-section-title">
                        1. Create your account
                      </h2>

                      <p className="page-description">
                        Enter your name and registration number, then create
                        a password.
                      </p>

                      <div className="registration-grid">
                        <Field label="Full name *" id="accountName">
                          <input
                            id="accountName"
                            value={student.name}
                            onChange={(e) =>
                              updateStudent("name", e.target.value)
                            }
                            autoComplete="name"
                            required
                          />
                        </Field>

                        <Field
                          label="Registration number *"
                          id="accountRegNo"
                        >
                          <input
                            id="accountRegNo"
                            value={student.registrationNumber}
                            onChange={(e) =>
                              updateStudent(
                                "registrationNumber",
                                e.target.value
                              )
                            }
                            placeholder="Enter your university-issued registration number"
                            required
                          />
                        </Field>

                        <Field
                          label="Password * (minimum 8 characters)"
                          id="accountPassword"
                        >
                          <input
                            id="accountPassword"
                            type="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError("");
                            }}
                            minLength={8}
                            autoComplete="new-password"
                            required
                          />
                        </Field>

                        <Field
                          label="Confirm password *"
                          id="confirmPassword"
                        >
                          <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordError("");
                            }}
                            minLength={8}
                            autoComplete="new-password"
                            required
                          />
                        </Field>
                      </div>

                      {passwordError && (
                        <p className="error-message" role="alert">
                          {passwordError}
                        </p>
                      )}

                      <button className="primary-button" type="submit">
                        Proceed to student details →
                      </button>
                    </form>
                  )}

                  {registrationStep === 2 && (
                    <form onSubmit={handleStudentDetailsSubmit}>
                      <h2 className="form-section-title">
                        2. Personal information
                      </h2>

                      <div className="registration-grid">
                        <Field label="Full name *" id="studentName">
                          <input
                            id="studentName"
                            value={student.name}
                            onChange={(e) =>
                              updateStudent("name", e.target.value)
                            }
                            required
                          />
                        </Field>

                        <Field label="Date of birth *" id="dob">
                          <input
                            id="dob"
                            type="date"
                            value={student.dateOfBirth}
                            onChange={(e) =>
                              updateStudent("dateOfBirth", e.target.value)
                            }
                            required
                          />
                        </Field>

                        <Field label="Gender *" id="gender">
                          <select
                            id="gender"
                            value={student.gender}
                            onChange={(e) =>
                              updateStudent("gender", e.target.value)
                            }
                            required
                          >
                            <option value="">Select gender</option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Prefer not to say</option>
                          </select>
                        </Field>

                        <Field label="Nationality *" id="nationality">
                          <input
                            id="nationality"
                            value={student.nationality}
                            onChange={(e) =>
                              updateStudent("nationality", e.target.value)
                            }
                            required
                          />
                        </Field>

                        <Field label="National ID / Passport" id="nationalId">
                          <input
                            id="nationalId"
                            value={student.nationalId}
                            onChange={(e) =>
                              updateStudent("nationalId", e.target.value)
                            }
                          />
                        </Field>

                        <Field label="Phone number *" id="phone">
                          <input
                            id="phone"
                            type="tel"
                            value={student.phone}
                            onChange={(e) =>
                              updateStudent("phone", e.target.value)
                            }
                            placeholder="+254..."
                            autoComplete="tel"
                            required
                          />
                        </Field>

                        <Field label="Email address *" id="email">
                          <input
                            id="email"
                            type="email"
                            value={student.email}
                            onChange={(e) =>
                              updateStudent("email", e.target.value)
                            }
                            autoComplete="email"
                            required
                          />
                        </Field>

                        <Field label="Home county *" id="county">
                          <input
                            id="county"
                            value={student.county}
                            onChange={(e) =>
                              updateStudent("county", e.target.value)
                            }
                            required
                          />
                        </Field>

                        <Field label="Home address" id="address" fullWidth>
                          <input
                            id="address"
                            value={student.homeAddress}
                            onChange={(e) =>
                              updateStudent("homeAddress", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <h2 className="form-section-title">
                        3. Admission and course selection
                      </h2>

                      <div className="registration-grid">
                        <Field
                          label="Admission number (same as registration number)"
                          id="admissionNumber"
                        >
                          <input
                            id="admissionNumber"
                            value={student.registrationNumber}
                            readOnly
                          />
                        </Field>

                        <Field label="Index number *" id="indexNumber">
                          <input
                            id="indexNumber"
                            value={student.indexNumber}
                            onChange={(e) =>
                              updateStudent("indexNumber", e.target.value)
                            }
                            placeholder="Enter your KCSE index number"
                            required
                          />
                        </Field>

                        <Field label="Level of study *" id="studyLevel">
                          <select
                            id="studyLevel"
                            value={student.studyLevel}
                            onChange={(e) =>
                              updateStudent("studyLevel", e.target.value)
                            }
                            required
                          >
                            <option>Certificate</option>
                            <option>Diploma</option>
                            <option>Undergraduate</option>
                            <option>Postgraduate</option>
                            <option>Doctoral</option>
                          </select>
                        </Field>

                        <Field label="Admission intake *" id="intake">
                          <select
                            id="intake"
                            value={student.intake}
                            onChange={(e) =>
                              updateStudent("intake", e.target.value)
                            }
                            required
                          >
                            <option value="">Select intake</option>
                            <option>January</option>
                            <option>May</option>
                            <option>September</option>
                          </select>
                        </Field>

                        <Field
                          label="School / Faculty *"
                          id="school"
                          fullWidth
                        >
                          <select
                            id="school"
                            value={student.school}
                            onChange={(e) =>
                              updateStudent("school", e.target.value)
                            }
                            required
                          >
                            <option value="">Choose your school</option>
                            {Object.keys(coursesBySchool).map((school) => (
                              <option key={school} value={school}>
                                {school}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field
                          label="Course / Programme *"
                          id="programme"
                          fullWidth
                        >
                          <select
                            id="programme"
                            value={student.programme}
                            onChange={(e) =>
                              updateStudent("programme", e.target.value)
                            }
                            required
                            disabled={!student.school}
                          >
                            <option value="">Choose your course</option>
                            {(coursesBySchool[student.school] || []).map(
                              (course) => (
                                <option key={course} value={course}>
                                  {course}
                                </option>
                              )
                            )}
                          </select>
                        </Field>
                      </div>

                      <h2 className="form-section-title">
                        4. Emergency contact
                      </h2>

                      <div className="registration-grid">
                        <Field
                          label="Contact person's full name *"
                          id="emergencyName"
                        >
                          <input
                            id="emergencyName"
                            value={student.emergencyContactName}
                            onChange={(e) =>
                              updateStudent(
                                "emergencyContactName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Field>

                        <Field
                          label="Contact person's phone *"
                          id="emergencyPhone"
                        >
                          <input
                            id="emergencyPhone"
                            type="tel"
                            value={student.emergencyContactPhone}
                            onChange={(e) =>
                              updateStudent(
                                "emergencyContactPhone",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Field>
                      </div>

                      <h2 className="form-section-title">
                        5. Letter of Acceptance Details
                      </h2>

                      <p className="page-description">
                        Enter the details shown on your university letter of
                        acceptance. You do not need to upload the document here.
                      </p>

                      <div className="registration-grid">
                        <Field
                          label="Registration number *"
                          id="acceptanceLetterNumber"
                        >
                          <input
                            id="acceptanceLetterNumber"
                            value={student.acceptanceLetterNumber || ""}
                            onChange={(e) =>
                              updateStudent(
                                "acceptanceLetterNumber",
                                e.target.value
                              )
                            }
                            placeholder="Enter your registration number"
                            required
                          />
                        </Field>

                        <Field
                          label="Date of acceptance letter *"
                          id="acceptanceLetterDate"
                        >
                          <input
                            id="acceptanceLetterDate"
                            type="date"
                            value={student.acceptanceLetterDate || ""}
                            onChange={(e) =>
                              updateStudent(
                                "acceptanceLetterDate",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Field>

                        <Field
                          label="Programme as stated in the letter *"
                          id="acceptanceLetterProgramme"
                          fullWidth
                        >
                          <input
                            id="acceptanceLetterProgramme"
                            value={student.acceptanceLetterProgramme || ""}
                            onChange={(e) =>
                              updateStudent(
                                "acceptanceLetterProgramme",
                                e.target.value
                              )
                            }
                            placeholder="Enter the programme written in your acceptance letter"
                            required
                          />
                        </Field>
                      </div>

                      <h2 className="form-section-title">
                        6. Student Declaration
                      </h2>

                      <div className="declaration-panel">
                        <p>
                          I declare that the information I have provided is
                          accurate and complete to the best of my knowledge.
                          I understand that the university may verify these
                          details.
                        </p>

                        <Field
                          label="Full name as declaration signature *"
                          id="declarationFullName"
                          fullWidth
                        >
                          <input
                            id="declarationFullName"
                            value={student.declarationFullName || ""}
                            onChange={(e) =>
                              updateStudent(
                                "declarationFullName",
                                e.target.value
                              )
                            }
                            placeholder="Type your full name to sign the declaration"
                            required
                          />
                        </Field>

                        <Field label="Declaration date *" id="declarationDate">
                          <input
                            id="declarationDate"
                            type="date"
                            value={student.declarationDate || ""}
                            onChange={(e) =>
                              updateStudent(
                                "declarationDate",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Field>

                        <label className="declaration-checkbox">
                          <input type="checkbox" required />
                          <span>
                            I confirm that the information provided is true
                            and correct. *
                          </span>
                        </label>
                      </div>

                      <div className="form-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() => setRegistrationStep(1)}
                        >
                          ← Back to account
                        </button>

                        <button className="primary-button" type="submit">
                          Submit details &amp; view provisional ID →
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </section>
          )}
                    {page === "Provisional ID" && (
            <section className="page-card id-page">
              <p className="eyebrow">STUDENT IDENTIFICATION</p>
              <h1>Provisional Student ID</h1>

              {registrationType === "continuing" &&
                codApprovalStatus === "pending" && (
                  <div className="approval-status pending">
                    <span>◷</span>
                    <div>
                      <strong>Pending COD Approval</strong>
                      <p>
                        Your request has been submitted. A provisional ID
                        cannot be issued until the COD approves it.
                      </p>
                    </div>
                  </div>
                )}

              {registrationType === "continuing" &&
                codApprovalStatus === "rejected" && (
                  <div className="approval-status rejected">
                    <span>!</span>
                    <div>
                      <strong>Request Rejected</strong>
                      <p>
                        Your request was not approved in this prototype.
                        Contact the relevant university office for guidance.
                      </p>
                    </div>
                  </div>
                )}

              {registrationType === "continuing" &&
                codApprovalStatus === "approved" && (
                  <div className="approval-status approved">
                    <span>✓</span>
                    <div>
                      <strong>COD Approval Recorded</strong>
                      <p>
                        The simulated approval is complete. Your provisional
                        ID can now be displayed.
                      </p>
                    </div>
                  </div>
                )}

              {registrationType === "continuing" &&
                codApprovalStatus === "pending" && (
                  <div className="cod-demo-panel">
                    <span className="prototype-badge">
                      PROTOTYPE DEMONSTRATION
                    </span>

                    <h2>COD Review</h2>
                    <p>
                      For demonstration purposes, use the buttons below to
                      simulate the outcome of a COD review.
                    </p>

                    <div className="student-summary">
                      <p>
                        <strong>Student:</strong>{" "}
                        {student.name || "Not provided"}
                      </p>
                      <p>
                        <strong>Registration number:</strong>{" "}
                        {student.registrationNumber || "Not provided"}
                      </p>
                      <p>
                        <strong>School:</strong>{" "}
                        {student.school || "Not provided"}
                      </p>
                      <p>
                        <strong>Programme:</strong>{" "}
                        {student.programme || "Not provided"}
                      </p>
                    </div>

                    <div className="form-actions">
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => handleCodDecision("approved")}
                      >
                        ✓ Simulate COD Approval
                      </button>

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => handleCodDecision("rejected")}
                      >
                        ✕ Simulate Rejection
                      </button>
                    </div>

                    <p className="prototype-disclaimer">
                      These buttons simulate the approval process. They do
                      not contact a real COD or authorise an official
                      university ID.
                    </p>
                  </div>
                )}

              {registrationType === "first-time" && !submitted && (
                <div className="empty-state">
                  <h2>No provisional ID available</h2>
                  <p>
                    Complete student registration before viewing your
                    provisional ID.
                  </p>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={openRegistration}
                  >
                    Complete registration →
                  </button>
                </div>
              )}

              {registrationType === "continuing" &&
                codApprovalStatus !== "approved" && (
                  <div className="empty-state">
                    <h2>ID issuance is restricted</h2>
                    <p>
                      Continuing students must receive COD approval before
                      their provisional ID becomes available.
                    </p>
                  </div>
                )}

              {submitted &&
                idIssuedAt &&
                !isIdExpired &&
                (registrationType === "first-time" ||
                  codApprovalStatus === "approved") && (
                  <>
                  <div className="provisional-id-card">
                    <div className="provisional-id-header">
                      <div className="id-brand-mark">CB</div>

                      <div className="id-heading">
                        <span>CampusBridge · Student Services</span>
                        <h2>PROVISIONAL STUDENT ID</h2>
                        <p>Student identification card</p>
                      </div>

                      <span className="id-status-pill">PROVISIONAL</span>
                    </div>

                    <div className="provisional-id-body">
                      <div className="id-student-details">
                        <div className="id-detail">
                          <span>STUDENT NAME</span>
                          <strong>
                            {student.name || "Student Name"}
                          </strong>
                        </div>

                        <div className="id-detail">
                          <span>REGISTRATION NUMBER</span>
                          <strong>
                            {student.registrationNumber || "Not provided"}
                          </strong>
                        </div>

                        <div className="id-detail">
                          <span>PROGRAMME</span>
                          <strong>
                            {student.programme || "Not provided"}
                          </strong>
                        </div>

                        <div className="id-detail">
                          <span>SCHOOL / FACULTY</span>
                          <strong>
                            {student.school || "Not provided"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="provisional-id-footer">
                      <div>
                        <span>ISSUED</span>
                        <strong>
                          {new Date(idIssuedAt).toLocaleDateString()}
                        </strong>
                      </div>

                      <div>
                        <span>VALIDITY</span>
                        <strong>
                          {registrationType === "continuing" && expiryDate
                            ? `Until ${expiryDate.toLocaleDateString()}`
                            : "As defined by the university"}
                        </strong>
                      </div>

                      <span className="id-footer-monogram">CB</span>
                    </div>

                    <div className="id-demo-notice">
                      DEMO PREVIEW · NOT AN OFFICIAL UNIVERSITY ID
                    </div>
                  </div>
                  <div className="id-download-actions">
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => window.print()}
                    >
                      Download ID as PDF
                    </button>
                    <p>In the print window, choose “Save as PDF”. Only the ID card will be included.</p>
                  </div>
                  </>
                )}

              {isIdExpired && (
                <div className="approval-status rejected">
                  <strong>Provisional ID Expired</strong>
                  <p>
                    This demonstration ID has passed its 14-day validity
                    period. Follow the university's process to request
                    another ID.
                  </p>
                </div>
              )}

              <div className="form-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setPage("Student Registration")}
                >
                  ← Back to registration
                </button>
              </div>
            </section>
          )}

          {page === "COD Review" && (
            <section className="page-card">
              <p className="eyebrow">PROTOTYPE ADMINISTRATION</p>
              <h1>COD Review Dashboard</h1>

              <p className="page-description">
                This demonstration screen illustrates how continuing
                students' provisional ID requests could be reviewed.
              </p>

              <div className="prototype-disclaimer">
                SIMULATION ONLY — this is not a secured university staff
                account or an official approval system.
              </div>

              <div className="student-summary">
                <p>
                  <strong>Student:</strong>{" "}
                  {student.name || "No student submitted"}
                </p>

                <p>
                  <strong>Registration number:</strong>{" "}
                  {student.registrationNumber || "Not provided"}
                </p>

                <p>
                  <strong>Current status:</strong>{" "}
                  {codApprovalStatus}
                </p>
              </div>

              {codApprovalStatus === "pending" ? (
                <div className="form-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => handleCodDecision("approved")}
                  >
                    Approve request
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => handleCodDecision("rejected")}
                  >
                    Reject request
                  </button>
                </div>
              ) : (
                <p>
                  There is no pending request to review. Submit a continuing
                  student's request to demonstrate the workflow.
                </p>
              )}
            </section>
          )}

          {page === "Campus Guide" && (
            <section className="campus-guide-page">
              {selectedGuideTitle ? (
                <div className="service-detail-page">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => setSelectedGuideTitle(null)}
                  >
                    ← Back to Campus Guide
                  </button>

                  <section className="service-detail-hero">
                    <div className="service-detail-icon" aria-hidden="true">🌿</div>
                    <p className="eyebrow">CAMPUSBRIDGE STUDENT GUIDE</p>
                    <h1>{selectedGuideTitle}</h1>
                    <p>Practical guidance to help you navigate this university service with confidence.</p>
                    <span className="service-detail-tag">Practical student guidance</span>
                  </section>

                  <div className="service-detail-body">
                    <section className="service-detail-feature">
                      <span className="service-detail-kicker">CAMPUSBRIDGE SERVICE GUIDE</span>
                      <h2>{selectedGuideTitle} — practical guide</h2>
                      <p>Use these steps and tips to plan ahead, find the right support, and confirm current information through official university channels.</p>
                    </section>
                    <section className="service-detail-content">

                    {selectedGuideTitle === "Enrolment Guidance" && (
                      <div className="guide-detail-content">
                        <h3>From admission to your first lecture</h3>
                        <ol>
                          <li>Check the programme entry requirements and application route on the official MUT website or KUCCPS.</li>
                          <li>Download and read your admission letter and joining instructions from the relevant admissions portal.</li>
                          <li>Prepare the required documents, including your admission letter, academic results, identification, passport photos and fee-payment evidence. Check your own joining instructions for the final list.</li>
                          <li>Apply for student funding early if eligible, and keep confirmation of every application.</li>
                          <li>Report on the date and at the place stated by MUT, complete the required registration steps, and attend your school orientation.</li>
                        </ol>
                        <h3>Set up the Student Portal</h3>
                        <ol>
                          <li>Complete the admission details required for verification.</li>
                          <li>Open <a href="https://studentportal.mut.ac.ke" target="_blank" rel="noreferrer">the MUT Student Portal</a>.</li>
                          <li>Use “Forgot Password” if you need to set your password; follow the one-time code sent to your registered email.</li>
                          <li>Sign in, check your details and fee statement, select the correct semester and register the units required for your programme.</li>
                          <li>Save or print the registration confirmation, then open <a href="https://masomo.mut.ac.ke" target="_blank" rel="noreferrer">Masomo</a> for your courses, notes and assignments.</li>
                        </ol>
                        <p><strong>Important:</strong> Reporting dates, entry requirements, fees and processes may change. Check the latest official notice rather than relying on old dates in a guide.</p>
                      </div>
                    )}

                    {selectedGuideTitle === "Funding and Student Finance" && (
                      <div className="guide-detail-content">
                        <h3>Paying university fees</h3>
                        <ol>
                          <li>Check the current fee structure and your personal fee-payment letter on the official MUT website or admissions portal.</li>
                          <li>Pay only to a university account confirmed in current official instructions. Do not pay a personal account or rely on account details forwarded by an individual.</li>
                          <li>Keep your bank slip or payment confirmation and contact Finance if the payment does not appear on your statement. Do not pay a second time before the first payment is checked.</li>
                        </ol>
                        <h3>HELB / Higher Education Financing (HEF)</h3>
                        <p>First-time applicants should use the official <a href="https://www.hef.co.ke" target="_blank" rel="noreferrer">HEF portal</a> and follow its current requirements. Continuing applicants should follow the current subsequent-application instructions, which may include the official USSD or HELB app route. Prepare the identification, admission, family and guarantor details requested by the portal, apply early, and save proof of submission. Application is free.</p>
                        <h3>MUTSO bursary</h3>
                        <p>Check the current MUTSO bursary form and ask the Dean of Students’ office about eligibility, supporting documents, required recommendations, signing order and deadline. The guide describes a form that records fee balance, family circumstances, other funding and referees; requirements should be reconfirmed for the current application.</p>
                        <h3>Work-study and scholarships</h3>
                        <p>Watch official MUT notices for semester work-study calls and deadlines. Follow the notice’s application form, signed form and referral-letter requirements. For scholarships, read each opportunity’s eligibility rules, documents and closing date on the official MUT scholarship page. Selection, amounts and dates can change.</p>
                        <p><strong>Safety:</strong> Never pay someone to apply for HELB/HEF or a scholarship, and never assume a past deadline is still open.</p>
                      </div>
                    )}

                    {selectedGuideTitle === "Hostel Booking" && (
                      <div className="guide-detail-content">
                        <h3>Booking a university hostel</h3>
                        <ol>
                          <li>Read your admission letter and joining instructions first.</li>
                          <li>Open the <a href="https://admissions.mut.ac.ke" target="_blank" rel="noreferrer">MUT Admissions Portal</a> and look for the current hostel booking instructions or form.</li>
                          <li>Follow the verification and booking steps shown by MUT. Availability is not guaranteed until the university confirms your booking.</li>
                          <li>Keep the confirmation and payment evidence, and check the stated check-in date, room rules and what to bring.</li>
                        </ol>
                        <h3>If you need off-campus housing</h3>
                        <p>Compare distance to campus, rent and deposit, water and electricity, transport, security, access routes and house rules. Visit the property, confirm who is authorised to rent it, get the agreement and receipts in writing, and avoid sending money before verifying the place.</p>
                        <p>Hostel availability, fees and booking dates can change each intake. Confirm current details directly with MUT before making travel plans.</p>
                      </div>
                    )}

                    {selectedGuideTitle === "Campus Venues" && (
                      <div className="guide-detail-content">
                        <h3>Finding your way around campus</h3>
                        <p>Use the campus map, your school or department noticeboard, and directions from authorised university staff to locate lecture rooms, teaching blocks, laboratories, offices and meeting venues. Check the room and building named on your timetable before heading to class.</p>
                        <ul>
                          <li>For a new class or appointment, allow time to find the building.</li>
                          <li>Ask your class representative, school office or lecturer if a room location is unclear.</li>
                          <li>Follow signs and access instructions, and do not enter restricted laboratories or offices without permission.</li>
                          <li>Check official notices for changes to venues, events or reporting locations.</li>
                        </ul>
                      </div>
                    )}

                    {selectedGuideTitle === "Dining and Amenities" && (
                      <div className="guide-detail-content">
                        <h3>Meals and everyday needs</h3>
                        <p>Explore the dining facilities available on campus and nearby food options. Opening hours, menus and prices may change, so check with the provider before relying on a particular service.</p>
                        <ul>
                          <li>Plan a realistic meal budget alongside transport, printing, data and other daily expenses.</li>
                          <li>Check food prices and portion sizes before ordering, and keep money for the rest of the day.</li>
                          <li>If you have an allergy or dietary requirement, ask staff about ingredients and preparation.</li>
                          <li>Use authorised shops and service points, keep your belongings secure and dispose of waste responsibly.</li>
                        </ul>
                        <p><strong>Funding belongs in the student-finance service:</strong> information on HELB/HEF, bursaries, work-study and scholarships is available under “Funding and Student Finance,” not as dining information.</p>
                      </div>
                    )}

                    {selectedGuideTitle === "Campus Facilities" && (
                      <div className="guide-detail-content">
                        <h3>Library, learning and student services</h3>
                        <ul>
                          <li><strong>Library and e-resources:</strong> use the <a href="https://opac.mut.ac.ke" target="_blank" rel="noreferrer">library catalogue</a> to look for materials and <a href="https://app.myloft.xyz" target="_blank" rel="noreferrer">MyLOFT</a> for available e-books and journals. Follow the library’s account and access instructions.</li>
                          <li><strong>Masomo e-learning:</strong> sign in at <a href="https://masomo.mut.ac.ke" target="_blank" rel="noreferrer">Masomo</a> to find course materials, lectures, assignments and forums. If a course is missing, check with the lecturer or e-learning support.</li>
                          <li><strong>Health Centre:</strong> follow current instructions for student medical registration and carry any forms or documents requested by the university.</li>
                          <li><strong>Safety and emergencies:</strong> stay calm, contact campus security or the appropriate emergency service, give a clear location, and avoid moving an injured person unless there is immediate danger.</li>
                          <li><strong>Clubs and sports:</strong> identify clubs that match your interests and ask the Dean of Students or the club officials about joining. Students wishing to start a club should ask for the current application, constitution and staff-patron requirements.</li>
                        </ul>
                      </div>
                    )}

                    {selectedGuideTitle === "Parent & Student Support Centre" && (
                      <div className="guide-detail-content">
                        <h3>Helping families understand university life</h3>
                        <ul>
                          <li>University life differs from secondary school. Students manage their own time, attend classes, complete assignments, use learning resources and make responsible decisions.</li>
                          <li>Ask the student how classes, assignments and campus life are going. Listen calmly before giving advice.</li>
                          <li>Learn important university dates and use official channels for accurate information.</li>
                          <li>Understand that students need time for classes, library work, group discussions, rest and personal activities.</li>
                          <li>Agree on reasonable times to call or message while giving the student space to study and participate in campus life.</li>
                        </ul>
                        <h3>Practical ways to offer support</h3>
                        <ul>
                          <li>Encourage the student to seek help early from their lecturer, school office, Dean of Students, counsellor or Health Centre when a problem arises.</li>
                          <li>Discuss budgeting, accommodation, personal safety and balancing study with rest in a respectful way.</li>
                          <li>Support independence while remaining available for difficult decisions. Avoid assuming that silence means everything is wrong; ask open questions and agree on how to stay in touch.</li>
                          <li>For official information, start at <a href="https://www.mut.ac.ke" target="_blank" rel="noreferrer">the MUT website</a> and use the relevant university office rather than unverified social-media posts.</li>
                        </ul>
                      </div>
                    )}
                  </section>
                    <section className="service-guidebook-card">
                      <div>
                        <p className="eyebrow">NEED MORE INFORMATION?</p>
                        <h3>Read the full CampusBridge Guidebook</h3>
                        <p>Open the complete guidebook for additional student information and practical guidance.</p>
                      </div>
                      <a className="service-guidebook-button" href="/CampusBridge_Guidebook.pdf" target="_blank" rel="noopener noreferrer">Open Full Guidebook <span aria-hidden="true">↗</span></a>
                    </section>
                    <div className="guide-detail-footer">
                      <span>CampusBridge · Student information guide</span>
                      <span>Confirm details with official sources</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <section className="guide-hero">
                    <div className="guide-hero-copy">
                      <p className="eyebrow">YOUR CAMPUS, MADE EASIER</p>
                      <h1>Explore your Campus Guide</h1>
                      <p>
                        Find your way around campus and discover services
                        that can help you settle in.
                      </p>
                    </div>

                    <div className="guide-hero-art" aria-hidden="true">
                      🧭
                    </div>
                  </section>

                  <div className="guide-search-wrap">
                    <span aria-hidden="true">⌕</span>

                    <input
                      className="guide-search"
                      type="search"
                      value={guideQuery}
                      onChange={(event) =>
                        setGuideQuery(event.target.value)
                      }
                      placeholder="Search campus services..."
                      aria-label="Search campus services"
                    />
                  </div>

                  <div className="guide-grid">
                    {[
                      {
                        title: "Campus Facilities",
                        description: "Library, MyLOFT, Masomo, health services, safety and student clubs.",
                        icon: "🎓",
                        photo: 1,
                      },
                      {
                        title: "Hostel Booking",
                        description: "Hostel booking steps, reporting preparations and safe housing guidance.",
                        icon: "🛏️",
                        photo: 2,
                      },
                      {
                        title: "Enrolment Guidance",
                        description: "Admission, reporting, Student Portal setup and unit registration.",
                        icon: "📋",
                        photo: 3,
                      },
                      {
                        title: "Dining and Amenities",
                        description: "Campus meals, everyday services and practical student budgeting.",
                        icon: "🍽️",
                        photo: 4,
                      },
                      {
                        title: "Campus Venues",
                        description: "Find teaching spaces, offices, meeting venues and campus facilities.",
                        icon: "📍",
                        photo: 5,
                      },
                      {
                        title: "Funding and Student Finance",
                        description: "HELB/HEF, MUTSO bursary, work-study and scholarship guidance.",
                        icon: "🎓",
                        photo: 3,
                      },
                      {
                        title: "Parent & Student Support Centre",
                        description: "Help families support student wellbeing, communication and independence.",
                        icon: "👨‍👩‍👧",
                        photo: 1,
                      },
                    ]
                      .filter((item) =>
                        `${item.title} ${item.description}`
                          .toLowerCase()
                          .includes(guideQuery.trim().toLowerCase())
                      )
                      .map((item) => (
                        <article className="guide-card" key={item.title}>
                          <div className={`guide-card-photo guide-photo-${item.photo}`}>
                            <span className="guide-card-icon">
                              {item.icon}
                            </span>
                          </div>

                          <div className="guide-card-content">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                          </div>

                          <button
                            className="guide-open-button"
                            type="button"
                            onClick={() =>
                              setSelectedGuideTitle(item.title)
                            }
                          >
                            View service details →
                          </button>
                        </article>
                      ))}
                  </div>

                  <div className="guide-notice">
                    <strong>ⓘ Please note</strong>
                    <p>
                      This is a prototype guide. Confirm current service
                      details with official university sources.
                    </p>
                  </div>
                </>
              )}
            </section>
          )}

          <footer className="page-footer">
            <span>CampusBridge © 2026</span>
            <span>Built to help students settle in.</span>
          </footer>
        </div>
      </main>
      <CampusBridgeAIAssistant />
    </div>
  );
}

function Field({
  label,
  id,
  fullWidth = false,
  children,
}: {
  label: string;
  id: string;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`form-field ${fullWidth ? "full-width" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  action,
  onClick,
}: {
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>

      <button
        className="text-button"
        onClick={onClick}
        type="button"
      >
        {action}
      </button>
    </article>
  );
}

export default App;