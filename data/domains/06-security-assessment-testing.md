# Domain 6: Security Assessment and Testing

## Assessment, test, and audit strategy (6.1)
- Definition (ISC2 framing): the strategy decides *what* assurance management needs, *who* provides it (internal, external, third-party), *where* (on-premises, cloud, hybrid) and how often; assessments, tests and audits are how management verifies controls work — not how the SOC finds bugs [ISC2 outline]. **Assurance** = degree of confidence that security needs are satisfied; must be continually maintained and reverified [OSG glossary]
- Key facts:
  - Vocabulary layers [OSG glossary]:

  | Term | Who / purpose | Output | Example |
  | --- | --- | --- | --- |
  | **Security test** | Verifies one control functions (scans, tool-assisted pentests, manual attempts); on a schedule | Pass/fail per control | Monthly Nessus run flags CVE-x on 12 hosts |
  | **Security assessment** | Trained professional; comprehensive review incl. risk assessment; recommends remediation | Report to management | Analyst report ranks those 12 by exposure, adds a fix plan |
  | **Security audit** | Same techniques, but by **independent** auditors, to demonstrate effectiveness to a **third party** | Attestation / opinion | Outside firm attests to a customer that the patch process works |

  - **NIST SP 800-115** (Technical Guide to Information Security Testing and Assessment, Sep 2008) [NIST SP 800-115]:
    - Three assessment methods: **testing** (exercise object under specified conditions, compare actual vs expected), **examination** (check/inspect/review/observe/analyze to obtain evidence), **interviewing** (discussions to clarify or locate evidence). Example: running the scanner = testing; reading the firewall ruleset = examination; asking the firewall admin how rule changes get approved = interviewing
    - Assessment lifecycle: 1. **Planning** (assets, threats, controls, approach — run it as a project) 2. **Execution** (identify and validate vulnerabilities) 3. **Post-execution** (root cause, mitigation recommendations, final report)
    - Technique families (review / target identification and analysis / target vulnerability validation) — see 6.2 entry
  - **NIST SP 800-53A Rev. 5** (Assessing Security and Privacy Controls in Information Systems and Organizations, Jan 2022) [NIST SP 800-53A]: methods **examine / interview / test**; attributes **depth** (rigor) and **coverage** (scope), each valued **basic / focused / comprehensive**; finding per determination statement = **satisfied** or **other than satisfied**
  - **SP 800-53** controls that drive the strategy [NIST SP 800-53A]: **CA-2** Control Assessments, **CA-5** Plan of Action and Milestones (POA&M), **CA-7** Continuous Monitoring, **CA-8** Penetration Testing, **RA-5** Vulnerability Monitoring and Scanning, **PM-31** Continuous Monitoring Strategy
  - **NIST SP 800-137** (Information Security Continuous Monitoring — ISCM, Sep 2011): assessment is not a point-in-time event; ongoing visibility into assets, threats, vulnerabilities and control effectiveness [NIST SP 800-137]. Example: weekly authenticated scans and EDR posture feeding a live dashboard, not the annual pentest
  - Who performs (shared with 6.5) [ISC2 outline] [OSG glossary]:

  | Assessor | Control over scope | Independence | Typical use |
  | --- | --- | --- | --- |
  | **Internal** | Within organization | Low — reports to management (ideally audit committee) | Continuous, cheap, audit readiness |
  | **External** | Org hires outside firm | High — no conflict of interest | Certification, regulator-facing attestation |
  | **Third-party** | Outside **enterprise** control [ISC2 outline] — commissioned by regulator/customer/partner, who sets scope [unverified — interpretation; outline says only "outside of enterprise control"] | Highest | Right-to-audit clauses, supplier assurance |

  - Location [ISC2 outline]: **on-premises** = direct access to systems and evidence; **cloud** = shared responsibility — provider layer assured via the provider's attestations (SOC 2, ISO/IEC 27001 certificate), customer layer tested directly; **hybrid** = both plus the seams (identity federation, connectivity)
  - Scheduling drivers: regulatory/contractual mandates, asset criticality, change (post-deployment, post-incident), and preserving auditor **independence** [ISC2 outline]
- Exam traps / distractors:
  - **Audit vs assessment**: identical techniques; discriminator is **independence** and audience. Staff who design/operate controls have an inherent **conflict of interest** as evaluators [OSG glossary]. Example: your SOC lead maps detection coverage to ATT&CK and lists gaps to fix = assessment; an outside firm does the same mapping to attest to a customer = audit — the technique did not change
  - **Test vs assessment**: a scan is a test; test results + risk context + recommendations = assessment. Example: the raw Nessus export = test; the export plus "these 4 are internet-facing, fix first" = assessment
  - **External vs third-party**: both outside the organization; third-party is also outside the **enterprise's control** — someone else commissions it and sets scope [ISC2 outline]. The OSG glossary equates external and third-party audit [OSG glossary]; the outline splits them — follow the outline. Example: internal = your GRC team samples SOC runbooks against policy; external = the ISO 27001 certification body your org hired; third-party = the customer's auditor exercising a right-to-audit clause — you picked neither them nor the scope
  - Cloud: you cannot pentest the provider's hypervisor — you review their **attestation**; "best" answer for provider assurance is usually a SOC 2 Type II report, not a right-to-audit demand
  - **Depth vs coverage** (SP 800-53A): rigor vs breadth — "sample more systems" = coverage; "trace the logic, don't just read the policy" = depth. Example: checking the password policy on 50 servers instead of 5 = coverage; actually trying a weak password on them instead of reading the GPO = depth
- Related terms: SOC reports (6.5), continuous monitoring (1.9, 7.2), risk assessment (1.9), RMF assess step (1.9), scoping and tailoring (2.6)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-115], [NIST SP 800-53A], [NIST SP 800-137], [unverified]

## Vulnerability assessment, penetration testing, and adversary exercises (6.2)
- Definition (ISC2 framing): technical control testing at increasing depth: scan (find known holes automatically) -> vulnerability assessment (scan + risk context) -> penetration test (authorized humans exploit to prove impact) -> red/purple exercises and breach and attack simulation (continuous, adversary-emulating). Management's question is not "is it exploitable" but "is it **authorized**, **scoped** and **reported** to the right people" [ISC2 outline]
- Key facts:
  - **Vulnerability scan** = automated probe for *known* weaknesses; **vulnerability assessment** normally combined with a risk assessment; both are elements of a **vulnerability management** program [OSG glossary]. Scanners have high **false positive** rates -> calibrate, validate findings manually [NIST SP 800-115]
  - **Credentialed / authenticated scan** = scanner given a (read-only) account, reads configuration directly -> fewer false positives, host-level findings; unauthenticated = attacker's view [OSG glossary] [NIST SP 800-115]
  - **SCAP** (Security Content Automation Protocol, NIST) = common naming + automation for vulnerability and configuration data [OSG glossary] [NIST SP 800-115]:

  | Component | Names / describes |
  | --- | --- |
  | **CVE** (Common Vulnerabilities and Exposures) | Publicly known vulnerabilities |
  | **CVSS** (Common Vulnerability Scoring System) | Severity 0–10; **Base / Temporal / Environmental** metric groups; vector string |
  | **CPE** (Common Platform Enumeration) | Operating systems, applications, devices |
  | **CCE** (Common Configuration Enumeration) | Configuration issues |
  | **XCCDF** (Extensible Configuration Checklist Description Format) | Security checklists |
  | **OVAL** (Open Vulnerability and Assessment Language) | Testing procedures |

  - **SP 800-115 technique families** [NIST SP 800-115]:

  | Family | Nature | Techniques |
  | --- | --- | --- |
  | **Review** | Passive, minimal risk | Documentation, log, ruleset, system configuration review; network sniffing; file integrity checking |
  | **Target identification and analysis** | Active, non-exploitative | Network discovery; port/service identification; vulnerability scanning; wireless scanning |
  | **Target vulnerability validation** | Exploitative | Password cracking; penetration testing; social engineering |

  - **Penetration test** = customized vulnerability scan by trained, *authorized* specialists; forms: external, disgruntled insider, social engineering, physical, remote/VPN [OSG glossary]. Four-stage methodology [NIST SP 800-115]: 1. **Planning** — rules identified, management approval documented, goals set 2. **Discovery** — information gathering and scanning, then vulnerability analysis 3. **Attack** — verify vulnerabilities by exploiting them; loops back to discovery as access grows (figure steps: gain access -> escalate privileges -> system browsing -> install additional tools [NIST SP 800-115 Sec. 5.2 — figure is an image; step names paraphrase the surrounding text: successful exploit grants access, some exploits escalate privileges, testers identify information that can be gleaned/changed/removed, then install more tools and loop back to discovery]) 4. **Reporting** — concurrent with all other phases. External testing usually precedes internal
  - **Rules of engagement (RoE)** = document defining means and manner of testing: scope, test types, depth [OSG glossary]. SP 800-115 App. B template: purpose, scope, assumptions/limitations, risks, personnel and points of contact (incl. incident response), schedule and hours, test site and access, data handling [NIST SP 800-115]. The RoE *is* the assessment plan; no written authorization = criminal exposure
  - Knowledge levels — ISC2 retired the box colors [OSG glossary]:

  | Current term | Legacy term | Tester knows | Example |
  | --- | --- | --- | --- |
  | **Unknown environment** | Black box | Nothing; outsider view, inputs/outputs only | Tester gets only the company name |
  | **Partially known environment** | Gray box | Some design/architecture; user-perspective analysis | Tester gets a standard user account and a network diagram |
  | **Known environment** | White box | Full structure, hardware/software, policies | Tester gets source, admin credentials, architecture docs |

  - **Overt** (white hat) vs **covert** (black hat) testing [NIST SP 800-115]: overt = staff aware, cheaper, lower risk, more common; covert = realistic test of detection/response, slower and costlier, exploits only enough to show access, stops at an agreed boundary. Example: overt = SOC knows the dates and tester IPs, alerts are expected; covert = only the CISO knows, and whether the SOC catches the C2 beacon *is* the result
  - Team colors [OSG glossary]:

  | Team | Role | Example |
  | --- | --- | --- |
  | **Red** | Attackers | Contracted operators running a C2 campaign against prod |
  | **Blue** | Defenders | Your SOC shift triaging the resulting alerts |
  | **Purple** | One team doing both — offense feeds defense in real time | Red fires a technique, blue checks the SIEM, both tune the rule in the same session |
  | **White** | Referees: set the RoE and boundaries, ensure both sides follow the rules | CISO's deputy who holds the RoE and calls "stop" on an out-of-scope host |

  - **Breach and attack simulation (BAS)** = automated, continuous, safe emulation of attack techniques to measure whether controls detect/prevent; validates control *effectiveness*, does not discover new vulnerabilities [ISC2 outline — "Breach attack simulations" listed under 6.2, term only] [unverified — definition; no ISC2, NIST or OSG glossary definition located (audit 2026-09-28)]. Example: a BAS agent drops a known Mimikatz sample daily to confirm EDR still blocks it; it will not find the new RCE in your VPN appliance
  - **Compliance checks / compliance testing** = verify a system conforms to laws, regulations, baselines, standards, policies [OSG glossary]; automated via SCAP (XCCDF/OVAL) against a **benchmark** = documented requirement list / secure configuration guide [OSG glossary]. Compliant != effective
  - Controls: SP 800-53 **RA-5**, **CA-8** [NIST SP 800-53A]
- Exam traps / distractors:
  - **Scan vs pentest**: scanner checks *possible existence*; pentest *verifies by exploitation* and shows impact [NIST SP 800-115]. "Most thorough" -> pentest; "least disruptive / most frequent" -> scan
  - **Assessment vs pentest**: assessment = broad review + risk recommendations; pentest = adversarial proof and one input to it. Example: pentest report says "Domain Admin via Kerberoast in 4 hours"; assessment says "service-account hygiene is weak across three business units — here is the remediation program"
  - **Red vs purple**: separate offense with a debrief afterwards = red/blue; collaboration during = purple. **White team** != white box
  - Covert test detected by the SOC = the *response* was tested (blue success), not a failed test
  - First step of a pentest = **planning / RoE and written authorization**, never reconnaissance; "obtain written permission" beats "define scope" if both are offered — permission is the legal gate
  - **Compliance check passes** does not mean risk is acceptable; **benchmark** (config guide) vs **baseline** (org minimum) vs **standard** (mandatory rule). Example: CIS Benchmark for Windows Server = benchmark; your hardened Windows image that drops 10 CIS items = baseline; "all servers run the approved image" = standard
  - Credentialed scan is not a pentest; unauthenticated scan reflects the attacker's view but misses host configuration
- Related terms: vulnerability/patch management (7.8), threat hunting (7.2), risk assessment (1.9), change management (7.9), CVSS in risk analysis (1.9)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-115], [NIST SP 800-53A], [unverified]

## Control testing: log review, synthetic transactions, code review, misuse case, coverage, interface testing (6.2)
- Definition (ISC2 framing): non-adversarial control tests answering "does the control work as designed, all the time, at every seam" — management's evidence set complementing scans and pentests [ISC2 outline]
- Key facts:
  - **Log review / log analysis** = reviewing audit trails for policy violations, malicious events, downtime, trends [OSG glossary]; a passive review technique that also validates the *logging itself* (configuration, retention, clock sync) [NIST SP 800-115]. **NIST SP 800-92** Guide to Computer Security Log Management (Sep 2006) [NIST SP 800-92]; SP 800-53 **AU-6** Audit Record Review, Analysis, and Reporting [NIST SP 800-53A]. Exam angle: detective control test; NTP synchronization is the prerequisite for correlation [NIST SP 800-92 Sec. 3.2 fn. 24 — use NTP to keep log sources' clocks consistent for event correlation]; SP 800-53 **SC-45(1)** System Time Synchronization | Synchronization with Authoritative Time Source (formerly AU-8(1), withdrawn/moved) [NIST SP 800-53A]. Example: pull a sample of Domain Admin logons and match each to a change ticket; the same exercise shows whether the DCs are actually forwarding 4624s
  - **Synthetic transactions** = scripted transactions with known expected results; deviations = possible flaws [OSG glossary]. **Synthetic monitoring** = artificial transactions against a site to assess performance (active monitoring) [OSG glossary] vs **real user monitoring (RUM)** = passive capture of actual users [unverified — industry term; no NIST/ISO/OSG glossary definition found (audit 2026-09-28)]. Verify functionality, availability, SLA — not vulnerabilities. Example: synthetic = a scripted login every 5 min from the monitoring host; RUM = latency measured from real users' browsers
  - **Benchmark** = documented requirement list / secure configuration guide [OSG glossary]; in 6.2 it pairs with synthetic transactions as the performance/availability yardstick
  - **Code review** = vulnerability assessment by combing source code for flaws and logic errors [OSG glossary]. Formality spectrum [unverified — OSG chapter text, not glossary; taxonomy originates in vendor literature, no primary standard (audit 2026-09-28)]:

  | Type | Mechanics | Rigor | Example |
  | --- | --- | --- | --- |
  | **Over-the-shoulder** | Author walks a peer through the code | Lowest | Dev turns the monitor to show a teammate a new regex |
  | **Email pass-around** | Code mailed to reviewers, asynchronous | Low | Pull-request link posted to the team channel; comments trickle in |
  | **Pair programming** | Two developers, one keyboard, continuous review (Agile/XP) | Medium | Two devs, one screen, writing the parser together |
  | **Tool-assisted** | Static analyzers, review platforms | Medium | SonarQube gate blocks the merge on a hardcoded secret |
  | **Fagan inspection** | Formal; six phases: planning, overview, preparation, inspection meeting, rework, follow-up [unverified — Fagan 1976 (IBM Systems Journal 15(3)) and 1986 (IEEE TSE 12(7)) are paywalled; secondary sources say the 1976 paper lists five operations and **planning** was added in 1986 — verify against the papers] | Highest — catastrophic-impact environments [OSG glossary] | Scheduled inspection meeting, defect log, mandatory rework and re-check — flight-control firmware |

  - Testing modes [OSG glossary]:

  | Mode | Runs code? | Aka | Notes |
  | --- | --- | --- | --- |
  | **Static** | No — source or compiled binary | SAST (static application security testing) | Pattern matching, known bad subroutines |
  | **Dynamic** | Yes — runtime environment | DAST (dynamic application security testing) | Often the *only* option for someone else's software |
  | **Interactive** | Yes — agent instrumented inside the running app | IAST (interactive application security testing) | Sensor modules instrumented in the app code, tests while the app is exercised [OWASP DevSecOps Guideline]; outline 8.2 term [ISC2 outline]; "combines both" framing [unverified — OWASP does not describe IAST as a SAST+DAST hybrid] |

  - **Fuzzing** = dynamic; feeds invalid/random/crafted input, watches for crashes, overflows, unpredictable behavior [OSG glossary]: **mutation** (dumb) = modify known inputs; **generational** (intelligent) = build inputs from a model of expected input [OSG glossary]. Tool: **zzuf** = mutation fuzzer [OSG glossary]
  - **Misuse / abuse case testing** = enumerate known misuse cases, then attempt them manually or automatically — models the attacker [OSG glossary]. Inverse of use-case (happy-path) testing; derives from threat modeling
  - **Test coverage analysis** = estimates the degree of testing conducted [OSG glossary]; coverage = tested cases / total cases; criteria [unverified — OSG chapter text; no primary standard defines this list (audit 2026-09-28)]:

  | Criterion | Every ... exercised | Example |
  | --- | --- | --- |
  | **Statement** | Line of code | Every line of the password-reset function ran once |
  | **Branch** | If/else path | Both "token valid" and "token expired" paths taken |
  | **Condition** | Boolean sub-expression, true and false | `isAdmin && !locked` with each operand true and false |
  | **Function** | Function called | Every helper in the module called at least once |
  | **Loop** | Loop run 0, 1, many times | Retry loop run with 0, 1 and max attempts |

  - **Interface testing** = modules assessed against interface specifications so they work together when development completes [OSG glossary]; outline scope **UI**, **network interfaces**, **APIs** [ISC2 outline]. APIs: authentication, per-method authorization, input validation, rate limiting. Example: API = call /transfer with another user's account ID and expect 403; UI = field validation and tab order; network interface = TLS handshake and malformed packets between the two services
  - Adjacent test types [OSG glossary]: **regression** = new code behaves like old except intended changes; **unit** = each component in isolation; **UAT** (user acceptance testing) = dynamic, can a typical user work with it; **stress** = behavior under workload. Example: unit = the hashing function alone; regression = old login still works after MFA was added; UAT = help-desk staff try the new ticket form; stress = 10x normal logins at shift change
  - Control: SP 800-53 **SA-11** Developer Testing and Evaluation [NIST SP 800-53A]
- Exam traps / distractors:
  - **Synthetic transaction vs RUM**: scripted/proactive vs observed/real users; synthetic finds outages *before* users do
  - **Static vs dynamic**: "no source code available" -> dynamic; "found before compile" -> static; "flaw only manifests at runtime with real input" -> dynamic/fuzzing. Example: SAST = Semgrep flags `strcpy` in the repo before build; DAST = Burp scanner hits the running app's login form; IAST = an agent inside the app's runtime watches which code paths the scanner actually reaches
  - **Mutation vs generational fuzzing**: modifies samples vs builds from a model; generational needs protocol knowledge, reaches deeper. Example: mutation = flip bytes in a captured valid PDF and feed it to the parser; generational = build SMB packets from the spec to reach deep parsing states
  - **Misuse case vs penetration test**: development-phase structured test of specified abuse scenarios vs adversarial test of a deployed system. Example: misuse case = QA test plan says "submit a negative quantity in the cart" and the dev team runs it; pentest = a hired tester finds it in prod along with whatever else is there
  - **Coverage analysis** measures the *testing*, not code quality; 100% statement coverage != all branches tested. Example: `if (x) y();` run only with x true = 100% statement coverage, false branch never tested
  - **Fagan** = most formal, not fastest; **pair programming** is a development practice that yields review, not a review event
  - **Interface testing** targets the *seams*; unit testing targets components; integration testing is the broader phase
  - **Log review** verifies logging and detects events; it is not continuous monitoring (7.2) and not an audit. Example: quarterly sample of VPN logs = log review; the SIEM rule alerting on impossible travel in near real time = continuous monitoring
- Related terms: SAST/DAST/IAST/SCA (8.2), threat modeling (1.10), SDLC (8.1), SIEM/log management (7.2), change management (7.9)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-115], [NIST SP 800-92], [NIST SP 800-53A], [OWASP DevSecOps Guideline], [unverified]

## Security process data collection (6.3)
- Definition (ISC2 framing): the *administrative* evidence proving the program runs — account reviews, sign-offs, metrics, backup and recovery test results, training records. Technical tests prove controls work; process data proves the **management system** works [ISC2 outline]
- Key facts:

  | Data set | What is collected | Proves |
  | --- | --- | --- |
  | **Account management** | Approvals for creation/privilege change, terminations, dormant accounts; periodic **access review** (full or sampled), privileged and service accounts first | Provisioning lifecycle enforced — SP 800-53 **AC-2** [NIST SP 800-53A] |
  | **Management review and approval** | Top management reviews the ISMS (information security management system) at planned intervals: prior actions, changes, performance feedback, audit results, risk status -> improvement decisions | Governance engaged — ISO/IEC 27001:2022 clause **9.3** [NIST OLIR ISO/IEC 27001:2022→CSF 2.0 — confirms 9.3 is a mandatory clause] [unverified — clause title/content; iso.org OBP returned 403] |
  | **KPI / KRI** | See below | Performance and rising exposure |
  | **Backup verification** | Restore tests; media reliability and information integrity checks at defined frequency — SP 800-53 **CP-9(1)** [NIST SP 800-53A] | Data is recoverable, not just backed up |
  | **Training and awareness** | Completion rates, phishing-simulation click/report rates, training records — SP 800-53 **AT-4** [NIST SP 800-53A] | Human control effectiveness |
  | **DR / BC** | Exercise type, date, results, lessons learned — SP 800-53 **CP-4** [NIST SP 800-53A] | Recoverability within RTO/RPO |

  - **KPI** (key performance indicator) = metric of operation or failure of security aspects so management can decide on changes [OSG glossary] — **lagging**, measures achievement (patch-SLA compliance, MTTD/MTTR, training completion). **KRI** (key risk indicator) = **leading**, signals rising exposure before loss (trend in unpatched criticals, orphaned privileged accounts, vendor findings open > 90 days) [NIST SP 800-55v1 Sec. 4.4 — KRI "a metric used to measure risk"; **leading indicator** = predictive metric tracking events that precede incidents; **lagging indicator** = tracks the outcome of events; KPI = measure of progress toward intended results] — the KPI=lagging / KRI=leading pairing is a common framing, not stated by NIST [unverified]. Good indicators: tied to an objective, measurable, thresholds, trended, owned. Example: KPI = mean time to triage (how well we perform); KRI = count of unpatched internet-facing criticals (how much risk is building)
  - ISO/IEC 27001 clause **9** Performance evaluation: **9.1** monitoring, measurement, analysis and evaluation; **9.2** internal audit; **9.3** management review; clause **10** improvement (nonconformity, corrective action, continual improvement) [NIST OLIR ISO/IEC 27001:2022→CSF 2.0 — 9.1, 9.2, 9.3, 10.1, 10.2 confirmed as mandatory clause numbers] [unverified — clause titles; iso.org OBP and Annex SL harmonized-structure PDF returned 403; secondary sources concordant]
  - DR/BC test types, least to most disruptive [OSG glossary]:

  | Test | Mechanics | Example |
  | --- | --- | --- |
  | **Checklist** / read-through | DR checklists distributed, reviewed individually | Each team lead reads their DR runbook at their desk |
  | **Structured walk-through** / **tabletop** | Group talks through the plan against a scenario; no systems touched | Leads in one room talk through "ransomware hits the file servers" |
  | **Simulation** | Scenario given; some response measures actually executed; may interrupt noncritical operations | Team restores one file server from backup into a test VLAN |
  | **Parallel** | Personnel relocate to the alternate site and activate it; primary keeps running | Hot site brought up on a copy of the day's batch; prod untouched |
  | **Full interruption** | Primary shut down, operations moved — highest risk, needs senior approval [ISC2 outline] | Prod datacenter powered off for the weekend; business runs on the hot site |

  - Backup verification: a "job succeeded" log is not verification; verification = **test restore** of a sample to a clean system and compare, at a defined frequency; also confirm offsite/immutable copies and restore *time* against RTO
- Exam traps / distractors:
  - **KPI vs KRI**: past performance vs future risk. "Incidents last quarter" = KPI; "% critical systems past patch SLA" = KRI (predicts incidents). KRIs feed the risk register
  - **Management review** (clause 9.3, top management) vs **internal audit** (9.2, auditors) vs **monitoring** (9.1, control owners): *who does it* is the discriminator. Example: SOC manager's monthly MTTD dashboard = 9.1; GRC auditor samples 20 incidents against the IR procedure = 9.2; CISO and COO meet twice a year to decide budget and priorities from both = 9.3
  - **Account review** is a detective administrative control; provisioning/deprovisioning is preventive (5.5). Samples must include privileged and service accounts. Example: quarterly export of Domain Admins members, each matched to an approval ticket = review (detective); the joiner/mover/leaver workflow that creates and disables accounts = provisioning (preventive)
  - **Backup verified** = restore proven — not job succeeded, not checksum alone
  - **Tabletop vs simulation vs parallel**: talking vs doing some vs running the alternate site; **full interruption** is the only one that stops production
  - Training effectiveness = behavior change (click/report rate trend), not attendance. Example: phishing click rate 30% -> 8% over four quarters = effective; "100% completed the module" = attendance
- Related terms: access review and provisioning lifecycle (5.5), BIA/RTO/RPO (1.7), DRP testing (7.12), awareness program evaluation (1.12), continuous monitoring (1.9)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53A], [NIST SP 800-55v1], [NIST OLIR ISO/IEC 27001:2022→CSF 2.0], [unverified]

## Analyze test output and report (6.4)
- Definition (ISC2 framing): turning raw findings into risk-ranked, audience-appropriate decisions — fix it (**remediation**), formally accept it (**exception**), or tell the vendor/public responsibly (**ethical disclosure**) [ISC2 outline]
- Key facts:
  - SP 800-115 post-execution: analysis (root cause, categorize, strip **false positives**), then 8.1 **mitigation recommendations**, 8.2 **reporting**, 8.3 **remediation/mitigation** [NIST SP 800-115]
  - Report structure: executive summary (business risk, trend vs last test), scope/method/RoE, findings ranked by risk (CVSS as input, not verdict — apply environmental context), evidence, recommendations with owner and date, appendices (raw data). Audiences: executives (risk, cost), management (priorities, owners), technical staff (reproduction steps). Findings are **sensitive** — restrict distribution, protect in transit and at rest [NIST SP 800-115]
  - **Remediation** = process of dealing with compromise, attack, downtime, etc. [OSG glossary]; here: fix root cause, **retest** to confirm closure, track open items — federal vehicle **POA&M** (Plan of Action and Milestones, SP 800-53 **CA-5**) [NIST SP 800-53A]. Prioritize by risk (likelihood x impact), asset criticality, exploit availability — not by finding count
  - **Exception handling** (6.4 sense) = a finding that cannot or will not be fixed on schedule is formally documented: business justification, **compensating controls**, residual risk, **risk owner** sign-off, **expiry / review date**. It is risk acceptance made auditable. Distinct from programming **exception / error handling** = code that anticipates errors to avoid termination [OSG glossary]. Example: risk-register entry with the plant manager's signature and a 6-month expiry = 6.4 exception; try/catch around a file read = programming exception handling
  - **Ethical disclosure** = a professional who finds a vulnerability reports it to the vendor, giving them opportunity to patch [OSG glossary]. Models [unverified — no primary taxonomy; ISO/IEC 29147 covers coordinated disclosure only, and iso.org returned 403 (audit 2026-09-28)]:

  | Model | Mechanics | Example |
  | --- | --- | --- |
  | **Full disclosure** | Publish immediately, no vendor lead time | PoC posted to a public mailing list the day it is found |
  | **Responsible / coordinated disclosure** | Report privately; publish after fix or agreed window (e.g., 90 days) | Report to vendor PSIRT; advisory out once the patch ships or the clock runs out |
  | **Nondisclosure** | Never publish; hoard or sell | Exploit broker buys it; the vendor never hears |
  | **Bug bounty** | Vendor-run coordinated disclosure with reward | Submitted via the vendor's HackerOne program, paid on triage |

  - Standards: **ISO/IEC 29147:2018** Vulnerability disclosure (vendor <-> finder interface) [ISO/IEC 29147]; **ISO/IEC 30111:2019** Vulnerability handling processes (vendor's internal triage and remediation — "how to process and remediate reported potential vulnerabilities in a product or service") [ISO/IEC 30111 — iso.org catalogue entry]
  - Also report where legal/contractual duties apply — breach notification, regulators, contract parties (1.4); the ISC2 Code of Ethics canons govern disclosure conduct (1.1)
- Exam traps / distractors:
  - **Exception != ignore**: documented, approved by the **risk owner** (business, not IT), time-bound, with compensating controls. "Security team decides to accept" -> wrong owner. Example: unpatchable SCADA host — plant manager signs, segment isolated as compensating control, review in 6 months = exception; "it's in the backlog" = ignore
  - **Remediate vs mitigate**: eliminate root cause vs reduce likelihood/impact via compensating control. The report must say which. Example: patch the Exchange server = remediate; leave it unpatched but restrict OWA to VPN and add a WAF rule = mitigate
  - **False positive** handling belongs in **analysis**, before the report; unvalidated scanner output is a defective report
  - **Ethical disclosure** = vendor first, reasonable time, then public — not immediate publication (full disclosure), not silence. A bug in a third-party product found during a client pentest goes to the **client** per the RoE; client and tester coordinate with the vendor. Example: you find a 0-day in the client's Citrix gateway mid-pentest — it goes in the client report, then you and the client notify Citrix; it does not go on social media
  - **Severity != priority**: CVSS base is generic; priority adds business context (exposure, criticality, compensating controls). Example: CVSS 9.8 on an isolated lab box vs CVSS 6.5 on the internet-facing VPN appliance — the 6.5 goes first
  - Executive summary leads with **business risk**, not the vulnerability list. Example: "customer PII reachable from the internet via one unpatched host", not "47 findings, 3 critical"
- Related terms: risk response/acceptance and risk register (1.9), POA&M/RMF (1.9), vulnerability management (7.8), incident reporting (7.6), ISC2 ethics (1.1)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-115], [NIST SP 800-53A], [ISO/IEC 29147], [ISO/IEC 30111], [unverified]

## Security audits (6.5)
- Definition (ISC2 framing): **audit** = methodical examination of an environment to ensure compliance and detect abnormalities, unauthorized occurrences or crimes [OSG glossary]; a **security audit** demonstrates control effectiveness to a **third party** and must be performed by **independent** auditors — same techniques as an assessment, different purpose and performer [OSG glossary]. **Auditor** = person/group who tests and verifies the security policy is properly implemented [OSG glossary]
- Key facts:
  - Audit types [OSG glossary] [ISC2 outline]:

  | Type | Performed by | Audience | Independence |
  | --- | --- | --- | --- |
  | **Internal** | Organization's internal audit staff | Internal management, audit committee | Limited — reports to board/audit committee, not the CISO |
  | **External** | Outside auditing firm hired by the org | Org, its customers, regulators | High — no conflict of interest [OSG glossary] |
  | **Third-party** | Auditor commissioned by *another* entity (regulator, customer, partner), which sets scope [unverified — interpretation; outline says only "outside of enterprise control"] [ISC2 outline] | The commissioning party | Highest; outside enterprise control |

  - **Attestation** = verification and validation of something as true and accurate [OSG glossary]; audit output = the auditor's **opinion**
  - **SOC reports** (System and Organization Controls; AICPA — American Institute of Certified Public Accountants) under **SSAE** (Statement on Standards for Attestation Engagements) [OSG glossary]; current standard **SSAE No. 18** (Attestation Standards: Clarification and Recodification — "recodifies and supersedes SSAE Nos. 10–17", so incl. SSAE 16 [AICPA — SSAE No. 18 resource page]; effective 1 May 2017 and SSAE 16-superseded-SAS 70 lineage [unverified — SSAE 18 PDF is login-gated at aicpa-cima.com]):

  | Report | Subject | Audience / use | Example |
  | --- | --- | --- | --- |
  | **SOC 1** | Controls relevant to user entities' **internal control over financial reporting** (ICFR) | Customer's financial auditors; restricted use | Payroll SaaS report your CFO's auditors read at year-end |
  | **SOC 2** | Controls vs **Trust Services Criteria** — security, availability, processing integrity, confidentiality, privacy | Customers/regulators under NDA; restricted use; detailed | 80-page report the SaaS vendor sends your vendor-risk team under NDA |
  | **SOC 3** | Same criteria as SOC 2, less detail | **General use** — publishable, marketing | "SOC 3" badge and summary on the vendor's public trust page |

    [OSG glossary] [AICPA]. Only **security** (the common criteria) is mandatory in a SOC 2; the other four are optional [unverified — 2017 TSC document is login-gated at aicpa-cima.com; check its introduction (audit 2026-09-28)]

  - **Type I vs Type II** [AICPA]:

  | Attribute | Type I | Type II |
  | --- | --- | --- |
  | Question | Controls fairly described and suitably **designed**? | Controls **operating effectively**? |
  | Time | **Point in time** (ISAE 3402 type 1: "as at the specified date") | Over a **period** (ISAE 3402 type 2: "throughout the specified period" [IAASB ISAE 3402 para 9]; commonly 6–12 months [unverified — AICPA SOC 2 guide paywalled]) |
  | Assurance | Lower | Higher — the one to ask a provider for |

  - International counterpart: **ISAE 3402** (International Standard on Assurance Engagements; IAASB — International Auditing and Assurance Standards Board) — assurance reports on controls at a service organization relevant to user entities' financial reporting, i.e., SOC 1 equivalent [IAASB ISAE 3402 para 1]; type 1 (description and design of controls as at a specified date) / type 2 (adds operating effectiveness throughout a specified period) mirrors SOC [IAASB ISAE 3402 para 9]; effective for periods ending on or after 15 June 2011 [IAASB ISAE 3402 para 7]
  - **ISO/IEC 27001**: clause **9.2** internal audit at planned intervals (conformity to own requirements and to the standard; effective implementation) [NIST OLIR ISO/IEC 27001:2022→CSF 2.0 — 9.2 confirmed as a mandatory clause; mapped to CSF ID.IM-01 "improvements identified from evaluations"] [unverified — clause title/content; iso.org 403]; certification audit by an accredited body = external (outline framing). **ISO 19011** = Guidelines for auditing management systems (ed. 2018, superseded by ed. 2026) [ISO 19011 — iso.org catalogue]. ISO 19011 taxonomy: **first-party** = internal; **second-party** = by interested parties such as customers; **third-party** = independent bodies (certification/registration, regulators) — so ISO calls a certification-body audit *third-party* where the outline calls it *external*; exam follows the outline [ISO 19011 — iso.org summary]. Example: a customer's auditors visiting your SOC = second-party (ISO 19011) but third-party (outline); your certification body = third-party (ISO 19011) but external (outline)
  - Audit process: 1. Define scope, objectives, **criteria** (standard, policy, contract) 2. Plan — sampling, evidence requests, schedule 3. Fieldwork — examine, interview, test (SP 800-53A vocabulary) 4. Findings — nonconformities/deficiencies rated 5. Report with management response 6. Follow-up — verify corrective action [unverified — generic synthesis; check ISO 19011 cl. 6 "Conducting an audit" (initiating, preparing, conducting, reporting, completing, follow-up) — iso.org 403 (audit 2026-09-28)]
  - Location [ISC2 outline]: on-premises = direct evidence; cloud = rely on the provider's SOC 2 Type II / ISO 27001 certificate / FedRAMP authorization for the provider layer — hyperscalers do not accept customer audits; a **right-to-audit clause** is the lever for smaller vendors; hybrid = map each control to the responsible party first (shared responsibility), then audit each side appropriately. Example: you cannot audit AWS's datacenter — read its SOC 2 Type II; for the 20-person MSSP you write a right-to-audit clause and send your own GRC team
  - Independence mechanics: auditors may not audit controls they designed or operate; internal audit reports functionally to the **audit committee**; rotate external firms; auditors get **read-only** access and no remediation role. Example: the engineer who wrote the firewall ruleset does not audit it; the auditor gets read-only SIEM access and files findings — the SOC fixes them
- Exam traps / distractors:
  - **SOC 1 vs SOC 2**: financial-reporting controls vs security/TSC. A payroll processor's customer's *financial* auditor wants SOC 1; a CISO evaluating a SaaS vendor's security wants SOC 2
  - **SOC 2 vs SOC 3**: same criteria; SOC 3 is the **public**, summarized one — "vendor posts report on website" = SOC 3; "detailed test results under NDA" = SOC 2
  - **Type I vs Type II**: design at a point vs operating effectiveness over time. "Best evidence controls actually worked last year" = **Type II**; a new provider may only have a Type I. Example: Type I = controls were designed right on 30 June; Type II = they operated for the 12 months ending 30 June
  - **Audit vs assessment**: independence + external audience -> audit. Internal team finding gaps to fix = assessment even if labeled "audit"
  - **Internal vs external vs third-party**: who *commissions* it and sets scope. Regulator-mandated examination = third-party; org-hired certification body = external; own staff = internal
  - **Compliance audit passed** != secure; audits test against **criteria**, not against threats. Example: PCI DSS assessment passes with every CDE control in place; the attacker comes in through the out-of-scope HR network
  - Auditor who also fixes findings = **conflict of interest** / SoD violation
- Related terms: assessment/test/audit strategy (6.1), SCRM third-party assessment (1.11), due diligence (1.3), governance/audit committee (1.3), cloud shared responsibility (3.5), vendor agreements (1.8)
- Sources: [ISC2 outline], [OSG glossary], [AICPA], [IAASB ISAE 3402], [ISO 19011], [NIST OLIR ISO/IEC 27001:2022→CSF 2.0], [unverified]
