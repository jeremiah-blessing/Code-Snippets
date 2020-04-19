import db from "../firestoreInstance";

export default async function fetchNotifications(uid) {
  let notifications = [];
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("notifications")
    // .where("read", "==", false)
    .get();
  snapshot.forEach((snap) => {
    notifications.push({ ...snap.data(), notificationID: snap.id });
  });
  return notifications;
}
