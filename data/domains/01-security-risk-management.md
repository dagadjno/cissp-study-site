# Domain 1: Security and Risk Management

## Key areas to master (video emphasis)
- Priority list from course video, mapped to outline sections: [unverified]
  - **Risk** concepts + risk analysis process — 1.9 [ISC2 outline]
  - **Threat modeling** concepts and methodologies — 1.10 [ISC2 outline]
  - **Compliance**, legal, regulatory, privacy — 1.4 [ISC2 outline]
  - **Professional ethics** — ISC2 Code, know it cold — 1.1 [ISC2 outline]
  - **Security governance** principles — 1.3 [ISC2 outline]
  - **Policy / standard / procedure / guideline** hierarchy — 1.6 [ISC2 outline]
- Correction to source video: **ITIL** (Information Technology Infrastructure Library) is not an outline-listed governance framework; 1.3 lists ISO, NIST, **COBIT** (Control Objectives for Information and Related Technologies), SABSA (Sherwood Applied Business Security Architecture), PCI (Payment Card Industry), FedRAMP (Federal Risk and Authorization Management Program) [ISC2 outline]. ITIL = IT service management; COBIT is the governance answer, ITIL the distractor. Example: COBIT = the board asking whether IT risk sits inside appetite; ITIL = the ServiceNow incident/change workflow the SOC files tickets in.
- Mandatory vs. discretionary: policies, standards, procedures, baselines mandatory; **guidelines** only discretionary [OSG glossary]
- Exam traps / distractors: **ITIL vs. COBIT**; guideline offered where enforcement is required
- Sources: [ISC2 outline], [unverified]

## CIA triad / five pillars
- Definition (ISC2 framing): 2024 outline 1.2 lists **five pillars**: confidentiality, integrity, availability, **authenticity**, **nonrepudiation** [ISC2 outline]
- Key facts:
  - **Authenticity** = genuine, from claimed origin; adjacent to integrity but about source, not modification [OSG glossary]. Example: spoofed `From:` header = authenticity failure even with a byte-perfect body; a MITM editing the body = integrity failure
  - **Nonrepudiation** = actor cannot deny the event; canonical control = **digital signature** [OSG glossary]. Example: a GPG-signed git commit vs. a bare author field anyone can set
  - **Availability** includes timely and uninterrupted access, not just uptime [OSG glossary]. Example: SIEM is up but a 24-hr search takes 40 min = availability failure
  - Formal C-I-A definitions: **FIPS 199** (Federal Information Processing Standards) Section 3, each quoted from **44 U.S.C.** (United States Code) **Sec. 3542** (FISMA — Federal Information Security Management Act) [NIST FIPS 199]
  - FISMA's integrity definition explicitly includes nonrepudiation and authenticity — supports the five-pillar grouping [NIST FIPS 199]
  - **DAD triad** = disclosure, alteration, destruction; failure states of C-I-A [OSG glossary]
- Exam traps / distractors:
  - **MAC/HMAC** (message authentication code / hash-based MAC) = integrity + authentication, NO nonrepudiation (shared symmetric key); **digital signature** = adds nonrepudiation [OSG glossary]. Example: JWT HS256 (HMAC, shared secret) — either side could have minted it; RS256 — only the private-key holder
  - Spoofed-origin scenario -> **authenticity**, with integrity as distractor
  - "Primarily protects" questions: encryption->**C**, hashing->**I**, redundancy/backup->**A**; distractors are adjacent pillars [unverified]
- Related terms: DAD triad, digital signature, HMAC, FIPS 199 security categorization
- Sources: [ISC2 outline], [OSG glossary], [NIST FIPS 199], [unverified]

## ISC2 Code of Professional Ethics
- Definition (ISC2 framing): preamble + **4 canons**; strict adherence mandatory for certification; must "adhere, **and be seen to adhere**" [ISC2 ethics page]
- Key facts: [ISC2 ethics page]

  | # | Canon | Example | Who can complain |
  | --- | --- | --- | --- |
  | 1 | **Protect society**, common good, public trust, infrastructure | Responsible disclosure; refuse work endangering public | **Anyone** |
  | 2 | **Act honorably**, honestly, justly, responsibly, legally | No inflated findings, exam dumps, illegality | **Anyone** |
  | 3 | Diligent and competent service to **principals** | Decline work beyond competence; guard client data | **Employers/contractors** only |
  | 4 | Advance and protect the **profession** | Mentor; report cert fraud | **Certified professionals** only |

  - Canon order = **precedence** for resolving conflicts (society > legality/honesty > principals > profession). Audit 2026-08-31: current isc2.org/ethics does NOT state precedence (says canons are "not a substitute for the ethical judgment of the professional"); precedence is OSG/common teaching — check OSG ethics chapter [unverified]
  - **Principals** = employers/clients -> canon 3 is the "duty to employer" canon
  - Enforcement: **sworn affidavit** -> Professional Conduct Committee -> board; sanction = **revocation** [ISC2 ethics page]
  - **Organizational code of ethics** (1.1, distinct from the ISC2 Code above): an org's own conduct code — not certification-enforced, no Professional Conduct Committee; violations are an HR/employment matter, not a cert-revocation matter. Should be published, require acknowledgment, and align with (not contradict) the ISC2 Code for a certified professional's dual obligation [unverified]
- Exam traps / distractors:
  - Employer-pressure scenarios: canon 3 pull is the trap; canons 1-2 outrank -> refuse/report. Example: told to bury the breach until after quarter close -> canons 1-2 win, report it
  - "**Be seen to adhere**" -> undisclosed conflict of interest violates Code even without bad acts. Example: recommending the EDR vendor your spouse sells for without disclosing it
  - **RFC 1087** (Request for Comments; IAB — Internet Activities Board — "Ethics and the Internet") as distractor for ISC2 Code questions [RFC 1087]
  - ISC2 Code violation -> **cert revocation** path; org code violation -> **HR/termination** path — different consequence tracks, don't merge them. Example: padding an expense report -> HR only; falsifying a pentest report -> HR AND ISC2 revocation
- Related terms: security governance principles (1.3, due care), RFC 1087
- Sources: [ISC2 ethics page], [RFC 1087], [unverified]

## Security documentation hierarchy (policy -> procedure)
- Definition (ISC2 framing): formal security documentation levels: **policy -> standard -> baseline -> guideline -> procedure**; standards+baselines share a tier, giving "four levels of policy development" [OSG glossary]
- Key facts: [OSG glossary]

  | Level | Function | Binding? | Example |
  | --- | --- | --- | --- |
  | **Policy** | Management intent, scope, roles | Mandatory | CEO-signed "protect data per classification" |
  | **Standard** | Compulsory uniform requirements | Mandatory | "Remote access = VPN+MFA" |
  | **Baseline** | Minimum security level to meet | Mandatory | CIS L1 image every laptop matches |
  | **Guideline** | Recommendations, methodologies | **Discretionary** | "Consider passphrases over passwords" |
  | **Procedure** | Step-by-step how-to (SOP — standard operating procedure) | Mandatory | AD user-onboarding runbook |

  - Policy types by purpose: **regulatory** (law/industry-required), **advisory** (most policies; behavior + consequences), **informative** (unenforceable) [OSG glossary]. Example: regulatory = HIPAA-driven PHI handling policy; advisory = AUP with disciplinary consequences; informative = the "why security matters" intro page
  - Policy scope: **organizational** (whole org) vs. **issue-specific** (one service/function) [OSG glossary]; NIST triple = **program / issue-specific / system-specific** policy, SP 800-12 Rev. 1 Secs. 5.2-5.4 (NIST's "program policy" = OSG's "organizational policy") [NIST SP 800-12]. Example: program = the master infosec policy; issue-specific = remote-work policy; system-specific = the SIEM's own access rules
  - **AUP** (acceptable use policy) = issue-specific policy defining acceptable activity/use of company resources; NOT the role-assigning document (that is the **organizational security policy**) [OSG glossary]. Example: "no personal cloud storage on corp laptops" = AUP; "the CISO owns the program" = organizational security policy
  - "Mandatory" binds via **senior management** authority + employment/contract relationship; sanction = **disciplinary, not legal** (law binds only via the regulation behind a regulatory policy, or independently criminal acts). Management official issues program policy, SP 800-12 Rev. 1 Sec. 5.2 [NIST SP 800-12]. Enforced policy evidences **due care** in negligence claims [unverified]. Example: USB-policy violation -> written warning/termination, not a fine or charge — unless the same act also broke HIPAA
  - Standard attaches to an **activity** (uniform org-wide rule: "remote access = VPN+MFA"); baseline attaches to a **system** (minimum config state vs. a reference: golden image, CIS level) [OSG glossary]. Baselines leveled via **SP 800-53B** "Control Baselines for Information Systems and Organizations": low/moderate/high security baselines + privacy baseline, with tailoring and overlays [NIST SP 800-53B]
- Exam traps / distractors:
  - "Which is NOT mandatory" -> **guideline**
  - **Baseline vs. standard**: rule for an activity -> standard; measurable floor for a system -> baseline
  - Policy authority -> **senior management support**; "legal requirement" = distractor
  - Correction to source video: slide listed AUP as a hierarchy level assigning roles; wrong on both counts [OSG glossary]
- Related terms: acceptable use policy, SOP, security baseline, scoping and tailoring (2.6)
- Sources: [OSG glossary], [NIST SP 800-12], [NIST SP 800-53B], [unverified]

## Risk categories and risk factors
- Definition (ISC2 framing): **categories** = impact classes: **damage**, **disclosure**, **losses** (course framing) [unverified]; **factors** = event classes producing them; threat source exploits vulnerability -> impact
- Key facts:
  - Categories align with **DAD triad**: disclosure->C failure, damage->I/destruction, losses->A/financial [unverified]
  - NIST threat-source taxonomy: **adversarial, accidental, structural, environmental** — SP 800-30 Rev. 1 App. D [NIST SP 800-30]

  | Course factor | Typical impact | SP 800-30 class |
  | --- | --- | --- |
  | Physical damage | Damage, losses | Environmental |
  | Equipment/software malfunction | Losses | Structural |
  | Attacks (internal/external) | Disclosure, damage | Adversarial |
  | Human error | Any | Accidental |
  | Application error | Losses, disclosure | Structural |

  - **Vulnerability** includes the absence of a safeguard, not only a flaw [OSG glossary]. Example: no MFA on the VPN is a vulnerability with zero CVEs involved
- Exam traps / distractors:
  - **Threat vs. vulnerability vs. risk** definitional swaps — top 1.9 question type. Example: threat = ransomware affiliate; vulnerability = unpatched Exchange with no EDR on it; risk = likelihood x impact of that box getting encrypted
  - Attacks include **internal** actors; distractor assumes external-only
  - Adversarial-looking scenario caused by misconfiguration = **accidental** -> answer is training/process
  - **SP 800-30** (assessment) vs. **SP 800-37** (RMF process) pairing
- Related terms: DAD triad, threat modeling (1.10), SP 800-30 App. D, RMF
- Sources: [NIST SP 800-30], [OSG glossary], [unverified]

## Security planning types (strategic / tactical / operational)
- Definition (ISC2 framing): **security management planning** = top-down design of documentation to reduce and hold risk at acceptable level; three time-layered plan levels, each traces to the one above [OSG glossary]
- Key facts: [OSG glossary]

  | Plan | Horizon | Content | Examples |
  | --- | --- | --- | --- |
  | **Strategic** | ~5 yrs, annual refresh | Goals, mission, objectives; planning horizon | Risk appetite, zero-trust direction |
  | **Tactical** | ~1 yr | Tasks/schedules toward strategic goals | Project plan, hiring plan, budget |
  | **Operational** | Monthly/quarterly | Detailed how-to, updated often | Patch schedule, training plan |

  - Budget as tactical-plan example is OSG-text teaching (verify OSG ch. 1) [unverified]
- Exam traps / distractors:
  - Horizon tells: "mission/5 years"->**strategic**; "this year/budget"->**tactical**; "monthly/step-by-step"->**operational**
  - **Budget = tactical**, not strategic
  - Plans (time axis) vs. **policy/standard/procedure** (authority axis) — questions swap axes. Example: "patch cycle runs monthly" in the operational plan = schedule; "criticals patched within 14 days" in a standard = rule
  - Approval authority -> **senior management**
- Related terms: security documentation hierarchy (1.6), governance alignment (1.3), planning horizon
- Sources: [OSG glossary], [unverified]

## Risk responses
- Definition (ISC2 framing): six responses; **rejection** is the only invalid one; outline 1.9 names **cybersecurity insurance** as treatment example [ISC2 outline]
- Key facts: [OSG glossary]

  | Response | Meaning | Example |
  | --- | --- | --- |
  | **Mitigate** (reduce) | Safeguards cut likelihood/impact | Patch, segment, EDR |
  | **Assign** (transfer) | Shift consequence to 3rd party | **Cyber insurance**, outsourcing |
  | **Accept** | Documented mgmt decision: control cost > loss cost | Signed acceptance memo |
  | **Avoid** | Pick lower-risk alternative activity | Don't launch feature |
  | **Deter** | Discourage violators | Banners, cameras |
  | **Reject** | Deny/ignore — **invalid**, negligence | No analysis, "won't happen" |

  - **Total risk** = threats x vulnerabilities x asset value (conceptual) [OSG glossary]
  - **Residual risk** = total risk - **controls gap** (gap = risk removed by safeguards) [OSG glossary]; glossary extraction prints "+", contradicting its own controls-gap definition — likely typo, verify print copy [unverified]
  - Residual risk always exists; it is what management formally **accepts**
  - **Appetite** = total risk org chooses to bear; **tolerance** = ability to absorb realized losses [OSG glossary]
  - **No ranked order** among responses — selection is cost/benefit vs. risk appetite; below-appetite risk -> accept immediately. Acceptance is dual: chosen response AND mandatory endpoint — every treatment ends with documented acceptance of residual (`risk -> treat -> residual -> accept`) [unverified]
- Exam traps / distractors:
  - **Accept vs. reject** = documented conscious decision vs. undocumented ignoring (negligence/due care failure). Example: accept = CISO-signed memo "SCADA stays unpatched, segmented, revisit Q3"; reject = vuln ticket closed "won't fix", no analysis
  - **Insurance = transfer**, not acceptance/mitigation; consequence transfers, **accountability does not** [unverified]. Example: insurer pays the ransomware recovery bill; the regulator still fines you and the CEO still testifies
  - **Avoid vs. mitigate**: activity eliminated vs. activity continued with controls. Example: avoid = decommission the public FTP server; mitigate = keep it, firewall it to partner IPs
  - ISO 31000 vocabulary swap: modify=mitigate, retain=accept, share=transfer. Audit 2026-09-01: iso.org full text paywalled; retain/share/modify/avoid vocabulary corroborated by iso.org search snippets only — not primary-verified [unverified]. Audit 2026-09-28: iso.org/standard/65694 returns HTTP 403 to fetch; still unverified
  - "Reduce risk to zero" always wrong
  - Fixed-sequence options ("always mitigate first") are distractors — no prescribed response order
- Related terms: risk categories/factors, due care, cost/benefit (ALE), scoping and tailoring (2.6)
- Sources: [ISC2 outline], [OSG glossary], [unverified]
- Mnemonic: "**M**y **A**unt **A**ccepts **A**ny **D**umb **R**isk" for the OSG six (Mitigate, Assign, Accept, Avoid, Deter, Reject — ends on Reject = the invalid one)

## NIST SP 800-37 - Risk Management Framework (RMF)
- Definition (ISC2 framing): the federal risk management *process* (Rev. 2, Dec 2018, "system life cycle approach for security and privacy"); one of the 1.9 risk frameworks (ISO, NIST, COBIT, SABSA, PCI) [NIST SP 800-37], [ISC2 outline]
- Key facts:

  | Step | What happens | Companion doc |
  | --- | --- | --- |
  | **P**repare | Context, roles, risk strategy | SP 800-39, 800-30 |
  | **C**ategorize | Impact level from worst-case C/I/A loss | **FIPS 199**, SP 800-60 |
  | **S**elect | Control baseline + tailoring | **SP 800-53B**, FIPS 200 |
  | **I**mplement | Deploy + document controls | SP 800-53 |
  | **A**ssess | Verify controls effective | SP 800-53A |
  | **A**uthorize | **AO** accepts residual risk -> **ATO** | SP 800-37 |
  | **M**onitor | Continuous monitoring, reauth | SP 800-137 |

  - Steps + Rev. 2 Prepare addition [NIST SP 800-37]; SP 800-60 = "Guide for Mapping Types of Information and Information Systems to Security Categories" -> supports Categorize [NIST SP 800-60]; FIPS 200 = "Minimum Security Requirements for Federal Information and Information Systems" — minimum requirements + risk-based control selection process -> supports Select [NIST FIPS 200]
  - Mnemonic: **P-C-SIAM**
  - **Authorize = documented risk acceptance** (AO = Authorizing Official; ATO = Authorization to Operate) — federal form of the acceptance memo
- Exam traps / distractors:
  - **800-37 vs. 800-30 vs. 800-39**: RMF process vs. risk assessment guide vs. enterprise risk strategy. Example: 800-30 = the spreadsheet scoring one system's threats; 800-37 = the steps that get that system an ATO; 800-39 = the agency-wide risk strategy the AO applies
  - "First RMF step" -> **Prepare** (Rev. 2); six-step lists starting Categorize are outdated
  - "Who accepts risk" -> **AO** (senior official), not ISSO (Information System Security Officer)/assessor. Example: ISSO writes the system security plan and remediation plan; AO signs the ATO
  - **RMF vs. CSF** (Cybersecurity Framework): federal/compliance/system-level vs. voluntary/outcome-based/any org. Example: RMF = DoD system needs an ATO before go-live; CSF = mid-size retailer self-rates its Detect function, no certificate issued
- Related terms: FIPS 199 (five pillars entry), risk responses (acceptance), SP 800-53 control baselines, CSF
- Real-world risk methodologies (low exam weight per OSG; not in OSG glossary [unverified]):
  - **OCTAVE** (Operationally Critical Threat, Asset, and Vulnerability Evaluation) — Carnegie Mellon SEI (Software Engineering Institute); self-directed, asset-driven org risk assessment — SEI "Introduction to the OCTAVE Approach" (2003) Sec. 2.2 [SEI OCTAVE]
  - **FAIR** (Factor Analysis of Information Risk) — quantitative model in financial terms; The Open Group standards O-RT (Risk Taxonomy) / O-RA (Risk Analysis) [FAIR Institute]; "loss frequency x loss magnitude" decomposition not confirmed on the page fetched (check The Open Group O-RT) [unverified]
  - **TARA** (Threat Agent Risk Assessment) — Intel; built on Intel's **Threat Agent Library** (TAL) for describing human threat actors [Intel RFI response, nist.gov-hosted]; "prioritizes the threat agents most likely to attack" = IT@Intel whitepaper (Dec 2009) framing, Intel page returned 403 [unverified]
- Sources: [NIST SP 800-37], [ISC2 outline], [SEI OCTAVE], [FAIR Institute], [Intel RFI response], [unverified]

## Types of risk (inherent / total / residual / controls gap)
- Definition (ISC2 framing): risk quantities across the treatment timeline: `inherent --(controls gap)--> residual --> accepted` [OSG glossary]
- Key facts: [OSG glossary]

  | Type | Definition | Example (new internet-facing app) |
  | --- | --- | --- |
  | **Inherent** | Default risk before any risk mgmt (aka initial) | Unhardened app, no review |
  | **Total** | No-safeguards risk; threats x vulns x asset value | Ship as-is exposure |
  | **Controls gap** | Risk removed by safeguards | WAF + patching cuts |
  | **Residual** | Remains after controls | Zero-days, insider misuse |

  - Inherent vs. total near-synonyms: formula context -> **total**; "before anything" context -> **inherent** [unverified]
  - Exam note: treat **inherent ≈ total** — both = pre-safeguard risk; they won't compete as options. Match the word to the phrasing (formula -> total; narrative -> inherent)
  - **Appetite** = risk org chooses to bear; **tolerance** = ability to absorb losses; **capacity** = risk org is able to shoulder; appetite may exceed capacity (testable mismatch) [OSG glossary]. Example: appetite = board chooses to run the legacy app unsegmented another year; tolerance = finance can absorb the outages it causes; capacity = whether a breach there would sink the company
- Exam traps / distractors:
  - **Residual never zero**; formally accepted by senior management
  - Inherent vs. residual swap on post-control scenarios
  - **Controls gap** = a difference, not a held risk. Example: patching cut ALE from $120K to $30K — the $90K is the controls gap, the $30K is residual
  - Appetite (choice) vs. **capacity** (ability to survive loss)
- Related terms: risk responses (residual formula), risk acceptance, ALE/cost-benefit
- Sources: [OSG glossary], [unverified]

## Qualitative vs. quantitative risk analysis
- Definition (ISC2 framing): **quantitative** = real dollar figures; **qualitative** = subjective/intangible values, scenario-oriented ranking and grading [OSG glossary]; real programs hybrid: qualitative triage -> quantitative workup
- Key facts:
  - Quantitative chain [OSG glossary]:
    1. **AV** (asset value — dollar value)
    2. **EF** (exposure factor — % of AV lost per hit)
    3. **SLE** (single loss expectancy) **= AV x EF**
    4. **ARO** (annualized rate of occurrence — expected hits/year)
    5. **ALE** (annualized loss expectancy) **= SLE x ARO**
    6. Safeguard value = ALE(before) - ALE(after) - annual safeguard cost (verify formula, OSG ch. 2) [unverified]
  - Example: AV $400K, EF 60% -> SLE $240K; ARO 0.5 -> ALE $120K
  - Qualitative techniques: scenarios + risk matrix, **Delphi** (anonymous iterative consensus) [OSG glossary], brainstorming, surveys
  - Delphi mechanism: facilitator collects **anonymous written** ratings -> summarizes spread, no names -> group re-rates -> repeat until convergence. Removes rank/anchoring bias (nobody follows the CISO's number). Recognition: anonymous + iterative + consensus = Delphi; open discussion = brainstorming
  - **Loss potential** = what would be lost if the threat agent successfully exploits a vulnerability (OSG text); glossary maps it to **EF** — same idea as % of asset value [OSG glossary]
  - **Delayed loss** = secondary damage after the initial hit (reputation, churn, later fines, lost future sales); often exceeds direct loss; fold into EF/SLE impact estimates [unverified]. Cross-ref: BIA (1.7)
- Exam traps / distractors:
  - **EF = percentage, ARO = frequency**; ARO can be >1 or fractional
  - **SLE vs. ALE**: one incident vs. per-year — read the question's timeframe
  - **Delphi = anonymous**; "group discussion" option = brainstorming
  - Qualitative is CORRECT (not fallback) when numbers unreliable or speed matters; "quantitative always better" = wrong. Example: rating brand damage from a leaked exec inbox high/med/low beats a dollar figure invented from an industry average
  - Pure quantitative impossible; absolutist options fail [unverified]
  - Breach-impact answer that stops at asset rebuild cost ignores **delayed loss**
- Related terms: types of risk (controls gap), risk responses (cost/benefit), FAIR (quantitative methodology)
- Sources: [OSG glossary], [unverified]

## Supply chain and SCRM
- Definition (ISC2 framing): **supply chain** = sequence of processes/operations/events in development, production, distribution of a product/service [OSG glossary]; **SCRM** (Supply Chain Risk Management) = ensuring all links are reliable, trustworthy, reputable and disclose practices to business partners (**not necessarily public**) [OSG glossary]
- Key facts:
  - Outline 1.11 risks: **tampering, counterfeits, implants** [ISC2 outline]
  - Evaluation methods (verify OSG ch. 1) [unverified]:

  | Method | What you do | Gets you |
  | --- | --- | --- |
  | **On-site assessment** | Visit, observe operations | Direct evidence |
  | **Document exchange/review** | Review artifact handling, records | Paper-trail assurance |
  | **Process/policy review** | Read internal security docs | Design-level assurance |
  | **Third-party audit** | Independent attestation (SOC 2) | Assurance w/o access |

  - Mitigations [ISC2 outline]: third-party assessment/monitoring, **minimum security requirements** (contractual), service-level requirements, silicon root of trust
  - Evaluation ordering: **no prescribed sequence** — select/stack methods by vendor **access** (none -> third-party audit), **criticality** (high -> combine + repeat; "assessment and monitoring" = ongoing), cost proportionality; contract (minimum security requirements) precedes evaluation relationships [unverified]
  - **Silicon RoT** (root of trust) = tamper-resistant hardware anchor for boot integrity/authenticity [OSG glossary]
  - **PUF** (physically unclonable function) = unique per-chip fingerprint from physical properties; anti-counterfeit identity [OSG glossary]
  - **SBOM** (software bill of materials) = full component/dependency inventory with versions + sources [OSG glossary]
  - Federal anchor: **SP 800-161 Rev. 1** "Cybersecurity Supply Chain Risk Management Practices for Systems and Organizations" (C-SCRM); its abstract names malicious functionality, **counterfeits**, poor manufacturing/development practices — mirrors outline 1.11 risks [NIST SP 800-161]
- Exam traps / distractors:
  - Un-inspectable vendor -> **third-party audit/attestation**, not informal review or pentest results
  - **RoT vs. PUF**: boot-integrity anchor vs. identity fingerprint — distractors swap. Example: RoT = TPM-measured boot refusing a tampered bootloader; PUF = chip answering a challenge only genuine silicon can, exposing a counterfeit NIC
  - Minimum requirements go **in the contract**; trust-based options lose. Example: "MSP runs EDR on every endpoint touching our tenant" written into the master services agreement; not "their sales deck says so"
  - SCRM = proactive governance (D1); detecting poisoned update = operations (D7). Example: requiring SBOMs and signed updates in vendor contracts = SCRM; SIEM alert on a SolarWinds-style trojaned update beaconing = D7
- Related terms: third-party assessment, SOC 2 (Domain 6), vendor agreements (1.8), minimum security requirements
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Threat modeling - STRIDE and methodologies
- Definition (ISC2 framing): **threat modeling** = identifying, understanding, categorizing potential threats [OSG glossary]; done **proactively at design time** (exam answer), vs. reactive ops — outline 3.1 lists threat modeling among the **secure design principles** [ISC2 outline]
- Key facts:
  - **STRIDE** = Microsoft threat categorization scheme [OSG glossary]; property mapping per Microsoft SDL threat-modeling docs [Microsoft SDL]:

  | Letter | Threat | Property violated | Example |
  | --- | --- | --- | --- |
  | **S**poofing | Fake identity/origin | Authentication / authenticity | Forged Kerberos ticket, spoofed From: |
  | **T**ampering | Unauthorized modification | Integrity | Cookie edited to role=admin |
  | **R**epudiation | Deny having acted | Nonrepudiation | No audit log; "I never ran that" |
  | **I**nformation disclosure | Data exposure | Confidentiality | Stack trace leaking DB creds |
  | **D**enial of service | Resource exhaustion | Availability | SYN flood, regex backtracking |
  | **E**levation of privilege | Gain unauthorized rights | Authorization | SQLi to xp_cmdshell as SYSTEM |

  - **DREAD** = rating system: Damage, Reproducibility, Exploitability, Affected users, Discoverability [OSG glossary]
  - **PASTA** (Process for Attack Simulation and Threat Analysis) = seven-step methodology [OSG glossary]; **risk-centric** — starts from business objectives, ends at management risk decision. Stages (verify OSG ch. 1) [unverified]:
    1. **DO** — Define Objectives (business objectives, inherent risk profile)
    2. **DTS** — Define Technical Scope (attack surface, trust boundaries)
    3. **ADA** — Application Decomposition and Analysis (data flows, entry points)
    4. **TA** — Threat Analysis (threat intel, abuse cases)
    5. **WVA** — Weakness and Vulnerability Analysis (correlate threats to flaws)
    6. **AMS** — Attack Modeling and Simulation (attack trees, emulation vs. design)
    7. **RAM** — Risk Analysis and Management (business impact, treatment, residual)
    - Recognition: "risk-centric"/"business objectives"/"attack simulation" -> PASTA; scenario ending in management risk decision -> PASTA over STRIDE; simulation (VI) precedes risk analysis (VII)
  - **VAST** (Visual, Agile, and Simple Threat) = Agile-integrated modeling [OSG glossary]
  - **Trike** = risk-based alternative to STRIDE/DREAD aggregation [OSG glossary]; **open-source**, implements a **requirements model** — ensures the assigned risk level for each asset is "acceptable" to **stakeholders** (course video) [Trike project]: octotrike.org README (open source, begun 2006); Trike v1 Methodology paper, intro goal 1 (risk to each asset acceptable to all stakeholders) + Sec. 1 Requirements Model (actors, assets, intended actions, rules)
- Exam traps / distractors:
  - **STRIDE categorizes, DREAD scores** — the recurring pair. Example: STRIDE says "this is Tampering"; DREAD says "it's a 9 — all users affected, trivially reproducible"
  - **Repudiation vs. spoofing**: deny-after-the-fact vs. lie-about-identity (same axis as authenticity/nonrepudiation pillar split). Example: spoofing = logging in as Bob with his stolen creds; repudiation = Bob doing it himself and denying it because nothing signed proves it
  - "Seven steps"/"attack simulation" -> **PASTA**; "Agile" -> **VAST**
  - Threat modeling = design-time risk input (D1), NOT penetration testing (D6). Example: DFD review in sprint planning finds the missing authz check; the pentest finds the same hole after go-live
- Related terms: five pillars (property mapping), risk categories (adversarial sources), SP 800-30 threat sources, TARA
- Sources: [OSG glossary], [ISC2 outline], [Trike project], [unverified]
- **Reduction analysis** (aka decomposing): divide target into smaller containers (modules / hosts+protocols / departments) to understand logic + external interactions; evaluate each sub-element's inputs, processing, security, data mgmt, storage, outputs [OSG glossary]. = the DFD step of STRIDE workflows; = PASTA stage 3 (ADA). Five things to identify (verify OSG ch. 1) [unverified]:

  | # | Concept | Look for |
  | --- | --- | --- |
  | 1 | **Trust boundaries** | Where trust level changes (user->app, DMZ->internal) |
  | 2 | **Dataflow paths** | Data movement between locations |
  | 3 | **Input points** | External input locations (attack surface) |
  | 4 | **Privileged operations** | Anything running elevated |
  | 5 | **Security stance / approach** | Declared policy, assumptions |

  - Traps: decompose BEFORE categorizing threats; distinct from **attack surface reduction** (hardening, not modeling). Example: drawing the DFD and marking where the web tier crosses into the DB = decomposition; disabling SMBv1 = attack surface reduction

## COBIT basics
- Definition (ISC2 framing): **ISACA** (Information Systems Audit and Control Association) framework for **governance and management of enterprise IT**; describes common requirements orgs should have around information systems [OSG glossary]
- Key facts:
  - COBIT 2019: **six** governance-system principles (verified isaca.org 2026-09-01; note COBIT 5 had five — count distinguishes versions) [ISACA]:

  | # | Principle | Gist |
  | --- | --- | --- |
  | 1 | **Provide stakeholder value** | Balance benefits, risk, resources |
  | 2 | **Holistic approach** | Components work together |
  | 3 | **Dynamic governance system** | Reassess when design factors change |
  | 4 | **Governance distinct from management** | Different activities and structures |
  | 5 | **Tailored to enterprise needs** | Customize via design factors |
  | 6 | **End-to-end governance system** | All enterprise functions, not just IT dept |

  - Principle 4 = the tested one: governance (board: evaluate/direct/monitor) vs. management (plan/build/run). Example: board asks "is ransomware exposure inside appetite?" = governance; CISO picks the EDR and sets the patch SLA = management
  - ISACA also runs CISA -> COBIT pairs with IT **audit** language
- Exam traps / distractors — framework-for-purpose matching:

  | Described purpose | Answer |
  | --- | --- |
  | IT governance, business/IT alignment, audit | **COBIT** |
  | IT service management (incidents, SLAs) | ITIL |
  | Certifiable ISMS | ISO 27001 |
  | Voluntary cyber risk outcomes, any org | NIST CSF |
  | Corporate internal control / SOX | **COSO** [COSO] |

  - COSO = Committee of Sponsoring Organizations of the Treadway Commission; Internal Control - Integrated Framework (1992, refreshed 2013), used for **SOX Sec. 404** compliance [COSO]. Example: COSO = CFO's SOX 404 attestation that financial-reporting controls work; COBIT = the IT-process control objectives auditors test underneath it
- Related terms: governance alignment (1.3), ITIL-vs-COBIT (key areas entry), ISO 27001, NIST CSF, COSO
- Sources: [OSG glossary], [ISACA], [COSO]

## Security control categories (administrative / technical / physical)
- Definition (ISC2 framing): categories = **how implemented**; types (preventive/detective/corrective...) = **what it does**; every control has one of each
- Key facts:

  | Category | Implemented as | Examples |
  | --- | --- | --- |
  | **Administrative** | Policies, procedures, people processes | Hiring, background checks, training, supervision |
  | **Logical/technical** | Hardware/software mechanisms | AuthN, encryption, firewalls, IDS |
  | **Physical** | Blocks direct contact/access | Locks, guards, mantraps, fences |

  - Administrative aka **management/managerial/procedural** controls — four names, one category [OSG glossary]
  - NIST legacy taxonomy: management/**operational**/technical; operational = day-to-day mechanisms [OSG glossary]. Correction (audit 2026-09-01): previously attributed to FIPS 200 — the FIPS 200 page shows control *families*, not M/O/T classes; the M/O/T grouping was legacy **SP 800-53** (pre-Rev 4) — confirmed: SP 800-53 Rev. 3 Sec. 2.1 + Table 1-1 name "three general classes of security controls: management, operational, and technical" [NIST SP 800-53 Rev. 3]. NIST's operational definition is narrower than "day-to-day": controls "primarily implemented and executed by people (as opposed to systems)" — SP 800-18 Rev. 1 Sec. 3.14 + glossary [NIST SP 800-18]
  - **Vacation history review** = administrative + detective (canonical combined classification) [OSG glossary]
- Exam traps / distractors:
  - Category vs. type axes never mix: "detective" is not a category, "physical" is not a type
  - Classification pairs: training = admin + preventive; guard = physical + preventive/deterrent; log review = technical + detective
  - **Defense in depth** = layering across categories; "control failed" -> add different-category layer. Example: EDR missed the loader (technical) -> add macro-blocking policy + phishing training (administrative), not a second EDR
- Related terms: control types (preventive/detection/corrective, 1.9 — future entry), defense in depth (3.1), physical security (7.14)
- Sources: [OSG glossary], [ISC2 outline], [NIST SP 800-53 Rev. 3], [NIST SP 800-18]

## Security control types (the seven)
- Definition (ISC2 framing): types = **when/how a control acts** on unwanted activity; combine freely with the three categories (admin/technical/physical) [OSG glossary]
- Key facts: [OSG glossary]

  | Type | Function | Example |
  | --- | --- | --- |
  | **Preventive** | Thwart/stop unwanted activity | ACLs, encryption, fences |
  | **Deterrent** | Discourage violator's choice | Banners, cameras, sanctions |
  | **Detective** | Discover after occurrence | Audit logs, IDS, job rotation |
  | **Corrective** | Return environment to normal | AV quarantine, kill session |
  | **Recovery** | Corrective w/ advanced abilities | Backups, DR sites, reimaging |
  | **Directive** | Direct/confine behavior to compliance | Policies, signage |
  | **Compensating** | Alternative supporting existing control | Extra monitoring vs. unpatchable box |

  - Timeline: before -> deterrent/preventive/directive; at discovery -> detective; after -> corrective/recovery
- Exam traps / distractors:
  - **Preventive vs. deterrent**: works without attacker's cooperation vs. works on their decision. Example: the ACL drops the packet whether or not the attacker read the "activity monitored" banner
  - **Corrective vs. recovery**: minor return-to-normal vs. advanced restoration (recovery = extension of corrective) [OSG glossary]
  - **Directive vs. deterrent**: compliance-oriented instruction vs. consequence-oriented discouragement. Example: "badge in at the turnstile" sign vs. "CCTV in operation, violators prosecuted" sign
  - **Compensating** = primary control infeasible -> equivalent alternative (PCI vocabulary)
- Related terms: control categories (previous entry), outline 1.9 types (preventive, detection, corrective) [ISC2 outline], defense in depth
- Sources: [OSG glossary], [ISC2 outline]

<!-- REVIEW -->
## Legal and regulatory landscape (high level)
- Definition (ISC2 framing): three categories of law + **contractual obligations** (not law); compliance requirements flow from all four [OSG glossary]
- Key facts:

  | Category | Governs | Burden of proof | Proof meaning |
  | --- | --- | --- | --- |
  | **Criminal** | Offenses vs. society; prison possible | **Beyond a reasonable doubt** | No reasonable alternative |
  | **Civil** | Party disputes; damages | **Preponderance of evidence** | More likely than not (>50%) |
  | **Administrative** | Agency regulations (in **CFR**) | Substantial evidence (varies) | Reasonable mind could accept |

  - Categories + CFR anchor [OSG glossary]; burden-of-proof columns (verify OSG legal ch.) [unverified]
  - Burden borne by the party bringing the action (prosecutor/plaintiff/agency); intermediate standard "clear and convincing" (highly probable) appears in some civil/admin matters [unverified]
  - Same breach -> criminal + civil + administrative proceedings on same facts; can lose civil after winning criminal (lower bar). Example: ransomware operator prosecuted (criminal), customers' class action (civil), HHS Office for Civil Rights fine for the HIPAA gap (administrative)
  - Collect evidence to the **highest** standard regardless of current proceeding — may escalate (1.5, D7 forensics)
  - Parallels **investigation types (1.5)**: administrative, criminal, civil, regulatory [ISC2 outline]
  - **PCI DSS = contractual, not law** — merchant-agreement enforcement, card-brand fines (verify OSG ch. 4) [unverified]. Enforcement model confirmed: PCI SSC manages the standard, compliance "enforced by the founding members" (card brands), each brand runs its own enforcement program, validation reported to acquiring banks — PCI SSC Quick Reference Guide, "Overview of PCI Requirements" + "How to Comply" [PCI SSC]; fine amounts not stated there. Example: non-compliant merchant fined by Visa via its acquiring bank, may lose card acceptance — no prosecutor involved
  - Key US computer-crime-adjacent laws [OSG glossary]:

  | Law | What it does | Hook |
  | --- | --- | --- |
  | **CFAA** (Computer Fraud and Abuse Act) | Exclusively computer crimes **crossing state lines** (states'-rights design) | First major US cybercrime law; **1986** (H.R. 4718, 99th Congress) [congress.gov] |
  | **Federal Sentencing Guidelines** (1991) | Punishment guidelines for federal law violations | Formalized **prudent person rule**; executive **personal liability** for due care failures [unverified] |
  | **FISMA** (2002) | Federal agencies must run an infosec program | Explicitly includes **contractors' activities**; delegated the "how" to NIST |

  - Sentencing Guidelines 1991 = USSG **Chapter Eight** (organizational sentencing), effective Nov 1, 1991 (Amendment 422); requires organizations to "exercise due diligence to prevent and detect criminal conduct" via an effective compliance and ethics program [USSC Ch. 8]
  - FISMA 2002 = Title III of the E-Government Act, **Pub. L. 107-347**, approved Dec 17, 2002 [govinfo]; contractor coverage: program must cover "information systems used or operated by an agency or by a contractor of an agency" — 44 U.S.C. 3554(a) [44 U.S.C. 3554]
  | **Copyright / DMCA** | Copyright = "original works of authorship" vs. unauthorized duplication; DMCA **Sec. 1201** anti-circumvention ban + **Sec. 512** ISP safe harbor (notice-and-takedown) | DMCA **1998** [copyright.gov] |

  - FISMA program elements — 44 U.S.C. 3554(b)(1)-(8) + (c) [44 U.S.C. 3554]: periodic **risk assessments** (-> FIPS 199), risk-based policies/procedures, per-system **security plans** ("subordinate plans"), awareness **training**, control testing **at least annually** (statute: "no less than annually") + independent **Inspector General** evaluation [unverified — IG evaluation is 44 U.S.C. 3555, not fetched], remediation (**POA&M** — Plan of Action and Milestones; statute says "process for planning, implementing, evaluating, and documenting remedial action" — POA&M label is OMB/NIST usage [unverified]), **incident response** (statute: notify "the Federal information security incident center"; US-CERT/CISA mapping [unverified]), **continuity** plans, annual reporting to **OMB**, congressional committees, and the Comptroller General (3554(c)). Operationally = run the **RMF** forever; FISMA is the law that ordered NIST to write FIPS 199/200 + SP 800-53
  - Broader recognition landscape: **HIPAA** (health), **GLBA** (financial privacy), **SOX** (financial reporting), FERPA (education), **GDPR**/CCPA (privacy) [ISC2 outline], **CLOUD Act** 2018 (US access to overseas data) [OSG glossary], ITAR/EAR/Wassenaar (import/export) [state.gov], [wassenaar.org] — details in export controls entry
  - **Cybercrime categories** — by the computer's role in the offense [unverified, converging secondary sources]:
    - **Computer as target**: the attack itself harms the system (DoS, destructive malware, rootkit install)
    - **Computer as tool**: computer used to commit an unrelated crime (fraud, phishing, IP theft)
    - **Computer incidental**: computer merely stores evidence of a crime that doesn't need it (e.g., a drug ledger kept in a spreadsheet)
  - **Transborder data flow**: moving personal data across national borders, where the destination country's data-protection law may be weaker than the origin's — the general problem GDPR's Art. 3/Ch. V mechanisms (adequacy decision, **SCCs** = Standard Contractual Clauses, **BCRs** = Binding Corporate Rules) solve for EU data specifically (see privacy laws entry); the concept generalizes to any cross-border transfer, not just EU-origin [unverified]. Core definition sourced: "transborder flows of personal data" = "movements of personal data across national borders" — **OECD Privacy Guidelines** (1980, rev. 2013) Annex Part One para. 1(e) [OECD]; outline 1.4 lists "Transborder data flow" [ISC2 outline]. The "weaker destination law" rationale remains unsourced. Example: EU customer table replicated to a us-east-1 read replica = a transfer needing adequacy/SCCs
- Exam traps / distractors:
  - Classify the proceeding: regulator fine -> **administrative**; lawsuit -> **civil**; prosecution -> **criminal**
  - **PCI as "regulation/legislation"** = wrong option
  - Data-to-law matching: health->HIPAA, cardholder->PCI (contractual), EU persons->GDPR
  - Legal interpretation needed -> involve **legal counsel** (CISO answer)
  - Internal/HR investigation does NOT require criminal standard, but sloppy handling forecloses criminal referral
  - This entry's "administrative" = a **category of law** (agency rulemaking, CFR, substantial-evidence standard). 1.5's "administrative investigation" = a different axis, an **internal/HR-conducted** investigation — same word, two ISC2 taxonomies; don't cross-wire (see investigation types entry). Example: FTC rule in the CFR = administrative law; HR reviewing a staffer's proxy logs = administrative investigation
- Related terms: regulatory policy (1.6 entry), investigation types and evidence (1.5, own entry), privacy laws (GDPR/CCPA, transborder mechanisms), security governance principles (1.3, due care)
- Sources: [OSG glossary], [ISC2 outline], [congress.gov], [copyright.gov], [PCI SSC], [USSC Ch. 8], [govinfo], [44 U.S.C. 3554], [state.gov], [wassenaar.org], [OECD], [unverified]

## Intellectual property and licensing
- Definition (ISC2 framing): **IP** = intangible creations owned/protected by an org: copyrights, trademarks, patents, trade secrets, confidential data [OSG glossary]; **licensing** = contract stating how a product is to be used [OSG glossary]
- Key facts:

  | Type | Protects | Duration | Catch |
  | --- | --- | --- | --- |
  | **Copyright** | Expression ("original works of authorship") | **Life + 70 yrs** (post-1978; work-for-hire 95/120) [copyright.gov] | Idea not protected, only expression |
  | **Patent** | Inventions: sole make/use/sell right | Up to **20 yrs from first non-provisional filing** [uspto.gov] | Requires **public disclosure** |
  | **Trademark** | Words/slogans/logos identifying company | Renewable indefinitely [uspto.gov] | Brand identity, not tech |
  | **Trade secret** | Business-critical secret info | While secret | No registration; **disclosed = gone** |

  - Patent vs. trade secret tradeoff: ~20-yr monopoly + publication vs. indefinite protection + zero remedy after leak. Example: patent the hardware-token design (published, 20-yr monopoly); keep the detection-rule corpus a trade secret (NDA-guarded, gone if leaked)
  - Trademark renewal: Sec. 8 declaration (5th-6th yr, 9th-10th yr, every 10 yrs after) + Sec. 9 renewal every 10 yrs; lasts as long as use continues and filings are kept up — USPTO "Keeping your registration alive" [uspto.gov]
  - **Economic Espionage Act**: trade-secret theft for foreign gov't -> up to $500K + 15 yrs; otherwise $250K + 10 yrs [OSG glossary]; year 1996 — Pub. L. 104-294, approved Oct 11, 1996 [govinfo]. **Correction (audit 2026-09-28)**: $500K is the original 1996 figure. **Pub. L. 112-269** (Jan 14, 2013) raised the individual maximum under **18 U.S.C. 1831(a)** to **$5,000,000** (+15 yrs); organizations: greater of $10M or 3x the value of the stolen secret (1831(b)). 18 U.S.C. 1832 (non-foreign theft): individual "fined under this title" + up to 10 yrs (the $250K figure is the general 18 U.S.C. 3571 felony cap, not fetched); organizations: greater of $5M or 3x value [18 U.S.C. 1831-1832]. OSG figures may still be the exam answer
  - License types (verify OSG ch. 4) [unverified]:

  | License | Accepted by |
  | --- | --- |
  | **Contractual** | Negotiated signature |
  | **Shrink-wrap** | Opening the package |
  | **Click-through** | Clicking (EULA) |
  | **Cloud services** | Using the service |

- Exam traps / distractors:
  - **Five copyright rights** (what the holder may *do*; 17 U.S.C. Sec. 106 lists six, incl. digital audio transmission) [unverified]: reproduce in any form/language/medium; adapt/derive; distribute copies; perform publicly; display publicly. **Duration is a property, not a right** — "protection for 95 years" is a NOT-one-of-the-five fake (and 95 yrs applies only to works-for-hire/anonymous; individual authors = life + 70 [copyright.gov]). Pattern: the fake in NOT-one-of-N questions is often a true fact of the wrong category (a term among rights, a date among principles). Example: options adapt / distribute / 95-year protection / reproduce -> 95-year protection (answered correctly 2026-10-05)
  - Source code = **copyright AND trade secret** simultaneously — "pick one" options wrong. Example: leaked EDR-agent source = trade secret gone the moment it's public, copyright still bars republishing it
  - "Patent it to keep it secret" = self-contradicting (patents publish)
  - Confidential-forever algorithm -> **trade secret**; exclusivity w/ disclosure OK -> **patent**
  - Trademark **(TM)** = unregistered claim vs. **(R)** = registered
  - Unlicensed software = contractual/licensing violation, pairs with copyright infringement distractor
- Related terms: DMCA (legal entry), licensing as contractual compliance (PCI fourth box), import/export controls (1.4)
- Sources: [OSG glossary], [copyright.gov], [uspto.gov], [govinfo], [18 U.S.C. 1831-1832], [unverified]

<!-- REVIEW -->
## Encryption export controls and privacy laws
- Definition (ISC2 framing): two 1.4 compliance areas — governments restrict where crypto goes (**export controls**); privacy laws restrict processing of personal data [ISC2 outline]
- Key facts:
  - Export regimes (verify OSG ch. 4) [unverified]:
    - **ITAR** (International Traffic in Arms Regulations) — State Dept; defense articles (US Munitions List) — ITAR = 22 CFR 120-130, implements the Arms Export Control Act; State's **DDTC** (Directorate of Defense Trade Controls) administers it incl. the USML [state.gov]
    - **EAR** (Export Administration Regulations) — Commerce/BIS; **dual-use**; commercial crypto lives here — items not on the USML fall under the EAR, administered by BIS [state.gov]; "commercial crypto" placement [unverified]
    - **Wassenaar Arrangement** — ~40-country multilateral dual-use coordination; voluntary — 42 Participating States; covers conventional arms + dual-use goods/technologies; transfer decisions are "the sole responsibility of each Participating State" (national discretion) — wassenaar.org "About us" [wassenaar.org]
    - **Computer export controls**: BIS (Bureau of Industry and Security) licenses high-performance computing exports; **embargoed destinations** (OSG list: Cuba, Iran, North Korea, Sudan, Syria) [unverified]. EAR Country Groups E:1/E:2; real-world membership has shifted (Sudan delisted 2020, Crimea added) — answer with the book on exam day [unverified]. **Correction (audit 2026-09-28)**: current EAR **Supp. No. 1 to Part 740** Country Group E (E:1 terrorist-supporting, E:2 unilateral embargo) lists only **Cuba, Iran, North Korea, Syria** — Sudan absent (confirms delisting; the 2020 date is not verified). Crimea was **not** added to Country Group E; occupied regions of Ukraine are controlled separately under **EAR 746.6** [eCFR 15 CFR 740 Supp. 1], [bis.gov]
    - Some countries restrict crypto **import/use** (licenses, escrow) — legality is per-jurisdiction
  - Privacy laws [OSG glossary]:

  | Law | Year | Description |
  | --- | --- | --- |
  | **Privacy Act** | 1974 | Restricts **federal agencies'** handling of records on individuals — keep only what's necessary for the agency's mission, let individuals inspect/amend their own records, destroy records once no longer needed [OSG glossary] |
  | **ECPA** | **1986** (H.R. 4952, 99th Congress) [congress.gov] | Makes it a crime to invade electronic privacy — covers monitoring of email/voicemail and bars **providers** from disclosing message content without authorization; binds private parties, not just government [OSG glossary] |
  | **HIPAA** | 1996 | Sets privacy/security requirements for medical data held by hospitals, physicians, insurers, and HMOs (Health Maintenance Organizations) [OSG glossary] |
  | **GLBA** | 1999 | Eased barriers between financial institutions (banks, insurers, credit providers could affiliate/share services) but attached privacy duties — disclose data-sharing practices, safeguard customer financial data [OSG glossary] |
  | **COPPA** | 1998 [FTC] | Requires **verifiable parental consent** before sites/services that target or knowingly collect from children **under 13** gather personal info; FTC-enforced (16 CFR 312) |
  | **GDPR** | Reg. EU **2016/679** | Single harmonized EU/EEA law on data protection/privacy — governs processing and cross-border transfer of PII belonging to EU/EEA persons; **extraterritorial** reach (applies to any org processing their data, regardless of org's location) [OSG glossary] |
  | **CCPA** | 2018 [oag.ca.gov] | California statute (**modeled on GDPR**) giving state residents rights to know what personal data is collected, request its deletion, and opt out of its sale [OSG glossary] |

  - GDPR specifics: extraterritorial (Art. 3); rights = access, rectification, **erasure** (Art. 17), portability; **72-hr** breach notify to the supervisory authority (Art. 33); transfers need adequacy decision or SCCs. Article numbers corroborated 2026-09-04 against a faithful GDPR text mirror (gdpr.algolia.com); **eur-lex full-text fetch failed again** (2nd attempt, after 2026-09-01) — treat numbers as corroborated-not-primary [GDPR text mirror]. **Correction 2026-09-04**: the earlier "fines to 4% global revenue (Art. 83)" was incomplete — Art. 83 has **two tiers**: 83(4) up to **EUR 10M or 2%** of worldwide annual turnover, 83(5) up to **EUR 20M or 4%**, in each case **whichever is higher**. Full treatment in the dedicated GDPR entry below
- Exam traps / distractors:
  - **ITAR vs. EAR**: munitions/State vs. dual-use/Commerce — standard swap. Example: missile guidance firmware = ITAR; your AES-256 VPN appliance = EAR
  - **ECPA** restrains providers/private parties, not only government. Example: a mail provider handing message bodies to an advertiser without authorization, not just a warrantless wiretap
  - GLBA origin = deregulation; privacy rules rode along
  - HIPAA -> business associates **directly liable** via **HITECH (2009)** Sec. 13401 — Security Rule safeguards apply to BAs as to covered entities; BAs must notify the covered entity of breaches [HHS]. Example: the MSSP monitoring a hospital's patient-record servers is a BA — fined directly if its own controls fail
  - "US law resembling GDPR" -> **CCPA**
- Related terms: transborder data flow (1.4, own entry later), DMCA/IP (licensing entry), FISMA, data protection methods (2.6)
- Sources: [OSG glossary], [ISC2 outline], [congress.gov], [FTC], [oag.ca.gov], [HHS], [state.gov], [wassenaar.org], [eCFR 15 CFR 740 Supp. 1], [bis.gov], [unverified]

## Business continuity planning (BCP)
- Definition (ISC2 framing): the discipline of keeping critical business processes running during/after a disruption — a **BIA** (business impact analysis) quantifies how much downtime/data loss the business can tolerate, and that number drives recovery strategy, testing, and maintenance as an ongoing lifecycle, not a one-time document [ISC2 outline]
- Key facts:
  - **NIST SP 800-34 Rev.1** 7-step contingency planning process (the technical reference the CBK draws on) [NIST SP 800-34]:
    1. **Develop the contingency planning policy statement** — gives the effort authority/scope
    2. **Conduct the BIA** — identify + prioritize critical mission/business processes and their supporting systems
    3. **Identify preventive controls** — reduce disruption likelihood/impact (UPS, RAID, failover) before recovery is even needed
    4. **Create contingency strategies** — backup/recovery approach: alternate-site vendor contracts, reciprocal agreements, equipment SLAs
    5. **Develop the information system contingency plan** — write the detailed recovery procedures per system
    6. **Ensure plan testing, training, and exercises (TT&E)** — validates the plan actually works
    7. **Ensure plan maintenance** — living document, updated on org/system change
  - **ISC2/OSG exam framing** groups the same lifecycle into **4 phases** (exam vocabulary — NIST's step numbers aren't tested directly) [unverified, corroborated by multiple CISSP study sources but not confirmed against ISC2 primary text]:

  | Phase | Maps to NIST steps | Produces |
  | --- | --- | --- |
  | **1. Project scope and planning** | Step 1 | BC team, policy, scope |
  | **2. Business impact analysis** | Step 2 | Criticality ranking, MTD/RTO/RPO |
  | **3. Continuity planning** | Steps 3-5 | Preventive controls, recovery strategy, written plan |
  | **4. Approval and implementation** | Steps 6-7 (ongoing) | Management sign-off, rollout, test/maintain cycle |

  - **BIA** = 3-step process [NIST SP 800-34]:
    1. **Determine mission/business processes and recovery criticality** — impact of disrupting each process, incl. estimated downtime
    2. **Identify resource requirements** — facilities, personnel, equipment, software, data, **interdependencies** (what each process actually needs to run)
    3. **Identify recovery priorities** — rank/sequence recovery based on the above
    - Impact quantification reuses the qualitative/quantitative toolkit (AV/EF/SLE/ARO/ALE, Delphi) — see quant/qual risk analysis entry
  - Recovery metrics [NIST SP 800-34]:

  | Term | Definition | Example (order DB) |
  | --- | --- | --- |
  | **MTD** (Maximum Tolerable Downtime) | Ceiling — total outage time the business can survive before unacceptable harm | 8 hrs before harm unacceptable |
  | **RTO** (Recovery Time Objective) | Target time to get the **system** back up; must fit inside MTD | Cluster restored within 4 hrs |
  | **WRT** (Work Recovery Time) | Time after the system's back to catch up data entry/backlog and verify | 2 hrs replaying queued orders |
  | **RPO** (Recovery Point Objective) | How much **data loss** is tolerable, measured backward in time to the last good backup/replica — not a duration of outage | 15-min replica lag = max loss |

    - Relationship: `disruption -> [RTO: system restored] -> [WRT: backlog/data caught up] -> normal ops`, and **RTO + WRT <= MTD**. RPO is a separate axis (data-loss tolerance), not part of that timeline
  - **External dependencies**: recovery strategy is bounded by third parties you don't control — alternate-site vendor contracts, reciprocal agreements, equipment/ISP/cloud-provider SLAs, supply-chain partners [NIST SP 800-34]. Plan can't promise an RTO faster than its slowest external dependency
  - Plan types — the classic 4-way exam confusion cluster [NIST SP 800-34]:

  | Plan | Focus | Scope |
  | --- | --- | --- |
  | **BCP** | Sustaining **mission/business processes** (e.g., payroll, customer service) during/after disruption | One business unit or whole org; may run long-term alongside COOP |
  | **DRP** | Restoring the **physical facility/IT infrastructure** at an alternate site after a major disruption | Site-specific; only triggers when relocation is required |
  | **COOP** (Continuity of Operations) | Restoring **mission-essential functions** at an alternate site, for up to 30 days | Federal-mandated (HSPD-20/NSPD-51); nongovernment orgs use BCP instead |
  | **ISCP** (Information System Contingency Plan) | Recovering **one system**, regardless of site — can activate in place or at an alternate site | System-level; used *after* DRP has stood up the alternate site |
    - Also exists but lower exam yield: crisis communications plan (public-facing messaging), CIP (critical infrastructure protection) plan, cyber incident response plan (may be a BCP appendix), OEP (occupant emergency plan — life-safety, not IT) [NIST SP 800-34]
    - **MEF** (mission-essential function) = the deliberately small subset of functions that cannot pause without mission failure — what COOP restores; everything else consciously lapses. Federal analog of the BIA's critical business processes. Examples: benefit payment issuance, air traffic control, 911 dispatch, disease surveillance (corporate: payment clearing, patient care, call routing); tell = externally facing + time-critical + mandated. Payroll = classic borderline: essential eventually, pausable for days -> longer BIA window, not MEF. FEMA **FCD-2** (Federal Continuity Directive) = MEF identification/BIA process; hierarchy: agency MEFs -> **PMEF**s supporting **NEF**s (National Essential Functions). Targets: resume within **12 hrs**, sustain **30 days**. Sourced: FCD-2 (June 13, 2017) = "Mission Essential Functions and Candidate Primary Mission Essential Functions Identification and Submission Process"; MEF identification via **BPA** (business process analysis, Annex C) + **BIA** (Annex D); MEF/PMEF/NEF definitions in its glossary (from PPD-40) [FEMA FCD-2 (2017)]. 12-hr/30-day rule: perform essential functions "not later than 12 hours after continuity plan activation," sustain "for a minimum of 30 days or until normal operations are resumed" — current FCD "Essential Functions Risk Identification and Management" (Aug 2024) Sec. 6.2 [FEMA FCD (2024)]. **Correction (audit 2026-09-28)**: FCD-1 and FCD-2 (2017) are no longer current — FEMA's Aug 2024 unnumbered FCDs "Continuity Program Management Requirements" (supersedes FCD-1) and "Essential Functions Risk Identification and Management" (supersedes FCD-2, its Sec. 1.1) replaced them; OSG/exam may still use the FCD-1/FCD-2 names. Trap: COOP's first step = identify MEFs via BIA, not pick the alternate site
  - Test/exercise types, least to most rigorous/disruptive [OSG glossary]:

  | Type | What happens |
  | --- | --- |
  | **Checklist test** | Recovery checklists distributed to team members for review only |
  | **Structured walk-through** (aka **tabletop exercise**) | Group talks through the plan verbally/with minimal aids to find gaps |
  | **Simulation test** | Team gets a scenario, develops a response; may interrupt noncritical activities |
  | **Parallel test** | Team actually relocates to the alternate site and runs activation procedures |
  | **Full-interruption test** | Primary site is actually shut down and operations shift to the recovery site |
  - Governance hook: **NIST SP 800-53 CP (Contingency Planning) family** — CP-2 Contingency Plan, CP-4 Contingency Plan Testing, CP-6/CP-7 Alternate Storage/Processing Site, CP-9 System Backup, CP-10 System Recovery and Reconstitution [NIST SP 800-53]
  - **ISO 22301** = international BCMS (business continuity management system) standard; PDCA-style continual-improvement structure (plan, implement, monitor, review, improve), org-agnostic (any type/size) [ISO 22301]
- Exam traps / distractors:
  - **BCP vs. DRP vs. COOP vs. ISCP**: business processes / physical site+infra / mission-essential functions (federal, 30-day cap) / single system — question gives a scenario, pick the plan by what's being restored, not by "which plan is more important"
  - **RPO is not "how fast," it's "how much data."** Confusing RPO with RTO is the single most common metric trap
  - **RTO + WRT <= MTD** — if a scenario's proposed RTO leaves no room for WRT under the stated MTD, the plan fails, even if RTO alone looks fine
  - Symptom -> metric: missing recent data -> **RPO**; slow return -> **RTO**; restored data *invalid* -> **WRT** (verification window); total outage unsurvivable -> **MTD**. "Data problem" != RPO when the issue is correctness, not age (practice Q 2026-10-05)
  - Test order = exam favorite for "least disruptive first" / "most realistic but riskiest last" sequencing questions: checklist -> structured walk-through -> simulation -> parallel -> full-interruption
  - BCP is a **lifecycle**, not a document — "the plan is done once written" is always wrong; testing/maintenance (steps 6-7) never stop
  - BIA identifies criticality and produces MTD/RTO/RPO; it does **not** select the recovery strategy itself (that's continuity planning/step 4) — don't let a BIA-scoped question answer with a site-selection choice. Example: BIA output = "order DB: MTD 8 hrs, RPO 15 min"; picking a hot site in another region = continuity planning
- Related terms: qualitative vs. quantitative risk analysis (BIA impact math), supply chain and SCRM (external dependency overlap), risk responses, alternate site types/DR site selection (own entry later, domain 7.13), types of risk
- Sources: [NIST SP 800-34], [NIST SP 800-53], [ISO 22301], [OSG glossary], [ISC2 outline], [FEMA FCD-2 (2017)], [FEMA FCD (2024)], [unverified]

## Security governance principles (1.3)
- Definition (ISC2 framing): aligning the security function with business strategy through organizational structure, accountability, and process — governance decides *who* is accountable for security decisions and *how* they get made, distinct from operating the controls themselves [ISC2 outline]
- Key facts:
  - **Due care vs. due diligence** [OSG glossary]:

  | Term | ISC2/OSG framing | Timing | Example |
  | --- | --- | --- | --- |
  | **Due diligence** | Establishing the plan/policy/process — **knowing** what should be done | Before / ongoing research | Commissioning the pentest |
  | **Due care** | Practicing it — **doing** the right action, maintaining security after deployment | Ongoing execution | Funding the fix it flagged |
    - Due diligence without due care (research done, nobody acts on it) is a real exam scenario — diligence alone isn't a negligence defense
    - DRP version: writing the plan/roles/procedures = diligence; **exercising/testing** it = care — "best demonstrates due care" -> successful tests, not documentation (practice Q 2026-10-05)
    - Both together are the legal defense against a **negligence** claim; missing either = exposure
  - **Organizational processes** (outline 1.3 examples: acquisitions, divestitures, governance committees [ISC2 outline]; content below [unverified]): M&A due diligence (assess a target's security posture/liabilities before acquisition; plan access/system integration or separation for a divestiture); **governance committees** (security steering committee sets policy direction, reports to the board/executive management on risk posture). Example: pre-close, the target's flat network and missing EDR get priced into the deal; post-close, the AD trust stays one-way until remediated
  - **Roles and responsibilities** (governance layer — contrast with data owner/custodian, which is domain 2's operational layer) [unverified]: board sets risk appetite -> executive management (CISO) owns the program -> steering committee coordinates cross-functional decisions -> operational teams execute
  - **Control/security framework survey** — pick the right one per scenario [unverified, standard industry framing]:

  | Framework | What it is | Example |
  | --- | --- | --- |
  | **ISO 27001** | Certifiable **ISMS** (information security management system) standard — auditable, org gets certified | Customer RFP demands the certificate |
  | **NIST CSF** | Voluntary risk-based framework: Identify/Protect/Detect/Respond/Recover — not prescriptive controls, no certification | Self-assessed current-vs-target profile |
  | **COBIT** | IT governance/management framework (see own entry) — process maturity + control objectives | IT audit's control objectives |
  | **SABSA** | Business-risk-driven enterprise security **architecture** methodology — layered like Zachman, traces every control back to a business requirement | Firewall rule traced to business need |
  | **PCI DSS** | Contractual (not law) — card-brand-mandated technical controls | Acquiring bank demands compliance attestation |
  | **FedRAMP** | US federal cloud-service authorization, built on **NIST SP 800-53** controls | SaaS vendor selling to an agency |

    - Row checks: all six are the outline 1.3 example list [ISC2 outline]. **NIST CSF**: voluntary ("may be adopted voluntarily") — CSWP 29 (CSF 2.0, Feb 26, 2024) [NIST CSF 2.0]. **Correction (audit 2026-09-28)**: CSF 2.0 has **six** Functions — **GOVERN**, Identify, Protect, Detect, Respond, Recover (CSWP 29 Sec. 2); the five-function list above is CSF 1.1. **SABSA**: "business-driven, risk and opportunity focused," "two-way traceability," aligns with Zachman [sabsa.org]. **PCI DSS** contractual: SSC sets it, card brands enforce [PCI SSC]. **FedRAMP**: baselines built on the SP 800-53 catalog — CSP Authorization Playbook [fedramp.gov]. **ISO 27001** certifiable: iso.org returned 403 [unverified]
- Exam traps / distractors:
  - "We researched and documented the risk but didn't fix it" -> due diligence present, due care absent -> still negligent
  - **ISO 27001 = certifiable**; **NIST CSF = not certifiable** — a "get certified against the CSF" option is wrong
  - SABSA answer cue: "traces back to business requirements" / architecture layers; COBIT cue: "IT governance," "process maturity," "control objectives"
  - Framework choice questions test recognition, not "which is best" — match the cue words in the stem to the framework's defining trait
- Related terms: ISC2 Code of Professional Ethics (org code contrast), COBIT basics, security planning types (business alignment), legal and regulatory landscape (due care as negligence defense), supply chain and SCRM
- Sources: [OSG glossary], [ISC2 outline], [NIST CSF 2.0], [sabsa.org], [PCI SSC], [fedramp.gov], [unverified]

## Investigation types and evidence (1.5)
- Definition (ISC2 framing): five investigation types an org may be subject to or conduct, distinguished by *who* investigates and *what standard applies* [ISC2 outline]:

  | Type | Who conducts it | Standard | Example |
  | --- | --- | --- | --- |
  | **Administrative** | Internal (HR/security) | No formal legal standard — org's own process | HR pulls a staffer's proxy logs |
  | **Criminal** | Law enforcement | Beyond a reasonable doubt | FBI seizes the C2 server |
  | **Civil** | Private party (via courts) | Preponderance of evidence | Ex-vendor sues over breached contract |
  | **Regulatory** | Government agency (SEC, FTC, etc.) | Substantial evidence (admin-law standard) | SEC probes a late breach disclosure |
  | **Industry standard** | Contractually mandated third party (e.g., **PCI Forensic Investigator**) | Contract-defined, not legal | PFI engaged after card-data breach |
  - This table's **administrative/regulatory split by investigator** is a different axis than the *Legal and regulatory landscape* entry's three **categories of law** (criminal/civil/administrative-as-law) — same word "administrative," two different ISC2 taxonomies (see that entry's traps)
  - Evidence fundamentals [OSG glossary]:
    - **Real evidence** (aka object evidence) — physical items admissible in court
    - **Direct evidence** — witness testimony from personal (five-senses) knowledge. Example: the admin testifying "I watched him plug in the drive"; the drive itself = real evidence
    - **Best evidence rule** — original document required; copies rejected unless an exception applies
    - **Secondary evidence** — a copy or oral description of best evidence (what the rule above excludes, absent an exception)
    - **Conclusive evidence** — incontrovertible; overrides all other evidence
    - **Hearsay evidence** — secondhand statements made outside court; unauthenticated log files count as hearsay
    - **Chain of custody** (aka chain of evidence) — unbroken documentation of who controlled the evidence from collection to court; breaks make it inadmissible
- Exam traps / distractors:
  - Collect evidence to the **criminal** standard regardless of which investigation type it started as — it may escalate (cross-ref: legal and regulatory landscape entry)
  - Unauthenticated log files = **hearsay** by default — a recurring "why was this evidence excluded" trap
  - **Best evidence rule** trips up "we submitted a printed copy" answers when the original (or an exception) wasn't established
  - Internal/administrative investigations don't need a criminal standard, but sloppy chain-of-custody handling forecloses a later criminal referral
- Related terms: legal and regulatory landscape (burden of proof, categories of law), forensics/incident response (domain 7, future entry)
- Sources: [OSG glossary], [ISC2 outline]

## Personnel security policies (1.8)
- Definition (ISC2 framing): security controls applied across the employment lifecycle — screening before hire, agreements at hire, access changes during employment, and clean separation at exit — extended to vendors/contractors, not just employees [ISC2 outline]
- Key facts:
  - **Screening/hiring**: background checks verify a candidate is qualified and free of disqualifications (criminal history, employment/education verification, credit check for financial-trust roles); depth scales with role sensitivity [OSG glossary]
  - **Employment agreements**: **NDA** (nondisclosure agreement — protects confidential info from disclosure), **NCA** (noncompete agreement, aka covenant not to compete — restricts working for a competitor using learned secrets), plus policy acknowledgment (**AUP** — see documentation hierarchy entry) [OSG glossary]
  - **Onboarding/transfers/termination** [OSG glossary]:
    - **Onboarding** — adding identity to **IAM**; also used for role changes / added privilege
    - **Offboarding** — removing identity from IAM once the person has left
    - **Exit interview** — HR-run debrief on why the employee is leaving; feeds retention/process improvements, not a security control itself
  - **Vendor/consultant/contractor controls**: same agreement toolkit (NDA/NCA) plus **SLA** (service-level agreement) and **right-to-audit clause** — gives the customer the ability to investigate a CSP's/vendor's performance, compliance, and violations [OSG glossary]
- Exam traps / distractors:
  - **Termination access revocation timing**: for a hostile/involuntary termination, disable access **at or before** notification, not after — the classic "employee walked out with data" scenario tests whether revocation preceded or followed the conversation
  - Onboarding/offboarding = **IAM lifecycle** actions, not the agreements themselves — don't confuse the paperwork (NDA/AUP) with the account-provisioning action
  - Right-to-audit clause lives in the **SLA**, not the NDA — NDA only covers confidentiality. Example: wanting to inspect the MSP's own patch cadence = SLA clause; the NDA only stops them discussing your incidents
  - Background check depth is **risk-scaled** to role (a sysadmin candidate warrants deeper screening than a role with no system access) — "same background check for everyone" is the wrong-uniformity trap
- Related terms: documentation hierarchy (AUP), supply chain and SCRM (vendor risk overlap, different angle — SCRM is product/service supply chain, this is contractual personnel-style vendor controls), security governance principles (roles)
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Risk assessment, monitoring, and maturity (1.9)
- Definition (ISC2 framing): the ongoing half of risk management after a response is chosen — verifying controls still work, watching the environment for change, and reporting/maturing the program over time [ISC2 outline]
- Key facts:
  - **Control assessments** (security **and** privacy): formal evaluation of whether a control is implemented correctly, operating as intended, and producing the desired outcome — **NIST SP 800-53A** provides the assessment procedures for the SP 800-53 control catalog [NIST SP 800-34, referencing 800-53A]
  - **Continuous monitoring**: ongoing (not point-in-time) visibility into assets, threats/vulnerabilities, and control effectiveness so risk posture stays inside tolerance as things change — federal term of art is **ISCM** (Information Security Continuous Monitoring), **NIST SP 800-137** [NIST SP 800-137]
  - **Reporting**: internal (board/executive risk reporting, feeds governance decisions) vs. external (regulators, customers, auditors — often contractually or legally mandated, e.g. breach notification)
  - **Continuous improvement / risk maturity modeling**: apply maturity-model thinking (cf. **Capability Maturity Model (CMM)** — originally a software-process model [OSG glossary]) to the risk program itself: ad hoc -> repeatable -> defined -> managed -> optimized (CMM levels Initial ("ad hoc")/Repeatable/Defined/Managed/Optimizing — SEI CMU/SEI-93-TR-024, CMM v1.1, Sec. 2.1 [SEI CMM]). ISC2 doesn't mandate a single named risk-maturity model (outline 1.9 says only "Continuous improvement (e.g., risk maturity modeling)" [ISC2 outline]); the exam tests the *concept* (a risk program matures through stages, doesn't jump to "optimized") rather than exact level names [unverified]
- Exam traps / distractors:
  - Control assessment != control implementation — a control can be implemented but the *assessment* is what proves it's effective; "we deployed it" answers a different question than "we assessed it". Example: EDR on 100% of endpoints = implemented; sampling hosts to confirm tamper protection and policy actually applied = assessed
  - **Continuous monitoring is ongoing**, not an annual point-in-time check — "we monitor once a year" fails the definition. Example: vuln scanner + SIEM dashboards feeding a monthly posture report = ISCM; the annual pentest is not
  - Internal reporting drives decisions; external reporting is often a **compliance obligation** — mixing up the audience is a common distractor. Example: board slide "phish click rate down to 3%" = internal; the 72-hr GDPR notification = external
  - Maturity is a **progression**, not a binary "compliant/not compliant" — a scenario describing ad hoc, undocumented practices signals low maturity even if outcomes are currently fine. Example: analysts triaging from memory = ad hoc; written playbooks = defined; playbook metrics driving tuning = optimized
- Related terms: risk responses, RMF, qualitative vs. quantitative risk analysis, security governance principles (reporting to governance committees)
- Sources: [NIST SP 800-137], [OSG glossary], [ISC2 outline], [SEI CMM], [unverified]

## Security awareness, education, and training program (1.12)
- Definition (ISC2 framing): the program that keeps the workforce able to recognize and resist threats — distinct from technical controls, this is a **people** control, and it has its own lifecycle (design, deliver, review, measure) [ISC2 outline]
- Key facts:
  - **Methods/techniques** [OSG glossary]:
    - **Phishing simulation** — controlled phishing campaign to measure/train employee resistance (often run by the same team that pentests)
    - **Gamification** — rewards (and sometimes penalties) tied to compliance behaviors, using gameplay elements to drive engagement
    - **Security champions** — often non-security employees (frequently in dev teams) who take up peer leadership to spread security practices within their group
  - **Periodic content review**: training content needs refresh cycles to keep pace with emerging threats/tech — stale annual-only content is a known program weakness
  - **Program effectiveness evaluation**: measured via behavior metrics (phishing simulation click-through/report rates over time), completion/comprehension rates, and incident trend correlation — not just "training was delivered"
- Exam traps / distractors:
  - **Training delivered != program effective** — completion rate alone is a distractor; the exam wants outcome/behavior metrics (falling click-through rate, rising report rate)
  - Phishing simulation results should train, not punish, in most ISC2-preferred answers — a "fire employees who click" option is usually wrong (culture/behavior-change framing beats punitive framing)
  - Security champions are **peer influence**, not a replacement for formal training or a compliance/enforcement role. Example: the dev who adds the SAST gate to her team's pipeline unprompted; not the compliance officer chasing completions
  - "One-time training at hire" fails the periodic-review expectation — awareness is continuous, same lifecycle framing as BCP/risk maturity
- Related terms: security governance principles (culture/behavior framing), personnel security policies (onboarding is where initial training typically lands)
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## GDPR - terms and requirements (1.4)
- Definition (ISC2 framing): Regulation (EU) **2016/679** — a **Regulation, not a Directive**, so it is directly applicable across the EU/EEA with no national transposition; single harmonized data protection and privacy law governing processing and transfer of EU/EEA persons' personal data [OSG glossary]
- Sourcing note: article numbers below corroborated 2026-09-04 against a faithful GDPR text mirror (gdpr.algolia.com). **eur-lex full text remains unfetchable** (failed 2026-09-01 and again 2026-09-04, multiple URL forms; 2026-09-28: WebFetch empty, curl HTTP 202 with 0-byte body) — treat as corroborated-not-primary and re-verify if a number is decisive [GDPR text mirror]
- Key facts:
  - **Territorial scope (Art. 3)**: reaches controllers/processors **outside the EU** who offer goods or services to, or **monitor the behaviour of**, data subjects in the EU — **no EU office required**
  - **Terms (Art. 4 definitions)**: **personal data** (information relating to an identified or identifiable natural person), **processing** (essentially any operation, collection through erasure), **controller** (determines purposes and means), **processor** (acts on behalf of controller), **data subject** (the individual). Example: the retailer deciding to keep purchase history = controller; its SaaS CRM vendor = processor. Roles in depth: D2 data ownership entry
  - **Six principles (Art. 5(1))**:
    1. **Lawfulness, fairness and transparency**
    2. **Purpose limitation** — specified, explicit, legitimate purposes
    3. **Data minimisation** — adequate, relevant, limited to what is necessary
    4. **Accuracy** — kept up to date; inaccuracies erased/rectified without delay
    5. **Storage limitation** — identifiable form no longer than necessary
    6. **Integrity and confidentiality** — appropriate security
    - **Art. 5(2) = accountability**: the controller must be **responsible for AND able to demonstrate** compliance — being compliant is not enough, it must be provable
  - **Six lawful bases (Art. 6(1))** — need **at least one**: **(a) consent**, **(b) contract**, **(c) legal obligation**, **(d) vital interests**, **(e) public task**, **(f) legitimate interests**. Basis (f) is **unavailable to public authorities** performing statutory functions
  - **Special categories (Art. 9)**: health, biometrics for ID, racial/ethnic origin, political opinions, religious beliefs, trade union membership, sex life/orientation — **prohibited by default**, need an Art. 9 condition **on top of** the Art. 6 basis
  - **Data subject rights (Ch. III, Arts. 12-22)**:

  | Right | Article |
  | --- | --- |
  | **Access** | 15 |
  | **Rectification** | 16 |
  | **Erasure** ("right to be forgotten") | 17 |
  | **Restriction** of processing | 18 |
  | **Portability** | 20 |
  | **Object** | 21 |
  | Not subject to solely **automated decision-making**/profiling | 22 |

  - **Organizational requirements**:

  | Requirement | Article |
  | --- | --- |
  | Data protection **by design and by default** | 25 |
  | **Processor contracts** (binding written terms) | 28 |
  | **Records of processing activities** | 30 |
  | **Security of processing** | 32 |

  | Requirement | Article |
  | --- | --- |
  | Breach notification to **supervisory authority** | 33 |
  | Breach communication to **data subject** | 34 |
  | **DPIA** (data protection impact assessment), high-risk processing | 35 |
  | **DPO** (data protection officer) designation | 37 |

    - **Breach timing** — the most-tested mechanic: **72 hours to the supervisory authority** (Art. 33), clock starts when the controller **becomes aware**, not when the breach occurred. Notification to **data subjects** (Art. 34) is a different trigger: **without undue delay**, and only where there is **high risk to their rights and freedoms**. Example: intruder in since March, SOC confirms exfil Tuesday 10:00 -> supervisory-authority clock runs to Friday 10:00
  - **Transfers (Ch. V, Arts. 44-49)**: need **adequacy decision** (45), or **appropriate safeguards** (46) such as **SCCs** (standard contractual clauses), or **BCRs** (binding corporate rules, 47)
  - **Fines (Art. 83)** — two tiers, in each case **whichever is HIGHER**:

  | Tier | Maximum | Covers |
  | --- | --- | --- |
  | **83(4)** | **EUR 10M or 2%** worldwide annual turnover | Controller/processor obligations — design, records, security, DPO, processor duties |
  | **83(5)** | **EUR 20M or 4%** worldwide annual turnover | Principles, consent, **data subject rights**, unlawful transfers, ignoring supervisory authority orders |

- Exam traps / distractors:
  - **Consent is one of six lawful bases** — options treating it as always required, or as inherently the strongest, are wrong
  - **72 hours is to the supervisory authority, measured from awareness** — not to individuals, not from occurrence
  - **Fines: two tiers, "whichever is higher"** — a 4%-only answer, or a "whichever is lower" answer, fails; it is **worldwide turnover**, not EU revenue or profit
  - **Extraterritorial** — "we have no EU offices/entity" does not exempt an organization
  - **Right to erasure is not absolute** — yields to legal obligations and other exemptions. Example: customer asks to be forgotten; invoices stay under tax-retention law, marketing profile goes
  - **DPIA is for high-risk processing**, not every processing activity. Example: rolling out UEBA on all staff endpoints = DPIA candidate; changing the newsletter template is not
  - **Accountability (5(2)) means demonstrable** — "we comply but keep no records" fails. Example: the Art. 30 register, DPIA files, and consent logs on hand; not a "GDPR compliant" badge on the website
  - Distractor pairings: **CCPA** as the US analog; **HIPAA's 60-day** individual breach notification against GDPR's **72-hour** supervisory-authority notification
  - **Regulation vs. Directive** — directly applicable; an option saying member states must pass implementing law first is wrong
- Related terms: privacy laws table (export controls and privacy laws entry, same domain), data ownership and roles (D2 2.3/2.4, controller/processor), sensitive data types (D2 2.1, PII), transborder data flow (1.4), HITECH business associate liability (1.4)
- Sources: [OSG glossary], [GDPR text mirror], [ISC2 outline]

## NIST SP 800 quick reference
- Definition (ISC2 framing): recognition set — scenario options name SP numbers; know each document's job and its adjacent distractor
- Key facts:
  - Core tier (verified in entries above except where tagged):

  | SP | Job | Domain |
  | --- | --- | --- |
  | **800-30** | Conducting risk assessments | 1 |
  | **800-34** | Contingency planning (BCP/DRP/ISCP) | 1/7 |
  | **800-37** | RMF authorization process | 1 |
  | **800-53** (+A/B) | Control catalog / assess / baselines | 1 |
  | **800-61** | Incident handling [NIST SP 800-61] | 7 |
  | **800-63** | Digital identity, authentication levels [NIST SP 800-63-4] | 5 |
  | **800-88** | Media sanitization (clear/purge/destroy) | 2 |

  - Recognition tier:

  | SP | Job | Pairing/tell |
  | --- | --- | --- |
  | **800-12** | Intro to infosec; policy triple | program/issue/system [NIST SP 800-12] |
  | **800-39** | Enterprise risk mgmt strategy | vs. 800-30 assessment |
  | **800-60** | Info types -> security categories | feeds RMF **Categorize** [NIST SP 800-60] |
  | **800-115** | Security testing/assessment [NIST SP 800-115] | Domain 6 |
  | **800-137** | Continuous monitoring (ISCM) [NIST SP 800-137] | feeds RMF **Monitor** |
  | **800-161** | C-SCRM supply chain | 1.11 [NIST SP 800-161] |
  | **800-171** | CUI in **nonfederal** systems [NIST SP 800-171] | contractor tell; vs. 800-53 federal |

  - Current titles (csrc.nist.gov, checked 2026-09-28): 800-61 **Rev. 3** (Apr 2025) "Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF 2.0 Community Profile" (supersedes Rev. 2, Aug 2012); 800-63-4 (Jul 2025) "Digital Identity Guidelines" — identity proofing, authentication, federation; 800-115 (Sep 2008) "Technical Guide to Information Security Testing and Assessment"; 800-137 (Sep 2011) "Information Security Continuous Monitoring (ISCM) for Federal Information Systems and Organizations"; 800-171 Rev. 3 (May 2024) "Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations"; 800-53A Rev. 5 (Jan 2022) "Assessing Security and Privacy Controls in Information Systems and Organizations"

  - Memory spine = RMF: 60 categorize -> 53B select -> 53 implement -> 53A assess -> 37 authorize -> 137 monitor; FIPS 199/200 before Select
- Exam traps / distractors:
  - **800-30 vs. 37 vs. 39**: assessment / process / enterprise strategy
  - **800-53 vs. 171**: federal systems vs. CUI on contractor systems
  - **800-53A vs. 115**: control assessment vs. technical security testing
- Related terms: RMF entry, FIPS 199/200, control baselines
- Sources: [NIST SP 800-12], [NIST SP 800-30], [NIST SP 800-34], [NIST SP 800-37], [NIST SP 800-53B], [NIST SP 800-60], [NIST SP 800-61], [NIST SP 800-63-4], [NIST SP 800-115], [NIST SP 800-137], [NIST SP 800-161], [NIST SP 800-171]
