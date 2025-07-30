import type { Flashcard, Domain, ConfidenceCategory } from '../types/flashcard';

export const flashcards: Flashcard[] = [
  // Blue - General Security Concepts (Domain 1)
  {
    question: "What does CIA stand for in cybersecurity?",
    answer: "Confidentiality, Integrity, and Availability - the three fundamental principles of information security.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    question: "What is the AAA framework?",
    answer: "Authentication, Authorization, and Accounting - a framework for controlling access to resources and tracking user activities.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    question: "What is Zero Trust security?",
    answer: "A security model that assumes no implicit trust and requires verification for every user and device trying to access resources.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    question: "What are the three main security control types?",
    answer: "Administrative (policies/procedures), Technical (firewalls/encryption), and Physical (locks/cameras) controls.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.2",
    color: "blue"
  },
  
  // Red - Threats, Vulnerabilities & Mitigations (Domain 2)
  {
    question: "What is phishing?",
    answer: "A social engineering attack where attackers impersonate legitimate entities to steal sensitive information like passwords or credit card numbers.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    question: "What is malware?",
    answer: "Malicious software designed to harm, exploit, or gain unauthorized access to computer systems. Includes viruses, worms, trojans, ransomware, and spyware.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    question: "What is ransomware?",
    answer: "A type of malware that encrypts a victim's files and demands payment (ransom) for the decryption key to restore access to the data.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    question: "What are the main threat actor motivations?",
    answer: "Financial gain, espionage, ideology/hacktivism, revenge, and state-sponsored activities.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.1",
    color: "red"
  },
  {
    question: "What is a zero-day exploit?",
    answer: "An attack that exploits a previously unknown vulnerability in software before developers have created and distributed a patch for it.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.3",
    color: "red"
  },
  
  // Green - Security Architecture (Domain 3)
  {
    question: "What is a VPN?",
    answer: "Virtual Private Network - creates a secure, encrypted connection over a less secure network, allowing users to access private networks remotely.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    question: "What is network segmentation?",
    answer: "The practice of dividing a network into smaller, isolated segments to limit the scope of security breaches and improve performance.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    question: "What is TLS?",
    answer: "Transport Layer Security - a cryptographic protocol that provides secure communication over networks by encrypting data in transit.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    question: "What are the main cloud service models?",
    answer: "Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  
  // Yellow - Security Operations (Domain 4)
  {
    question: "What is SIEM?",
    answer: "Security Information and Event Management - a solution that provides real-time analysis of security alerts and logs from various sources.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    question: "What is system hardening?",
    answer: "The process of securing a system by reducing vulnerabilities, disabling unnecessary services, and implementing security configurations.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.1",
    color: "yellow"
  },
  {
    question: "What are the main incident response steps?",
    answer: "Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.3",
    color: "yellow"
  },
  
  // White - Program Management & Oversight (Domain 5)
  {
    question: "What is an AUP?",
    answer: "Acceptable Use Policy - a document that outlines the permitted and prohibited uses of an organization's IT resources.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.1",
    color: "white"
  },
  {
    question: "What is risk management?",
    answer: "The process of identifying, assessing, and mitigating risks to an organization's assets, operations, and reputation.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    question: "What does RTO stand for?",
    answer: "Recovery Time Objective - the maximum acceptable time to restore a system or process after a disruption.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  }
];

export const domains: Domain[] = [
  { id: 'all', name: 'All Domains', color: 'gray', domainNumber: '' },
  { id: 'General Security Concepts', name: 'General Security Concepts', color: 'blue', domainNumber: '1.0' },
  { id: 'Threats, Vulnerabilities & Mitigations', name: 'Threats, Vulnerabilities & Mitigations', color: 'red', domainNumber: '2.0' },
  { id: 'Security Architecture', name: 'Security Architecture', color: 'green', domainNumber: '3.0' },
  { id: 'Security Operations', name: 'Security Operations', color: 'yellow', domainNumber: '4.0' },
  { id: 'Program Management & Oversight', name: 'Program Management & Oversight', color: 'white', domainNumber: '5.0' }
];

export const confidenceCategories: ConfidenceCategory[] = [
  { id: 'knew-it', name: 'Knew it right away', icon: '⚡', color: 'green' },
  { id: 'quick-think', name: 'Had to think for a moment', icon: '🤔', color: 'blue' },
  { id: 'long-think', name: 'Had to think for a while', icon: '🧠', color: 'yellow' },
  { id: 'peeked', name: 'Peeked at the answer', icon: '👀', color: 'red' }
]; 