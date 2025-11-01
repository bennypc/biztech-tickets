const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const mentorNames = [
  "Jason Kuo",
  "Jia Jin",
  "Troy Wu",
  "Christopher Chen",
  "Hayden Chan",
  "Jasper Mao",
  "Ricky Luo",
  "Michelle Wan"
];

const mentors = mentorNames.map((fullName) => {
  const [firstName, ...lastParts] = fullName.trim().split(" ");
  const lastName = lastParts.join(" ");
  const lastCode = lastName ? lastName.substring(0, 2).toLowerCase() : "";
  const code = `${firstName.toLowerCase()}${lastCode}`;

  return {
    firstName,
    lastName,
    role: "mentor",
    code
  };
});

async function seedMentors() {
  const batch = db.batch();

  mentors.forEach((mentor) => {
    const docRef = db.collection("users").doc();
    batch.set(docRef, mentor);
  });

  await batch.commit();
  console.log(
    `Successfully seeded ${mentors.length} mentor users to Firestore.`
  );
}

seedMentors().catch(console.error);
