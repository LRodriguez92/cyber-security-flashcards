import type { Flashcard, Domain, ConfidenceCategory } from '../types/flashcard';

export const flashcards: Flashcard[] = [
  {
    id: "1",
    question: "What does CIA stand for in cybersecurity?",
    answer: "Confidentiality, Integrity, and Availability - the three fundamental principles of information security.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    id: "2",
    question: "What is the AAA framework?",
    answer: "Authentication, Authorization, and Accounting - a framework for controlling access to resources and tracking user activities.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    id: "3",
    question: "What is Zero Trust security?",
    answer: "A security model that assumes no implicit trust and requires verification for every user and device trying to access resources.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    id: "4",
    question: "What are the three main security control types?",
    answer: "Administrative (policies/procedures), Technical (firewalls/encryption), and Physical (locks/cameras) controls.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.2",
    color: "blue"
  },
  {
    id: "5",
    question: "What is phishing?",
    answer: "A social engineering attack where attackers impersonate legitimate entities to steal sensitive information like passwords or credit card numbers.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "6",
    question: "What is malware?",
    answer: "Malicious software designed to harm, exploit, or gain unauthorized access to computer systems. Includes viruses, worms, trojans, ransomware, and spyware.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "7",
    question: "What is ransomware?",
    answer: "A type of malware that encrypts a victim's files and demands payment (ransom) for the decryption key to restore access to the data.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "8",
    question: "What are the main threat actor motivations?",
    answer: "Financial gain, espionage, ideology/hacktivism, revenge, and state-sponsored activities.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.1",
    color: "red"
  },
  {
    id: "9",
    question: "What is a zero-day exploit?",
    answer: "An attack that exploits a previously unknown vulnerability in software before developers have created and distributed a patch for it.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.3",
    color: "red"
  },
  {
    id: "10",
    question: "What is a VPN?",
    answer: "Virtual Private Network - creates a secure, encrypted connection over a less secure network, allowing users to access private networks remotely.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    id: "11",
    question: "What is network segmentation?",
    answer: "The practice of dividing a network into smaller, isolated segments to limit the scope of security breaches and improve performance.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    id: "12",
    question: "What is TLS?",
    answer: "Transport Layer Security - a cryptographic protocol that provides secure communication over networks by encrypting data in transit.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "13",
    question: "What are the main cloud service models?",
    answer: "Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "14",
    question: "What is SIEM?",
    answer: "Security Information and Event Management - a solution that provides real-time analysis of security alerts and logs from various sources.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    id: "15",
    question: "What is system hardening?",
    answer: "The process of securing a system by reducing vulnerabilities, disabling unnecessary services, and implementing security configurations.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.1",
    color: "yellow"
  },
  {
    id: "16",
    question: "What are the main incident response steps?",
    answer: "Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.3",
    color: "yellow"
  },
  {
    id: "17",
    question: "What is an AUP?",
    answer: "Acceptable Use Policy - a document that outlines the permitted and prohibited uses of an organization's IT resources.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.1",
    color: "white"
  },
  {
    id: "18",
    question: "What is risk management?",
    answer: "The process of identifying, assessing, and mitigating risks to an organization's assets, operations, and reputation.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "19",
    question: "What does RTO stand for?",
    answer: "Recovery Time Objective - the maximum acceptable time to restore a system or process after a disruption.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "20",
    question: "Technical vs. Operational controls—what's the difference?",
    answer: "Technical = technology mechanisms (e.g., IDS/IPS, encryption); Operational = people/process controls (e.g., training, change management).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    id: "21",
    question: "Give two Deterrent controls.",
    answer: "Warning signs and security guards (also: lighting, visible cameras).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    id: "22",
    question: "What are Compensating controls?",
    answer: "Alternative safeguards when a primary control isn't feasible (e.g., manual sign-in + escorts if badges fail; temporary firewall rules; enhanced audit logging; OTPs when MFA tokens fail).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.1",
    color: "blue"
  },
  {
    id: "23",
    question: "What is a POA&M?",
    answer: "Plan of Action & Milestones—documents vulnerabilities, remediation steps, owners, and timelines.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "24",
    question: "Name three Physical security controls.",
    answer: "Bollards, access badges/NFC, and security guard patrols.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.2",
    color: "blue"
  },
  {
    id: "25",
    question: "Mechanical vs. electronic locks—give examples.",
    answer: "Mechanical: padlocks, pin-and-tumbler; Electronic: RFID/NFC badges, PIN pads, biometrics.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.2",
    color: "blue"
  },
  {
    id: "26",
    question: "What is a pin-and-tumbler lock?",
    answer: "Classic cylinder lock: correct key lifts pin stacks so their gaps align at the shear line, allowing the plug to rotate.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.2",
    color: "blue"
  },
  {
    id: "27",
    question: "Define FAR, FRR, and CER in biometrics.",
    answer: "FAR = False Acceptance Rate; FRR = False Rejection Rate; CER = point where FAR and FRR are equal—lower CER indicates better accuracy.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.2",
    color: "blue"
  },
  {
    id: "28",
    question: "What is a Script Kiddie?",
    answer: "A low-skill attacker using pre-made tools/exploits without deep understanding.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.1",
    color: "red"
  },
  {
    id: "29",
    question: "What distinguishes a Hacktivist?",
    answer: "Motivated by political/social causes; tactics include defacements, leaks, and DDoS for a cause.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.1",
    color: "red"
  },
  {
    id: "30",
    question: "List three threat-actor motivations.",
    answer: "Financial gain, espionage, and disruption/chaos (also ideology/revenge).",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.1",
    color: "red"
  },
  {
    id: "31",
    question: "What is a Supply Chain attack?",
    answer: "Compromise of a vendor or supplier to indirectly breach the primary target via trusted updates/integrations.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "32",
    question: "Explain a Watering Hole attack.",
    answer: "Attacker compromises a legitimate site frequented by victims so visits trigger malware or redirects.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "33",
    question: "What is an Insider Threat?",
    answer: "Malicious or unintentional risk from someone with internal access and knowledge of the environment.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.1",
    color: "red"
  },
  {
    id: "34",
    question: "Give two social-engineering vectors.",
    answer: "Phishing email and vishing call (others include baiting and quid pro quo).",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "35",
    question: "List six social-engineering triggers.",
    answer: "Authority, Urgency, Social Proof, Scarcity, Likability, and Fear.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "36",
    question: "What is Spear Phishing?",
    answer: "Highly targeted phishing tailored to a specific person or group using personal/contextual info.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "37",
    question: "Define Whaling.",
    answer: "Spear phishing aimed at executives or other high-value targets, often to trigger large transfers or data access.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "38",
    question: "Baiting—what is it?",
    answer: "Planting infected media (e.g., USB drive) or lures to entice victims to execute malware or reveal credentials.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "39",
    question: "Piggybacking vs. Tailgating—what's the difference?",
    answer: "Piggybacking: authorized user knowingly lets someone in; Tailgating: attacker slips in unnoticed without consent.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "40",
    question: "What is a Honeytoken?",
    answer: "A fake or decoy data asset monitored to detect unauthorized access or misuse.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.5",
    color: "red"
  },
  {
    id: "41",
    question: "Virus vs. Worm—what's the key difference?",
    answer: "Virus attaches to files/programs and spreads when executed; Worm is standalone and self-replicates over networks without user action.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "42",
    question: "What is a Trojan? Give an example.",
    answer: "Malicious code disguised as legitimate software; example: Remote Access Trojan (RAT) that grants backdoor access once run.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "43",
    question: "Define Ransomware and the correct response.",
    answer: "Malware that encrypts files for payment. Response: isolate host, notify authorities, restore from known-good backups—do not pay.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.5",
    color: "red"
  },
  {
    id: "44",
    question: "Botnet vs. Zombie—define each.",
    answer: "Botnet: network of compromised devices under attacker control; Zombie: an individual compromised device within that botnet.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "45",
    question: "What is a Rootkit and why is it hard to detect?",
    answer: "Stealth malware embedded at OS/kernel level to hide processes/files; evades detection by intercepting system calls and security tools.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "46",
    question: "What is Fileless malware? Name its stages.",
    answer: "Malware living in memory using system tools. Stages: initial shellcode → downloader → in-memory payload/execution.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "47",
    question: "Give three indicators of a malware infection.",
    answer: "Account lockouts, impossible-travel alerts, resource spikes, and missing/out-of-cycle logs.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.4",
    color: "red"
  },
  {
    id: "48",
    question: "What is Shellcode in a multistage attack?",
    answer: "Small initial code injected into memory to exploit a vulnerability and fetch/execute the main payload.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "49",
    question: "List the five commercial data classification levels.",
    answer: "Public, Sensitive, Private, Confidential, and Critical.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "50",
    question: "Why is over-classifying data a risk?",
    answer: "It increases storage/encryption/handling costs and can slow productivity by imposing overly strict controls.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "51",
    question: "How do you protect data at rest?",
    answer: "Encrypt: full-disk, partition, file/volume, or database/record-level encryption.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "52",
    question: "How do you protect data in transit?",
    answer: "Use TLS/SSL, VPN tunnels, or IPsec to encrypt data moving across networks.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "53",
    question: "How do you protect data in use?",
    answer: "Application-level encryption, strict ACLs/RBAC, and secure enclaves (e.g., Intel SGX).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "54",
    question: "What is Data Sovereignty?",
    answer: "Data is governed by the laws of the country where it resides; map data locations and restrict flows accordingly.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "55",
    question: "Tokenization vs. Masking—what's the difference?",
    answer: "Tokenization replaces values with vault-backed tokens; masking obscures data in place (e.g., XXX-XX-1234) for limited visibility/testing.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.3",
    color: "green"
  },
  {
    id: "56",
    question: "High availability vs. fault tolerance—compare.",
    answer: "High availability minimizes downtime via failover; fault tolerance keeps running through failures (e.g., mirrored hardware) with zero downtime.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "57",
    question: "RPO vs. RTO—define each.",
    answer: "RPO: maximum acceptable data loss (time). RTO: maximum acceptable downtime (time to restore service).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "58",
    question: "Hot vs. Warm vs. Cold DR sites—what's the difference?",
    answer: "Hot: fully ready with live replication (near-zero RPO/RTO); Warm: partial infra/data (moderate RPO/RTO); Cold: empty shell (long RPO/RTO).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "59",
    question: "Snapshots vs. Backups—how do they differ?",
    answer: "Snapshots: point-in-time volume copies tied to the system; Backups: separate copies, often offsite, for broader recovery.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "60",
    question: "Failover vs. Failback—define.",
    answer: "Failover: switching operations to standby during outage; Failback: returning from standby to primary after restoration.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "61",
    question: "Why use Load Balancing for resilience?",
    answer: "Distributes traffic to prevent overload, improves performance, and provides continuity if one node fails.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "62",
    question: "UPS vs. Generator—power resilience roles?",
    answer: "UPS provides short-term battery power and bridges generator spin-up; Generator supplies long-term power during extended outages.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.4",
    color: "green"
  },
  {
    id: "63",
    question: "What is an Embedded System?",
    answer: "A dedicated computing device embedded in machinery to perform specific functions (e.g., ECU, smart appliance, PLC).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    id: "64",
    question: "Why are embedded systems often real-time?",
    answer: "They must respond within strict timing constraints—hard real-time misses can be catastrophic; soft real-time misses degrade performance.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    id: "65",
    question: "Three common embedded-firmware vulnerabilities?",
    answer: "Insecure update mechanisms, exposed debug ports (JTAG/SWD), and memory corruption (buffer overflows).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    id: "66",
    question: "What is Secure Boot & Chain of Trust?",
    answer: "Bootloader verifies digital signatures of firmware components before execution so only trusted code runs.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.1",
    color: "green"
  },
  {
    id: "67",
    question: "Inline vs. TAP/Monitor placement—difference?",
    answer: "Inline devices sit in-path and can block/modify traffic (e.g., IPS); TAP/monitor are out-of-band and only observe copies of traffic (e.g., IDS).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "68",
    question: "Active vs. Passive security appliance—define.",
    answer: "Active devices can act on traffic (block/reset/throttle); Passive devices only observe and alert.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "69",
    question: "Why segment into security zones? Give two.",
    answer: "Reduces attack surface and blast radius. Examples: DMZ for public services; PCI-restricted zone for cardholder data.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "70",
    question: "Forward vs. Reverse proxy—who they serve?",
    answer: "Forward proxy serves internal clients going out (policy, caching); Reverse proxy fronts internal servers to external clients (TLS offload, WAF, load share).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "71",
    question: "IDS vs. IPS—core difference & placement?",
    answer: "IDS detects/alerts (out-of-band); IPS detects and blocks (inline).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "72",
    question: "VPN tunneling—TLS vs. IPsec (quick compare).",
    answer: "TLS VPNs ride over TCP/443 (client-friendly); IPsec provides Layer-3 tunnel (ESP) in transport/tunnel modes for site-to-site/remote.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "73",
    question: "Split-tunnel vs. Full-tunnel VPN—tradeoff?",
    answer: "Split routes only corporate subnets via VPN (saves bandwidth but increases risk); Full sends all traffic via VPN (more secure, more bandwidth).",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "74",
    question: "SD-WAN—why adopt it?",
    answer: "Application-aware path selection across MPLS/Internet/5G improves performance/cost and centralizes policy.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "75",
    question: "SASE—what does it combine?",
    answer: "Converges SD-WAN with cloud security (SWG, CASB, ZTNA, FWaaS) delivered from edge POPs for consistent policy.",
    domain: "Security Architecture",
    domainNumber: "3.0",
    objective: "3.2",
    color: "green"
  },
  {
    id: "76",
    question: "What is Asset Management?",
    answer: "Lifecycle tracking/maintaining/disposing of hardware, software, and data assets to maximize value and minimize risk.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    id: "77",
    question: "Assignment & accounting of assets—why do it?",
    answer: "Each asset has an owner and is logged (type/location/custodian) to ensure accountability and speed troubleshooting.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    id: "78",
    question: "Inventory vs. Enumeration vs. MDM—differences?",
    answer: "Inventory: manual asset list; Enumeration: automated discovery of devices/software; MDM: central policy/patching for mobile endpoints (lock, wipe, config).",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    id: "79",
    question: "Name four NIST 800-88 media sanitization methods.",
    answer: "Overwrite, degauss, secure-erase, and cryptographic-erase (destroy keys).",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    id: "80",
    question: "Acquisition vs. Procurement—what's the difference?",
    answer: "Acquisition: obtaining goods/services; Procurement: full sourcing lifecycle (requirements → vetting → approvals → purchase).",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.2",
    color: "yellow"
  },
  {
    id: "81",
    question: "BYOD vs. COPE vs. CYOD—one pro & con each.",
    answer: "BYOD: +low capex / −limited control; COPE: +full control / −higher capex, privacy concerns; CYOD: +balance choice/control / −similar cost/privacy trade-offs.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.1",
    color: "yellow"
  },
  {
    id: "82",
    question: "Why harden/disable debug interfaces (JTAG/SWD) on devices?",
    answer: "To prevent attackers from loading malicious firmware or dumping secrets—debug ports grant deep access.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.1",
    color: "yellow"
  },
  {
    id: "83",
    question: "Encrypted & signed firmware updates—what do they provide?",
    answer: "Confidentiality (encrypted payload) and integrity/authenticity (signature validation) before install.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.1",
    color: "yellow"
  },
  {
    id: "84",
    question: "Two runtime protections for embedded/host systems.",
    answer: "NX/XD bit to block code execution in data regions; stack canaries to detect stack overflows.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.1",
    color: "yellow"
  },
  {
    id: "85",
    question: "Why tune DLP policies after deployment?",
    answer: "To reduce false positives and alert fatigue by adjusting signatures/thresholds to real usage patterns.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.4",
    color: "yellow"
  },
  {
    id: "86",
    question: "Storage-based DLP—two key functions.",
    answer: "Scan files at rest for policy breaches and alert/block mass downloads or unauthorized access on shares/cloud stores.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.4",
    color: "yellow"
  },
  {
    id: "87",
    question: "NAC—what checks before granting access?",
    answer: "Identity (user/device), posture (AV/EDR, patches, disk encryption), and policy compliance before VLAN/ACL assignment.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.5",
    color: "yellow"
  },
  {
    id: "88",
    question: "EDR vs. XDR—what's the scope difference?",
    answer: "EDR focuses on endpoint detect/respond; XDR correlates across endpoints, network, email, identity, and cloud.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.5",
    color: "yellow"
  },
  {
    id: "89",
    question: "SPF, DKIM, DMARC—role of each in email auth.",
    answer: "SPF: who can send for the domain; DKIM: cryptographic signing of mail; DMARC: policy/reporting to enforce alignment and combat spoofing.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.5",
    color: "yellow"
  },
  {
    id: "90",
    question: "DNS filtering—what does it block and why effective?",
    answer: "Blocks queries to malicious domains (phishing/C2) early in the kill chain; lightweight and broad coverage.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.5",
    color: "yellow"
  },
  {
    id: "91",
    question: "File Integrity Monitoring (FIM)—what does it detect?",
    answer: "Unauthorized changes to critical files/registries/binaries indicating tampering or persistence.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.5",
    color: "yellow"
  },
  {
    id: "92",
    question: "What are the four IAM processes (AAAA)?",
    answer: "Identification, Authentication, Authorization, and Accounting—claim identity → verify → grant permissions → log activity.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.6",
    color: "yellow"
  },
  {
    id: "93",
    question: "List the five MFA factor categories.",
    answer: "Something you know, have, are, do, and somewhere you are (knowledge, possession, inherence, behavior, location).",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.6",
    color: "yellow"
  },
  {
    id: "94",
    question: "What is SSO and which protocols support it?",
    answer: "Single Sign-On—one login to multiple apps via a trusted IdP; common protocols: LDAP, OAuth, and SAML.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.6",
    color: "yellow"
  },
  {
    id: "95",
    question: "What is Federation in IAM?",
    answer: "A trust relationship where an external IdP authenticates users: initiate → redirect to IdP → auth → assertion → return → verify → access.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.6",
    color: "yellow"
  },
  {
    id: "96",
    question: "PAM—name three key components.",
    answer: "Just-in-time permissions, password vaulting, and time-limited accounts.",
    domain: "Security Operations",
    domainNumber: "4.0",
    objective: "4.6",
    color: "yellow"
  },

  // Blue - Domain 1.4 (Cryptographic Solutions) & 1.3 (Change Mgmt)
  {
    id: "97",
    question: "Symmetric vs. Asymmetric encryption—key difference?",
    answer: "Symmetric uses one shared key (fast but distribution risk); Asymmetric uses a public/private pair (no shared secret, supports non-repudiation, slower).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "98",
    question: "Why use a hybrid encryption scheme?",
    answer: "Use asymmetric to exchange a one-time symmetric session key, then use fast symmetric (e.g., AES) for bulk data.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "99",
    question: "Block vs. Stream ciphers—how do they differ?",
    answer: "Block ciphers encrypt fixed-size blocks (e.g., AES 128-bit blocks); Stream ciphers encrypt data bit/byte at a time (e.g., RC4, ChaCha20).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "100",
    question: "Purpose of hashing in security?",
    answer: "Create a one-way fingerprint for integrity checks—tiny input changes yield very different outputs.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "101",
    question: "How do digital signatures ensure authenticity & integrity?",
    answer: "Hash the message, sign the hash with your private key; recipient verifies with your public key and a fresh hash.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "102",
    question: "CA vs. RA—roles in PKI?",
    answer: "RA verifies identity & collects CSRs; CA signs/issues X.509 certs and manages revocation (CRLs/OCSP).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "103",
    question: "CRL vs. OCSP—revocation checking difference?",
    answer: "CRL: periodic download of full revocation list; OCSP: real-time per-certificate status query.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "104",
    question: "Post-quantum crypto—why needed?",
    answer: "Quantum computing threatens RSA/ECC; post-quantum schemes (e.g., Kyber/Dilithium) resist quantum attacks.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "105",
    question: "Name modern stream ciphers beyond RC4.",
    answer: "Salsa20/ChaCha20, HC-128/HC-256, Rabbit, Grain v1/Grain-128a, MICKEY 2.0, SNOW 2.0.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.4",
    color: "blue"
  },
  {
    id: "106",
    question: "Purpose of Change Management?",
    answer: "Safely transition people/process/tech from current to desired state while minimizing outages and resistance.",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.3",
    color: "blue"
  },
  {
    id: "107",
    question: "Five-step Change Management process?",
    answer: "Prepare → Vision → Implement → Verify → Document (update SOPs, lessons learned).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.3",
    color: "blue"
  },
  {
    id: "108",
    question: "Key Change Management roles?",
    answer: "Change Owner (champion), CAB (approvals), and Stakeholders (impacted teams/users).",
    domain: "General Security Concepts",
    domainNumber: "1.0",
    objective: "1.3",
    color: "blue"
  },

  // White - Domain 5.1 / 5.2 / 5.3 / 5.4 / 5.5
  {
    id: "109",
    question: "Centralized vs. Decentralized governance—pros/cons?",
    answer: "Centralized: uniform policies, easier audits, clear accountability but slower local decisions; Decentralized: faster local decisions, tailored controls but inconsistent standards and reporting gaps.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.1",
    color: "white"
  },
  {
    id: "110",
    question: "Policy vs. Standard vs. Procedure—give one example each.",
    answer: "Policy: 'All employees must use MFA.' Standard: 'Passwords ≥12 chars, mixed case, symbols.' Procedure: steps to onboard a new user into MFA (approve, configure, test, log).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.1",
    color: "white"
  },
  {
    id: "111",
    question: "Internal vs. External compliance reporting—difference?",
    answer: "Internal: audits against your policies (e.g., access-log reviews). External: submissions/attestations to regulators or clients (e.g., PCI DSS, SOC 2).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.4",
    color: "white"
  },
  {
    id: "112",
    question: "Due diligence vs. due care—security example.",
    answer: "Due diligence: evaluate cloud providers (FedRAMP, pen-test reports). Due care: enforce baselines/monitoring after selection to meet 'reasonable' security.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.4",
    color: "white"
  },
  {
    id: "113",
    question: "Four consequences of non-compliance—examples.",
    answer: "GDPR fines; license revocation; reputational damage (client churn); contract loss (termination/lawsuits).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.4",
    color: "white"
  },
  {
    id: "114",
    question: "Risk management lifecycle—five steps?",
    answer: "Identification, Analysis, Treatment, Monitoring, and Reporting.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "115",
    question: "Define RTO, RPO, MTTR, MTBF.",
    answer: "RTO = Recovery Time Objective; RPO = Recovery Point Objective; MTTR = Mean Time to Repair; MTBF = Mean Time Between Failures.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "116",
    question: "Define EF, SLE, ARO, ALE.",
    answer: "EF = Exposure Factor; SLE = Single Loss Expectancy (Asset Value × EF); ARO = Annualized Rate of Occurrence; ALE = Annualized Loss Expectancy (SLE × ARO).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "117",
    question: "Qualitative vs. Quantitative risk analysis—contrast.",
    answer: "Qualitative: High/Med/Low by expert judgment; Quantitative: numeric (SLE, ARO, ALE) for cost-benefit comparisons.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "118",
    question: "Four risk treatment options?",
    answer: "Avoid, Transfer (e.g., insurance), Mitigate (reduce likelihood/impact), Accept (budget for it).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "119",
    question: "Key fields in a risk register?",
    answer: "Description, Impact, Likelihood, Risk Level (impact×likelihood), Cost, Appetite/Tolerance, KRIs, Risk Owner.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "120",
    question: "When should you perform risk assessments?",
    answer: "Ad-hoc, Recurring (scheduled), One-time (project-specific), and Continuous (real-time monitoring).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.2",
    color: "white"
  },
  {
    id: "121",
    question: "What is a third-party vendor assessment?",
    answer: "Evaluation of a vendor via pen tests, internal audits, independent assessments, and supply-chain integrity checks.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "122",
    question: "What is a right-to-audit clause?",
    answer: "A contractual term granting you authority to inspect a vendor's internal security controls, processes, and evidence.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "123",
    question: "MOA vs. MOU vs. SLA vs. MSA vs. SOW vs. NDA vs. BPA—define briefly.",
    answer: "MOA/MOU: formal/informal intent; SLA: performance/security metrics; MSA: umbrella terms; SOW: deliverables/timeline; NDA: confidentiality; BPA: partnership terms.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "124",
    question: "Why ongoing vendor monitoring?",
    answer: "To ensure the vendor continues to meet security/compliance obligations via periodic reviews and audit follow-ups.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "125",
    question: "Why are secondary/aftermarket hardware sources risky?",
    answer: "Risk of counterfeit or tampered components with hidden malware/defects due to unknown provenance.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "126",
    question: "What should you verify in software providers/MSPs?",
    answer: "Licensing and patching, secure SDLC/DevOps, incident-response SLAs, and contractual security obligations.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "127",
    question: "Name three contractual safeguards against supply-chain attacks.",
    answer: "Right-to-audit clauses, security/compliance SLAs with penalties, and indemnity clauses to shift breach costs.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.3",
    color: "white"
  },
  {
    id: "128",
    question: "What is an audit?",
    answer: "A systematic, formal evaluation of systems/processes/controls against criteria, performed by internal or external auditors.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "129",
    question: "Internal vs. External audit—difference?",
    answer: "Internal: in-house checks of policies/procedures; External: third-party validation against laws/standards/contracts.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "130",
    question: "What is a compliance audit?",
    answer: "A review to determine adherence to specific laws, regulations, standards, or contractual obligations (e.g., GDPR, HIPAA, PCI DSS).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "131",
    question: "What is a vulnerability assessment?",
    answer: "Scanning and analyzing systems to identify known weaknesses (unpatched software, open ports, misconfigurations).",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "132",
    question: "Purpose of a penetration test?",
    answer: "Simulate a real attacker to exploit vulnerabilities, test defenses, and demonstrate impact.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "133",
    question: "Red-team vs. Blue-team vs. Purple-team—contrast.",
    answer: "Red: offensive; Blue: defensive; Purple: integrated collaboration to improve detection/response.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "134",
    question: "What is reconnaissance in a pentest?",
    answer: "Information-gathering phase (passive OSINT or active scanning) to map targets/services/entry points.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "135",
    question: "Define attestation of findings.",
    answer: "A signed statement confirming an audit/pentest occurred and summarizing verified results for compliance or contractual proof.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "136",
    question: "What are record reviews in audits?",
    answer: "Examination of logs, change tickets, policies, and procedures to verify controls and spot discrepancies.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "137",
    question: "Why run tabletop exercises?",
    answer: "Walk through incident response or DR plans in a discussion format to validate and improve without production impact.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },
  {
    id: "138",
    question: "Give one example each of an assessment tool and an audit tool.",
    answer: "Assessment: Nessus vulnerability scanner; Audit: SIEM-generated access-control compliance reports.",
    domain: "Program Management & Oversight",
    domainNumber: "5.0",
    objective: "5.5",
    color: "white"
  },

  // Red - Domain 2.2/2.3/2.4/2.5 (additional from Section 18)
  {
    id: "139",
    question: "Common hardware vulnerabilities to watch for?",
    answer: "Weak firmware controls, end-of-life/legacy systems, unpatched devices, and misconfigurations (servers/routers/IoT/mobiles).",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.3",
    color: "red"
  },
  {
    id: "140",
    question: "Six mitigations for hardware/legacy risk.",
    answer: "Hardening, patching, secure baselines, decommissioning, isolation, and segmentation.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.5",
    color: "red"
  },
  {
    id: "141",
    question: "Bluetooth attack terms: Bluejacking, Bluesnarfing, Bluebugging, Bluesmack, Blueborne.",
    answer: "Bluejacking: unsolicited messages; Bluesnarfing: data theft; Bluebugging: device control; Bluesmack: DoS; Blueborne: over-the-air takeover.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "142",
    question: "Why are sideloading/jailbreaking/rooting risky?",
    answer: "Bypass vetting and disable platform protections/updates, exposing devices to on-path attacks and unauthorized access.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "143",
    question: "SQL injection—telltale sign and impact?",
    answer: "Inputs like ' OR 1=1 cause true conditions, bypassing auth and enabling direct DB access/queries.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "144",
    question: "Two XML exploits and what they do (from this section).",
    answer: "XML bomb (billion laughs) exhausts memory; XXE reads local files (e.g., file:///etc/shadow).",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "145",
    question: "Three XSS types and one indicator.",
    answer: "Reflected, Persistent, DOM-based; look for <script>document.cookie</script> in URLs/logs.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "146",
    question: "What is CSRF and a classic outcome?",
    answer: "Exploits a user's authenticated session to perform actions (e.g., change password/email) without consent.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
  },
  {
    id: "147",
    question: "Buffer overflow—core idea & one mitigation.",
    answer: "Writing past a buffer to hijack control flow (e.g., overwrite return address); mitigated by ASLR (among others).",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.3",
    color: "red"
  },
  {
    id: "148",
    question: "Race conditions—name three timing bugs & one example.",
    answer: "TOC (check), TOU (use), TOE (execution); example: Dirty COW Linux privilege-escalation race.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.3",
    color: "red"
  },
  {
    id: "149",
    question: "Indicators for SQLi, XSS, and XML bombs?",
    answer: "SQLi: ' OR 1=1; XSS: <script>...document.cookie...; XML bomb: repetitive <!ENTITY lol...> expansions.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.4",
    color: "red"
  },
  {
    id: "150",
    question: "Session hijacking—how does it usually work?",
    answer: "Steal/predict session cookies/tokens to impersonate an authenticated user and take over sessions.",
    domain: "Threats, Vulnerabilities & Mitigations",
    domainNumber: "2.0",
    objective: "2.2",
    color: "red"
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