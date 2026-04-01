const messages = [
  "Kokios darbo valandos?",
  "Kur jus randatės?",
  "Ar yra parkingas?",
  "Kiek kainuoja implantai?",
  "Kiek kainuoja balinimas?",
  "Ar darote implantus?",
  "Ar dirbate savaitgaliais?",
  "Koks jūsų telefono numeris?",
  "Sveiki",
  "Labai skauda danti",
  "man labai skauda!!!",
  "Do you speak English?",
  "What are your working hours?",
  "I need appointment tomorrow",
  "Do you have parking?",
  "kiek kainuoja???",
  "ar jus dirbat rytoj",
  "noriu pasikonsultuoti",
  "skauda danti ka daryt",
  "hello"
];

async function run() {
  for (const msg of messages) {
    const res = await fetch("http://localhost:3000/messages/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    console.log("=".repeat(50));
    console.log("INPUT:", msg);
    console.log("INTENT:", data.intent);
    console.log("LANG:", data.language);
    console.log("ESCALATED:", data.escalated);
    console.log("RESPONSE:", data.response);
  }
}

run().catch((error) => {
  console.error("Manual pack run failed:", error);
  process.exit(1);
});
