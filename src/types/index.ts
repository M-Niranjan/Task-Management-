// Shared TypeScript types for Task Management System

export type Priority = "urgent" | "high" | "medium" | "low" | "none";
export type Status = "todo" | "doing" | "completed" | "on_hold" | "backlog";
export type ColorMode = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";
export type Theme = "light" | "dark";

export interface Member {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  isGuest?: boolean;
}

export interface Label {
  _id: string;
  name: string;
  color?: string;
}

export interface Comment {
  _id: string;
  author: Member;
  content: string;
  createdAt: string;
}

export interface Subtask {
  _id: string;
  title: string;
  priority: Priority;
  members: Member[];
  dueDate?: string;
  status: Status;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  members: Member[];
  labels: string[];
  dueDate?: string;
  projectId?: string;
  subtasks: Subtask[];
  comments: Comment[];
  createdBy?: Member;
  reporter?: Member;
  teams?: string[];
  resources?: string;
  viewerCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  priority: Priority;
  lead?: Member;
  dueDate?: string;
  createdBy?: Member;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: Status;
  label: string;
  tasks: Task[];
}

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}
