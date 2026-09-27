# Domain 3: Security Architecture and Engineering

## Zero trust
- Definition (ISC2 framing): outline 3.1 design principle "zero trust or **trust but verify**" [ISC2 outline]; zero trust = nothing trusted by default — **deny by default, grant by explicit exception** [OSG glossary]; trust but verify = the *traditional* model, internal entities trusted automatically -> insider risk + easy **lateral movement** [OSG glossary]
- Key facts:
  - **NIST SP 800-207** "Zero Trust Architecture" (Aug 2020): defenses move from static network perimeters to users, assets, resources [NIST SP 800-207]
  - Seven tenets (Sec. 2.1) [NIST SP 800-207]:

  | # | Tenet | Gist |
  | --- | --- | --- |
  | 1 | All data/compute are **resources** | Incl. SaaS, IoT, BYOD touching enterprise data |
  | 2 | Secure comms regardless of **location** | Inside perimeter = same requirements as outside |
  | 3 | Access per **session**, least privilege | Auth to one resource != access to another |
  | 4 | **Dynamic policy** | Identity + device state + behavior + environment |
  | 5 | Monitor **posture** of all assets | CDM-style continuous diagnostics |
  | 6 | AuthN/AuthZ **dynamic, before access** | Continual re-evaluation; MFA expected |
  | 7 | Collect telemetry, **improve policy** | Feeds the trust algorithm |

  - Components (Sec. 3) [NIST SP 800-207]: `subject -> PEP ==(data plane)==> resource`, with `PA <-> PE` on a separate **control plane**

  | Component | Role |
  | --- | --- |
  | **PE** (policy engine) | Grant/deny/revoke *decision* via trust algorithm (policy + CDM + threat intel); logs it |
  | **PA** (policy administrator) | *Executes*: establishes/tears down path, issues session tokens, configures PEP |
  | **PDP** (policy decision point) | = PE + PA |
  | **PEP** (policy enforcement point) | Enables, monitors, terminates connections; may split client agent + resource gateway |

  - SOC mapping: conditional-access engine = PE; IdP issuing token = PA; ZTNA proxy/connector = PEP
  - **Microsegmentation** = dividing internal network into many subzones (down to a single device), all inter-zone traffic filtered/authenticated/encrypted [OSG glossary] — an enabler of ZT, not ZT itself
- Exam traps / distractors:
  - **Trust but verify** offered as the modern posture — it is the legacy one
  - Products/techniques (microsegmentation, SASE, MFA, ZTNA) = **enablers**, not the principle
  - Zero trust != no trust: trust evaluated **per session**, dynamically (tenet 3)
  - **PDP vs. PEP**: decides vs. enforces; "terminates the connection" -> PEP; "evaluates posture against policy" -> PE
  - Network **location** as trust signal -> wrong (tenet 2)
- Related terms: least privilege (3.1), PDP/PEP (5.4), microsegmentation (4.1), SASE (3.1), ABAC/risk-based access control (5.4)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-207]

## Secure design principles (3.1)
- Definition (ISC2 framing): design-time properties, not operational controls; outline 3.1 lists threat modeling, least privilege, defense in depth, secure defaults, fail securely, SoD, keep it simple, zero trust/trust but verify, privacy by design, shared responsibility, SASE [ISC2 outline]. Lineage: Saltzer & Schroeder 1975 (economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism, psychological acceptability) [unverified]
- Key facts:
  - Classic set [OSG glossary]:

  | Principle | ISC2 framing | Adjacent trap |
  | --- | --- | --- |
  | **Least privilege** | Minimum rights to do the job | vs. need-to-know (data), SoD (people) |
  | **Defense in depth** | Layered controls in concentric rings | vs. **diversity of defense** (different vendors/types) |
  | **Secure defaults** | Ship secure, not convenient | vs. **security through obscurity** — never valid |
  | **Fail securely** | On failure default to **deny** (fail-closed) | vs. **fail-safe** — protect life; doors open |
  | **Separation of duties** (SoD) | Compartmentalize so no one subject can subvert controls | vs. least privilege; two-person control |
  | **Keep it simple** (KISS) | Complexity = insecurity | Economy of mechanism |

  - Newer additions:

  | Principle | ISC2 framing | Note |
  | --- | --- | --- |
  | **Privacy by design** (PbD) | Privacy built in at design phase = security by design [OSG glossary] | Cavoukian 7 foundational principles [unverified] |
  | **Shared responsibility** | Orgs intertwined with the world; take your role seriously [OSG glossary] | Broader than the cloud model (cloud split -> 3.5) |
  | **SASE** (Secure Access Service Edge) | Converges network security functions with WAN capability for cloud/mobile access [OSG glossary] | Gartner term; SD-WAN + SWG/CASB/ZTNA/FWaaS [unverified] |
  | **Threat modeling** | Design-time threat identification | See Domain 1.10 entry |

  - Companion design concepts [OSG glossary]: **abstraction** = group similar elements into classes/roles for collective control assignment; **data hiding** = data placed where subject cannot see *or* access it (not merely unseen)
- Exam traps / distractors:
  - **Fail-safe vs. fail-secure**: life-safety flips the default — fire door opens (safe); firewall crash drops traffic (secure)
  - One person creates vendors AND approves payments -> **SoD** violation, not least privilege (per-task rights may be minimal; the combination is the flaw)
  - Second firewall, same vendor -> defense in depth but not **diversity of defense**; "one vuln beats all layers" -> diversity
  - Hidden admin URL as sole protection -> **security through obscurity** (invalid); secure defaults = auth on by default
  - "Provider secures the cloud, you secure what's in it" -> the 3.5 **cloud** shared responsibility model, not 3.1's societal framing
- Related terms: zero trust (previous entry), threat modeling (D1), need-to-know (7.4), cloud shared responsibility (3.5), microsegmentation (4.1)
- Sources: [ISC2 outline], [OSG glossary], [unverified]
