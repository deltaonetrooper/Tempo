import {useEffect, useState} from "react"

interface Session {
    id: string;
    startTime: Date;
    endTime: Date | null;
    duration: number;
}

// er notandinn stimplaður inn? Byrjar sem false
const [isClockedIn, setIsClockedIn] = useState(false);

// Hvenær byrjaði session-ið? Null ef ekki stimplaður inn
const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null);

// Hversu mikill tími í ms hafa verið síðan notandi stimplaði sig inn? (notað fyrur) 
const [elapsedTime, setElapsedTime] = useState(null);

// listi af öllum sessions í dag
const [sessions, setSessions] = useState<Session[]>([])


useEffect(() => {
  const saved = localStorage.getItem('clockSessions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setSessions(
        parsed.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : null,
        }))
      );
    } catch (e) {
      console.error('Failed to load sessions', e);
    }
  }
}, []);