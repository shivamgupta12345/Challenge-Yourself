import { useState, useEffect } from "react";
import quotes from "./data/quotes";

import "./App.css";

import jsPDF from "jspdf";

import Confetti from "react-confetti";

import { db }
from "./firebase";

import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import {
  CircularProgressbar
} from "react-circular-progressbar";

import
"react-circular-progressbar/dist/styles.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {
  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem("challengeTracker");

    return saved
      ? JSON.parse(saved)
      : [
          
  {
  id: 1,
  title: "365 Days Coding",
  targetDays: 365,
  currentDay: 0,
  streak: 0,
  lastCompleted: "",
  lastCompletionISO: "",

  todayNote: "",

  dailyLogs: [],
  achievements: []
}
        ];
  });

  const [newChallenge, setNewChallenge] = useState("");

  const [searchTerm, setSearchTerm] =
  useState("");

  const [targetDays, setTargetDays] =
  useState(365);

const [showConfetti, setShowConfetti] =
  useState(false);

const [achievement, setAchievement] =
  useState("");

  const [showHistory, setShowHistory] =
  useState(null);

  const [
  showAchievements,
  setShowAchievements
] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("darkMode");

    return savedTheme
      ? JSON.parse(savedTheme)
      : true;
  });

  const userId =
  "shivam-tracker";

  const [isLoading, setIsLoading] =
  useState(true);

  useEffect(() => {

  if (isLoading)
    return;

  localStorage.setItem(
    "challengeTracker",
    JSON.stringify(
      challenges
    )
  );

  saveToFirebase(
    challenges
  );

}, [challenges, isLoading]);

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );
  }, [darkMode]);

  const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

    useEffect(() => {

  loadFromFirebase();

}, []);

    const saveToFirebase =
  async (
    updatedChallenges
  ) => {

    // alert("saveToFirebase entered");

    try {

      // alert("Before setDoc");

      await setDoc(
        doc(
          db,
          "challengeTracker",
          userId
        ),
        {
          challenges:
            updatedChallenges
        }
      );

      // alert("After setDoc");

      console.log(
        "☁️ Saved to Firebase"
      );

//       alert(
//   "Firebase Save Success"
// );

    } catch (error) {

  alert(
    "ERROR: " +
    error.message
  );

  console.error(error);
}};

const loadFromFirebase =
  async () => {

    try {

      const docRef =
        doc(
          db,
          "challengeTracker",
          userId
        );

      const docSnap =
        await getDoc(
          docRef
        );

      if (
        docSnap.exists()
      ) {

        const data =
          docSnap.data();

        setChallenges(
          data.challenges ||
          []
        );

        setIsLoading(false);
      }

        else {

  setIsLoading(false);

}

        console.log(
          "☁️ Loaded from Firebase"
        );
      

    } catch (error) {

      console.error(
        error
      );
    }
  };

  const addChallenge = () => {
    if (!newChallenge.trim()) return;

    setChallenges([
      ...challenges,
      {
  id: Date.now(),
  title: newChallenge,
  targetDays:
    Number(targetDays) || 365,
  currentDay: 0,
  streak: 0,
  lastCompleted: "",
  lastCompletionISO: "",
  todayNote: "",

  dailyLogs: [],
  achievements: []
}
    ]);

    setNewChallenge("");
    setTargetDays(365);
  };

  const deleteChallenge = (id) => {
    const confirmDelete = window.confirm(
      "Delete this challenge?"
    );

    if (!confirmDelete) return;

    setChallenges(
      challenges.filter(
        (challenge) =>
          challenge.id !== id
      )
    );
  };

  const completeDay = (id) => {

  const today = new Date();

  const todayISO =
  today.toLocaleDateString("en-CA");

  setChallenges(
    challenges.map((challenge) => {

      if (
        challenge.id !== id
      ) {
        return challenge;
      }

      // Already completed today
      if (
        challenge.lastCompletionISO ===
        todayISO
      ) {

        alert(
          "✅ Already completed today!"
        );

        return challenge;
      }

      let newStreak = 1;

      if (
        challenge.lastCompletionISO
      ) {

        const yesterday =
          new Date();

        yesterday.setDate(
          yesterday.getDate() - 1
        );

        const yesterdayISO =
          yesterday
            .toISOString()
            .split("T")[0];

        if (
          challenge.lastCompletionISO ===
          yesterdayISO
        ) {

          newStreak =
            challenge.streak + 1;
        }
      }

      const newDay =
  challenge.currentDay <
  challenge.targetDays
    ? challenge.currentDay + 1
    : challenge.targetDays;
    
    const newLogs = [

  ...(challenge.dailyLogs ||
    []),

  {
    day:
      challenge.currentDay + 1,

    date:
      today.toLocaleDateString(),

    note:
      challenge.todayNote
  }
];

const newAchievements = [
  ...(challenge.achievements || [])
];

const progressPercent =
  (newDay /
    challenge.targetDays) *
  100;

  if (
  progressPercent >= 25 &&
  !newAchievements.some(
    a => a.badge === "Bronze"
  )
) {

  setAchievement(
    "🥉 Bronze Badge Unlocked!"
  );

  newAchievements.push({
    badge: "Bronze",
    date:
      today.toLocaleDateString()
  });
}

if (
  progressPercent >= 50 &&
  !newAchievements.some(
    a => a.badge === "Silver"
  )
) {

  setAchievement(
    "🥈 Silver Badge Unlocked!"
  );

  newAchievements.push({
    badge: "Silver",
    date:
      today.toLocaleDateString()
  });
}

if (
  progressPercent >= 75 &&
  !newAchievements.some(
    a => a.badge === "Gold"
  )
) {

  setAchievement(
    "🥇 Gold Badge Unlocked!"
  );

  newAchievements.push({
    badge: "Gold",
    date:
      today.toLocaleDateString()
  });
}

if (
  progressPercent >= 100 &&
  !newAchievements.some(
    a => a.badge === "Legend"
  )
) {

  setAchievement(
    "👑 Legend Badge Unlocked!"
  );

  newAchievements.push({
    badge: "Legend",
    date:
      today.toLocaleDateString()
  });
}
  
  // console.log(
  // "🎉 Confetti Triggered"
  // );
  //alert("Confetti Triggered");

          setShowConfetti(true);

setTimeout(() => {
  setShowConfetti(false);
}, 3000);

      return {
  ...challenge,

  currentDay:
    newDay,

  streak:
    newStreak,

  lastCompleted:
    today.toLocaleDateString(),

  lastCompletionISO:
    todayISO,

  dailyLogs:
    newLogs,

    achievements:
  newAchievements,

  todayNote: ""
};
    })
  );
};

  const updateNotes = (
  id,
  note
) => {

  setChallenges(
    challenges.map(
      (challenge) =>
        challenge.id === id
          ? {
              ...challenge,
              todayNote:
                note
            }
          : challenge
    )
  );
};

const editChallenge = (id) => {
  const newTitle = prompt(
    "Enter new challenge name:"
  );

  if (!newTitle || !newTitle.trim())
    return;

  setChallenges(
    challenges.map((challenge) =>
      challenge.id === id
        ? {
            ...challenge,
            title: newTitle
          }
        : challenge
    )
  );
};

const editTargetDays = (id) => {

  const newTarget =
    prompt(
      "Enter new target days:"
    );

  if (
    !newTarget ||
    isNaN(newTarget) ||
    Number(newTarget) < 1
  ) {
    return;
  }

  setChallenges(
    challenges.map(
      (challenge) =>
        challenge.id === id
          ? {
              ...challenge,
              targetDays:
                Number(
                  newTarget
                )
            }
          : challenge
    )
  );
};

const exportPDF = () => {

  const doc =
    new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "365 Challenge Tracker Report",
    20,
    20
  );

  doc.setFontSize(12);

  let y = 40;

  challenges.forEach(
    (challenge, index) => {

      doc.text(
        `${index + 1}. ${
          challenge.title
        }`,
        20,
        y
      );

      y += 10;

      doc.text(
        `Progress: ${
          challenge.currentDay
        } / ${
          challenge.targetDays
        }`,
        25,
        y
      );

      y += 10;

      doc.text(
        `Streak: ${
          challenge.streak
        }`,
        25,
        y
      );

      y += 10;

      doc.text(
        `Badge: ${getBadge(
          challenge.currentDay,
          challenge.targetDays
        )}`,
        25,
        y
      );

      y += 15;
    }
  );

  doc.save(
    "Challenge_Report.pdf"
  );
};

const exportChallengePDF = (
  challenge
) => {

  const doc =
    new jsPDF();

  doc.setFontSize(20);

  doc.text(
    `${challenge.title} Report`,
    20,
    20
  );

  doc.setFontSize(12);

  let y = 40;

  doc.text(
    `Progress: ${
      challenge.currentDay
    } / ${
      challenge.targetDays
    }`,
    20,
    y
  );

  y += 10;

doc.text(
  `Completion: ${Math.round(
    (
      challenge.currentDay /
      challenge.targetDays
    ) * 100
  )}%`,
  20,
  y
);

y += 10;

doc.text(
  `Target Days: ${
    challenge.targetDays
  }`,
  20,
  y
);

y += 10;

doc.text(
  `Last Completed: ${
    challenge.lastCompleted ||
    "Not Yet"
  }`,
  20,
  y
);

  y += 10;

  doc.text(
    `Streak: ${
      challenge.streak
    }`,
    20,
    y
  );

  y += 10;

  const badge =
  getBadge(
    challenge.currentDay,
    challenge.targetDays
  );

const cleanBadge =
  badge.replace(
    /[^\x00-\x7F]/g,
    ""
  );

doc.text(
  `Badge: ${cleanBadge}`,
  20,
  y
);

y += 20;

doc.setFontSize(16);

doc.text(
  "Achievements",
  20,
  y
);

y += 12;

if (
  challenge.achievements
    ?.length
) {

  challenge.achievements.forEach(
    (achievement) => {

      doc.setFontSize(
        12
      );

      doc.text(
        `${achievement.badge} - ${achievement.date}`,
        25,
        y
      );

      y += 8;
    }
  );
}
else {

  doc.text(
    "No achievements yet",
    25,
    y
  );

  y += 8;
}

  y += 20;

  doc.setFontSize(16);

  doc.text(
    "Daily History",
    20,
    y
  );

  y += 15;

  if (
    challenge.dailyLogs
      ?.length
  ) {

    challenge.dailyLogs.forEach(
      (log) => {

        doc.setFontSize(
          12
        );

        doc.text(
          `Day ${log.day}`,
          20,
          y
        );

        y += 8;

        doc.text(
          `${log.date}`,
          25,
          y
        );

        y += 8;

        doc.text(
          `${log.note}`,
          25,
          y
        );

        y += 15;

        if (
          y > 260
        ) {

          doc.addPage();

          y = 20;
        }
      }
    );
  } else {

    doc.text(
      "No history available",
      20,
      y
    );
  }

  doc.save(
    `${challenge.title}_Report.pdf`
  );
};

const totalChallenges =
  challenges.length;

const totalCompletedDays =
  challenges.reduce(
    (sum, challenge) =>
      sum + challenge.currentDay,
    0
  );

const longestStreak =
  Math.max(
    ...challenges.map(
      (challenge) =>
        challenge.streak
    ),
    0
  );

const completionRate =
  challenges.length > 0
    ? Math.round(
        (
          totalCompletedDays /
          challenges.reduce(
            (sum, challenge) =>
              sum +
              challenge.targetDays,
            0
          )
        ) * 100
      )
    : 0;

  const chartData =
  challenges.map(
    (challenge) => ({
      name:
        challenge.title,

      progress:
        Math.round(
          (
            challenge.currentDay /
            challenge.targetDays
          ) * 100
        )
    })
  );


  const bestChallenge =
  challenges.reduce(
    (best, challenge) =>
      challenge.currentDay >
      (best?.currentDay || 0)
        ? challenge
        : best,
    null
  );

const highestStreak =
  Math.max(
    ...challenges.map(
      (challenge) =>
        challenge.streak
    ),
    0
  );

const totalActiveDays =
  challenges.reduce(
    (sum, challenge) =>
      sum +
      challenge.currentDay,
    0
  );

const completionChampion =
  challenges.reduce(
    (best, challenge) => {

      const currentPercent =
        (challenge.currentDay /
          challenge.targetDays) *
        100;

      const bestPercent =
        best
          ? (
              best.currentDay /
              best.targetDays
            ) * 100
          : 0;

      return currentPercent >
        bestPercent
        ? challenge
        : best;
    },
    null
  );

  const filteredChallenges =
  challenges.filter(
    (challenge) =>
      challenge.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );

  const getBadge = (
  currentDay,
  targetDays
) => {

  const percent =
    (currentDay /
      targetDays) *
    100;

  if (percent >= 100)
    return "👑 Legend";

  if (percent >= 75)
    return "🥇 Gold";

  if (percent >= 50)
    return "🥈 Silver";

  if (percent >= 25)
    return "🥉 Bronze";

  return "🚀 Beginner";
};

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app light"
      }
    >
    
{
  showConfetti && (
    <Confetti
      recycle={false}
      numberOfPieces={1000}
      gravity={0.15}
    />
  )
}

{
  achievement && (
    <div className="achievement-popup">

      <span>
        {achievement}
      </span>

      <button
        className="close-popup"
        onClick={() =>
          setAchievement("")
        }
      >
        ✖
      </button>

    </div>
  )
}

      <header>
        <h1>
          🔥 365 Days Challenge Tracker
        </h1>

        <button
  className="pdf-btn"
  onClick={exportPDF}
>
  📄 Export PDF
</button>

        <button
          className="theme-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode
            ? "☀️ Light"
            : "🌙 Dark"}
        </button>
      </header>

<div className="stats-grid">

  <div className="stat-card">
    <h3>
      📋 Total Challenges
    </h3>

    <p>
      {totalChallenges}
    </p>
  </div>

  <div className="stat-card">
    <h3>
      ✅ Completed Days
    </h3>

    <p>
      {totalCompletedDays}
    </p>
  </div>

  <div className="stat-card">
    <h3>
      🔥 Longest Streak
    </h3>

    <p>
      {longestStreak}
    </p>
  </div>

  <div className="stat-card">
    <h3>
      📈 Completion Rate
    </h3>

    <p>
      {completionRate}%
    </p>
  </div>

  <div className="stat-card">
  <h3>
    🏆 Best Challenge
  </h3>

  <p>
    {bestChallenge?.title || "-"}
  </p>
</div>

<div className="stat-card">
  <h3>
    🔥 Highest Streak Ever
  </h3>

  <p>
    {highestStreak}
  </p>
</div>

<div className="stat-card">
  <h3>
    📅 Total Active Days
  </h3>

  <p>
    {totalActiveDays}
  </p>
</div>

<div className="stat-card">
  <h3>
    🥇 Champion
  </h3>

  <p>
    {completionChampion?.title || "-"}
  </p>
</div>

</div>



      <div className="chart-container">

  <h2>
    📊 Challenge Progress
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <BarChart
      data={chartData}
    >

      <XAxis
        dataKey="name"
      />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="progress"
      />

    </BarChart>

  </ResponsiveContainer>

    </div>

      <div className="quote-box">
        💡 {randomQuote}
      </div>

      <div className="add-box">
        <input
          type="text"
          placeholder="Enter challenge name"
          value={newChallenge}
          onChange={(e) =>
            setNewChallenge(
              e.target.value
            )
          }
        />

        <input
  type="number"
  min="1"
  placeholder="Target Days"
  value={targetDays}
  onChange={(e) =>
    setTargetDays(
      e.target.value
    )
  }
/>

        <button
          onClick={addChallenge}
        >
          Add Challenge
        </button>
      </div>

      <div className="search-box">

  <input
    type="text"
    placeholder="🔍 Search Challenge..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(
        e.target.value
      )
    }
  />

</div>

      <div className="challenge-grid">
        {filteredChallenges.map(
          (challenge) => {
            const progress =
              Math.round(
                (challenge.currentDay /
 challenge.targetDays) * 100
              );

            return (
              <div
                className="challenge-card"
                key={
                  challenge.id
                }
              >
                <h2>
                  {
                    challenge.title
                  }
                </h2>

                {
  challenge.currentDay >= 
    challenge.targetDays && (
    <div className="completed-banner">
      🏆 CHALLENGE COMPLETED
    </div>
  )
}

                <div className="day-number">
  Day {challenge.currentDay} / {challenge.targetDays}
</div>
<p>
  🎯 Target: {challenge.targetDays} Days
</p>

                <div
  className="circle-wrapper"
>
  <CircularProgressbar
    value={progress}
    text={`${progress}%`}
  />
</div>

                <p>
                  🔥 Streak:{" "}
                  {
                    challenge.streak
                  }
                </p>

                <p>
                  📅 Last
                  Completed:{" "}
                  {challenge.lastCompleted ||
                    "Not Yet"}
                </p>

                <p>
                  🏆 Badge:{" "}
                  {getBadge(
  challenge.currentDay,
  challenge.targetDays
)}
                </p>
                {
  challenge.currentDay >= 
    challenge.targetDays && (
    <div className="trophy-box">

      <h2>
        👑 LEGEND
      </h2>

      <p>
        Congratulations!
      </p>

      <p>
        You completed this
        challenge successfully.
      </p>

    </div>
  )
}

                <button
  className="edit-btn"
  onClick={() =>
    editChallenge(
      challenge.id
    )
  }
>
  ✏️ Edit Challenge
</button>

<button
  className="edit-target-btn"
  onClick={() =>
    editTargetDays(
      challenge.id
    )
  }
>
  🎯 Edit Target Days
</button>

<textarea
  className="notes-box"
  placeholder="Write today's notes..."
  value={
  challenge.todayNote || ""
}
  onChange={(e) =>
    updateNotes(
      challenge.id,
      e.target.value
    )
  }
/>

<button
  className="history-btn"
  onClick={() =>
    setShowHistory(
      showHistory ===
      challenge.id
        ? null
        : challenge.id
    )
  }
>
  📜 View History
</button>

<button
  className="timeline-btn"
  onClick={() =>
    setShowAchievements(
      showAchievements ===
      challenge.id
        ? null
        : challenge.id
    )
  }
>
  🏅 View Achievements
</button>

<button
  className="challenge-pdf-btn"
  onClick={() =>
    exportChallengePDF(
      challenge
    )
  }
>
  📄 Export Challenge PDF
</button>

{
  showHistory ===
    challenge.id && (

    <div className="history-box">

      {
        challenge.dailyLogs
          ?.length > 0
          ? (
              challenge.dailyLogs.map(
                (
                  log,
                  index
                ) => (

                  <div
                    key={
                      index
                    }
                    className="history-item"
                  >

                    <strong>
                      Day {
                        log.day
                      }
                    </strong>

                    <br />

                    📅 {
                      log.date
                    }

                    <p>
                      {
                        log.note
                      }
                    </p>

                  </div>
                )
              )
            )
          : (
              <p>
                No history
                yet
              </p>
            )
      }

    </div>
  )
}

{
  showAchievements ===
    challenge.id && (

    <div className="achievement-box">

      {
        challenge.achievements
          ?.length > 0
          ? (
              challenge.achievements.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={
                      index
                    }
                    className="achievement-item"
                  >

                    🏅 {
                      item.badge
                    }

                    <br />

                    📅 {
                      item.date
                    }

                  </div>
                )
              )
            )
          : (
              <p>
                No achievements
                yet
              </p>
            )
      }

    </div>
  )
}

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`
                    }}
                  ></div>
                </div>

                <p>
                  {progress}%
                  Completed
                </p>

                <button
                  className="complete-btn"
                  onClick={() =>
                    completeDay(
                      challenge.id
                    )
                  }
                >
                  ✅ Complete Today
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteChallenge(
                      challenge.id
                    )
                  }
                >
                  🗑 Delete Challenge
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default App;