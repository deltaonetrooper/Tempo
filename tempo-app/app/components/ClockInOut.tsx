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

// Hversu mikill tími í ms hafa verið síðan notandi stimplaði sig inn?
const [elapsedTime, setElapsedTime] = useState(0);

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

useEffect(() => {
  localStorage.setItem('clockSessions', JSON.stringify(sessions));
}, [sessions]);

useEffect(() => {
  let interval: NodeJS.Timeout;

  if (isClockedIn && currentSessionStart) {
    interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - currentSessionStart.getTime();
      setElapsedTime(elapsed);
    }, 100);
  }

  return () => clearInterval(interval);  
}, [isClockedIn, currentSessionStart]);

const handleClockIn = () => {
  const now = new Date();
  setCurrentSessionStart(now);
  setIsClockedIn(true);
  setElapsedTime(0);
};

const handleClockOut = () => {
  if (currentSessionStart) {
    const endTime = new Date();
    const duration = endTime.getTime() - currentSessionStart.getTime();

    const newSession: Session = {
      id: Date.now().toString(),    // Einfalt ID, gæti verið betra að nota UUID í alvöru appi
      startTime: currentSessionStart,
      endTime: endTime,
      duration: duration,
    };

    setSessions([...sessions, newSession]);  // bæta við lista
    setIsClockedIn(false);                   // uppfæra stöðu
    setCurrentSessionStart(null);            // eyða núverandi "session start" tímann
    setElapsedTime(0);                       // endurstilla tímann
  }
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};