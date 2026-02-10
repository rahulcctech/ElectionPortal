export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  userType: string;
}

export interface AuthResponse {
  token: string;
  userType: string;
  userId: number;
  name: string;
  email: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  userType?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
}

export interface Election {
  id?: number;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  candidateCount?: number;
  totalVotes?: number;
}

export interface Party {
  id?: number;
  name: string;
  symbol?: string;
  description?: string;
  candidateCount?: number;
}

export interface Candidate {
  id?: number;
  name: string;
  partyId: number;
  partyName?: string;
  electionId: number;
  electionName?: string;
  voteCount?: number;
}

export interface Voter {
  id?: number;
  name: string;
  age: number;
  email: string;
  password?: string;
  voterId?: string;
}

export interface Vote {
  candidateId: number;
  electionId: number;
}

export interface CandidateResult {
  candidateId: number;
  candidateName: string;
  partyName: string;
  voteCount: number;
  percentage: number;
  isWinner: boolean;
}

export interface ElectionResult {
  electionId: number;
  electionName: string;
  electionStatus: string;
  totalVotes: number;
  candidateResults: CandidateResult[];
}



