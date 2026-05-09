import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

// ── Incidents ──────────────────────────────────────────────────────────────

export function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setIncidents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { incidents, loading };
}

export async function reportIncident(data) {
  return addDoc(collection(db, "incidents"), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
  });
}

export async function resolveIncident(id) {
  return updateDoc(doc(db, "incidents", id), {
    status: "resolved",
    resolvedAt: serverTimestamp(),
  });
}

// ── Alerts ─────────────────────────────────────────────────────────────────

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "alerts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return alerts;
}

export async function createAlert(data) {
  return addDoc(collection(db, "alerts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ── Shelters ───────────────────────────────────────────────────────────────

export function useShelters() {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "shelters"), (snap) => {
      setShelters(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return shelters;
}
