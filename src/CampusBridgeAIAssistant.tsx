
import { useState, useRef, useEffect } from "react";
import "./CampusBridgeAIAssistant.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type KnowledgeItem = {
  keywords: string[];
  answer: string;
};

const campusKnowledge: KnowledgeItem[] = [
  {
    keywords: ["admission", "apply", "application", "kuccps", "kcse"],
    answer:
      "ADMISSION TO MUT\n\nYou can apply through two main routes:\n\n1. KUCCPS: For government-sponsored placements. Visit https://kuccps.net\n\n2. Direct application: Apply through the MUT Admissions Portal at https://admissions.mut.ac.ke\n\nAfter receiving your admission letter, read the joining instructions and prepare the required documents.\n\nConfirm current requirements and deadlines at https://www.mut.ac.ke",
  },
  {
    keywords: ["student portal", "portal", "forgot password", "otp", "login"],
    answer:
      "STUDENT PORTAL\n\nVisit https://studentportal.mut.ac.ke\n\nTo set up your password:\n1. Open the Student Portal.\n2. Select Forgot Password.\n3. Enter your admission number.\n4. Request an OTP.\n5. Check your registered email for the code.\n6. Create a new password.\n7. Sign in.\n\nIf your admission number is not accepted, contact Admissions at info@mut.ac.ke or +254 705 939 269.",
  },
  {
    keywords: ["hostel", "hostels", "booking", "room", "residence"],
    answer:
      "HOSTEL BOOKING\n\nFirst-year students can access the on-campus hostel booking form through the Admissions Portal:\nhttps://admissions.mut.ac.ke\n\nThe guidebook reports a subsidised on-campus hostel fee of KSh 15,800 per academic year, but availability and prices must be confirmed with MUT.\n\nFor off-campus accommodation, visit the hostel before paying. Check the rent, deposit terms, water, electricity, Wi-Fi and house rules.\n\nNever pay a deposit before verifying the accommodation.",
  },
  {
    keywords: ["accommodation", "rent", "bedsitter", "off campus", "housing"],
    answer:
      "STUDENT ACCOMMODATION\n\nStudents can explore on-campus hostels and off-campus accommodation around Murang'a.\n\nAreas mentioned in the CampusBridge Guidebook include Mjini, Kiharu, Kongo Ini, Mukuyu, Maragi and Kabuta.\n\nThe guidebook also lists several MUT-approved hostels, but its list is for 2024/2025. Confirm the current approved list and rent before booking.\n\nAlways visit the accommodation and inspect it before paying.",
  },
  {
    keywords: ["dining", "food", "meals", "cafeteria", "eat", "restaurant"],
    answer:
      "DINING AND AMENITIES\n\nMUT has a pay-as-you-eat dining hall for students and a staff cafeteria.\n\nFor current meal options, prices and operating hours, check directly with the university's Catering and Accommodation office.\n\nThe CampusBridge Guidebook does not provide a confirmed current menu or meal prices.",
  },
  {
    keywords: ["fee", "fees", "payment", "bank", "finance", "tuition"],
    answer:
      "PAYING UNIVERSITY FEES\n\n1. Check your programme's fee structure on https://www.mut.ac.ke\n2. Read the fee payment letter that comes with your admission documents.\n3. Use only the official university bank details.\n4. Keep your payment slip.\n5. Present your payment proof to the Finance Office for confirmation.\n\nDo not rely on bank account details from old documents without confirming them with MUT Finance.",
  },
  {
    keywords: ["helb", "hef", "loan", "scholarship", "funding"],
    answer:
      "HELB AND STUDENT FUNDING\n\nThe Higher Education Financing portal is https://www.hef.co.ke\n\nFirst-time applicants can register through the portal using their national ID or KCSE index number where applicable.\n\nContinuing students can use the Safaricom USSD route *642# or the HELB app.\n\nGather the documents requested and save your application confirmation.\n\nApplication dates and requirements change. Check the official HEF portal for current information.",
  },
  {
    keywords: ["bursary", "mutso bursary", "financial assistance"],
    answer:
      "MUTSO BURSARY\n\nThe CampusBridge Guidebook explains that students experiencing financial difficulties can enquire about the MUTSO bursary through the Dean of Students.\n\nThe form includes student details, fee balance, family circumstances and two referees.\n\nThe guidebook describes recommendations from a Chief or Assistant Chief and a religious leader.\n\nAsk the Dean of Students for the current form, submission deadline and requirements. These details can change.",
  },
  {
    keywords: ["work study", "work-study", "jobs", "employment", "student work"],
    answer:
      "WORK-STUDY OPPORTUNITIES\n\nMUT advertises work-study opportunities through semester notices.\n\nStudents should:\n1. Watch university announcements.\n2. Read the eligibility requirements.\n3. Complete the application form linked in the notice.\n4. Submit the signed form and required referral letters.\n\nSelection, payment rates and working hours should be confirmed from the current university notice.\n\nWebsite: https://www.mut.ac.ke",
  },
  {
    keywords: ["library", "myloft", "books", "journals", "research", "ebooks"],
    answer:
      "MUT LIBRARY AND MYLOFT\n\nMyLOFT gives students access to electronic books, journal articles and research databases.\n\nTo get started:\n1. Visit https://app.myloft.xyz\n2. Select Sign Up.\n3. Enter your registration number, name and email.\n4. Verify your email.\n5. Select Murang'a University of Technology when logging in.\n6. Open E-resources to explore databases.\n\nLibrary email: libraryinfo@mut.ac.ke\nLibrary phone: +254 758 438 550\n\nLibrary catalogue: https://opac.mut.ac.ke",
  },
  {
    keywords: ["masomo", "elearning", "e-learning", "notes", "lectures", "assignments"],
    answer:
      "MASOMO E-LEARNING PORTAL\n\nVisit https://masomo.mut.ac.ke\n\nYour Masomo account is created after successful unit registration on the Student Portal.\n\nYou can use Masomo to:\n- Access lecture notes.\n- View learning materials.\n- Watch recorded lectures.\n- Participate in discussions.\n- Submit assignments.\n- Check available timetables.\n\nIf a unit is missing, first confirm that you registered it on the Student Portal.\n\nSupport: odel@mut.ac.ke or +254 746 487 175.",
  },
  {
    keywords: ["health", "clinic", "medical", "hospital", "doctor"],
    answer:
      "MUT HEALTH SERVICES\n\nThe CampusBridge Guidebook describes the University Clinic as providing basic medical services.\n\nFor admission medical registration, the guidebook refers to:\n1. Form ADM 04 for the medical examination.\n2. A sealed medical report.\n3. Form ADM 09 for student personal details.\n\nUniversity CMO contact listed in the guidebook: +254 724 140 569.\n\nFor an emergency in Kenya, call 112 or 999. Confirm current clinic arrangements with MUT.",
  },
  {
    keywords: ["counselling", "counselor", "counsellor", "stress", "mental health"],
    answer:
      "GUIDANCE AND COUNSELLING\n\nThe CampusBridge Guidebook lists individual, group, family and crisis counselling, as well as career and study guidance.\n\nEmail: counsellor@mut.ac.ke\nPhone: 0114 713 010\n\nThe guidebook locates the counselling service on Ufundi Drive, opposite the Mechanical Engineering Workshop.\n\nPlease confirm current arrangements with the university.",
  },
  {
    keywords: ["clubs", "societies", "sports", "dance", "culture", "activities"],
    answer:
      "CLUBS, SPORTS AND CAMPUS ACTIVITIES\n\nMUT students can explore:\n- Sports such as football, basketball, rugby and karate.\n- Drama, music and dance.\n- Faith-based groups.\n- Community service organisations.\n- Academic and professional associations.\n\nTo join, contact the Dean of Students office and ask about current club officials, meeting places and activities.\n\nGeneral university contact: info@mut.ac.ke",
  },
  {
    keywords: ["parent", "parents", "guardian", "family", "community"],
    answer:
      "PARENT, GUARDIAN AND COMMUNITY SUPPORT\n\nCampusBridge encourages parents and guardians to:\n\n1. Communicate openly with students.\n2. Listen before giving advice.\n3. Understand academic and financial challenges.\n4. Respect students' privacy and independence.\n5. Encourage responsible budgeting and time management.\n6. Use official university channels when confirming information.\n\nStudents and neighbours should also respect one another, rental agreements and shared spaces.",
  },
  {
    keywords: ["contact", "phone", "email", "address", "office", "helpdesk"],
    answer:
      "MUT GENERAL CONTACT INFORMATION\n\nWebsite: https://www.mut.ac.ke\nEmail: info@mut.ac.ke\nPhone: +254 798 959 217\nAlternative phone: +254 771 370 824\nWeekday line: +254 705 939 269\n\nWorking hours listed in the CampusBridge Guidebook: Monday to Friday, 8:00 a.m. to 5:00 p.m.\n\nPostal address: P.O. Box 75-10200, Murang'a, Kenya.\n\nFor technical problems, visit https://helpdesk.mut.ac.ke",
  },
  {
    keywords: ["provisional id", "temporary id", "student id", "identification"],
    answer:
      "PROVISIONAL STUDENT ID\n\nCampusBridge is designed to generate a provisional student ID while a new student waits for the official university ID.\n\nPlease remember:\n- The ID generated by this prototype is not an official MUT student ID.\n- It does not replace university verification or approval.\n- Confirm its permitted use with MUT before presenting it as identification.\n\nYour registration number should be kept accurate in your CampusBridge profile.",
  },
  {
    keywords: ["venue", "location", "building", "directions", "campus map", "where is"],
    answer:
      "CAMPUS LOCATIONS AND VENUES\n\nCampusBridge's Campus Guide is designed to help students find university buildings, offices and facilities.\n\nFor a specific room or office, contact the relevant school or the Dean of Students office. The guidebook does not provide confirmed room numbers for every office.\n\nStart with the official MUT website: https://www.mut.ac.ke",
  },
  {
    keywords: ["registration", "register units", "unit registration", "semester"],
    answer:
      "UNIT REGISTRATION\n\n1. Open https://studentportal.mut.ac.ke\n2. Sign in using your student details.\n3. Select the correct semester.\n4. Choose the units required for your programme.\n5. Submit your registration.\n6. Save or print your registration record.\n7. Open Masomo to access your learning materials.\n\nIf a unit is missing, contact your school or department for guidance.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer:
      "Hello! Welcome to CampusBridge. 😊\n\nI can help you find information about MUT admission, registration, provisional IDs, hostels, accommodation, dining, fees, student funding, Masomo, the library, clubs and student support.\n\nWhat would you like to know?",
  },
  {
    keywords: ["what can you do", "help me", "services", "what services"],
    answer:
      "WELCOME TO CAMPUSBRIDGE!\n\nI can help you explore:\n\n1. Admission and enrolment guidance.\n2. Student Portal and unit registration.\n3. Provisional student IDs.\n4. Hostel booking and accommodation.\n5. Dining and campus amenities.\n6. Fees, HELB, bursaries and work-study.\n7. Library and MyLOFT resources.\n8. Masomo e-learning.\n9. Health and counselling services.\n10. Clubs, sports and student activities.\n11. Parent, guardian and community support.\n\nAsk me about any of these services.",
  },
];

function findOfflineAnswer(question: string): string {
  const normalised = question.toLowerCase().replace(/[^\w\s-]/g, " ");

  const words = normalised
    .split(/\s+/)
    .filter((word) => word.length > 2);

  let bestItem: KnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of campusKnowledge) {
    let score = 0;

    for (const keyword of item.keywords) {
      const normalKeyword = keyword.toLowerCase();

      if (normalised.includes(normalKeyword)) {
        score += normalKeyword.includes(" ")
          ? 4
          : 2;
      } else if (words.includes(normalKeyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && bestScore > 0) {
    return bestItem.answer;
  }

  return (
    "I could not find a direct answer to that question in my current CampusBridge information.\n\n" +
    "You can try asking about:\n" +
    "- Admission and registration\n" +
    "- Student Portal and Masomo\n" +
    "- Hostel booking and accommodation\n" +
    "- Fees and student funding\n" +
    "- Campus facilities and venues\n" +
    "- Student and parent support\n\n" +
    "You can also open the complete CampusBridge Guidebook here:\n" +
    "/CampusBridge_Guidebook.pdf\n\n" +
    "For official information, visit https://www.mut.ac.ke"
  );
}

type SpeechRecognitionResultEvent = Event & {
  results: ArrayLike<
    ArrayLike<{ transcript: string }>
  >;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function CampusBridgeAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Welcome to CampusBridge. I'm your student information assistant. Ask me about Murang'a University of Technology.",
    },
  ]);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speakResponse(text: string) {
    if (!voiceEnabled || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-KE";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  async function sendMessage(messageText?: string) {
    const question = (messageText ?? input).trim();

    if (!question || loading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Free offline information mode.
    // No OpenAI API call or billing is required.
    await new Promise((resolve) => setTimeout(resolve, 350));

    const reply = findOfflineAnswer(question);

    setMessages([
      ...updatedMessages,
      { role: "assistant", content: reply },
    ]);

    speakResponse(reply);
    setLoading(false);
  }

  function startVoiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Voice input is not supported by this browser. Please use the text box instead.",
        },
      ]);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-KE";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;

      if (transcript) {
        setInput(transcript);
        void sendMessage(transcript);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  function clearConversation() {
    window.speechSynthesis?.cancel();

    setMessages([
      {
        role: "assistant",
        content:
          "Hello again! Welcome to CampusBridge. How can I help you today?",
      },
    ]);
  }

  return (
    <div className="cb-assistant">
      <button
        type="button"
        className="cb-assistant-launcher"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Open CampusBridge AI Assistant"
      >
        {isOpen ? "✕ Close Assistant" : "💬 Ask CampusBridge"}
      </button>

      {isOpen && (
        <section
          className="cb-assistant-window"
          aria-label="CampusBridge Assistant chat"
        >
          <header className="cb-assistant-header">
            <div className="cb-assistant-brand">
              <div className="cb-assistant-avatar">CB</div>

              <div>
                <strong>CampusBridge Assistant</strong>
                <small>Student information support</small>
              </div>
            </div>

            <div className="cb-assistant-header-actions">
              <button
                type="button"
                onClick={clearConversation}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                ↻
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </header>

          <div className="cb-assistant-welcome">
            Ask about registration, provisional IDs, accommodation,
            campus facilities and student services.
          </div>

          <div className="cb-assistant-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`cb-assistant-message ${message.role}`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="cb-assistant-message assistant">
                Searching CampusBridge information...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="cb-assistant-voice-setting">
            <label>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(event) =>
                  setVoiceEnabled(event.target.checked)
                }
              />
              Read responses aloud
            </label>
          </div>

          <form
            className="cb-assistant-input"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <button
              type="button"
              className={`cb-assistant-mic ${
                listening ? "listening" : ""
              }`}
              onClick={startVoiceRecognition}
              disabled={loading}
              title="Use voice input"
              aria-label="Use voice input"
            >
              {listening ? "🔴" : "🎤"}
            </button>

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                listening
                  ? "Listening..."
                  : "Ask me anything about MUT..."
              }
              disabled={loading}
            />

            <button
              type="submit"
              className="cb-assistant-send"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>

          <footer className="cb-assistant-footer">
            CampusBridge Information Assistant · Free Mode
          </footer>
        </section>
      )}
    </div>
  );
}
