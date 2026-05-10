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
