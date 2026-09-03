# Domain 1: Security and Risk Management

## Key areas to master (video emphasis)
- Priority list from course video, mapped to outline sections: [unverified]
  - **Risk** concepts + risk analysis process — 1.9 [ISC2 outline]
  - **Threat modeling** concepts and methodologies — 1.10 [ISC2 outline]
  - **Compliance**, legal, regulatory, privacy — 1.4 [ISC2 outline]
  - **Professional ethics** — ISC2 Code, know it cold — 1.1 [ISC2 outline]
  - **Security governance** principles — 1.3 [ISC2 outline]
  - **Policy / standard / procedure / guideline** hierarchy — 1.6 [ISC2 outline]
- Correction to source video: **ITIL** (Information Technology Infrastructure Library) is not an outline-listed governance framework; 1.3 lists ISO, NIST, **COBIT** (Control Objectives for Information and Related Technologies), SABSA (Sherwood Applied Business Security Architecture), PCI (Payment Card Industry), FedRAMP (Federal Risk and Authorization Management Program) [ISC2 outline]. ITIL = IT service management; COBIT is the governance answer, ITIL the distractor.
- Mandatory vs. discretionary: policies, standards, procedures, baselines mandatory; **guidelines** only discretionary [OSG glossary]
- Exam traps / distractors: **ITIL vs. COBIT**; guideline offered where enforcement is required
- Sources: [ISC2 outline], [unverified]

## CIA triad / five pillars
- Definition (ISC2 framing): 2024 outline 1.2 lists **five pillars**: confidentiality, integrity, availability, **authenticity**, **nonrepudiation** [ISC2 outline]
- Key facts:
  - **Authenticity** = genuine, from claimed origin; adjacent to integrity but about source, not modification [OSG glossary]
  - **Nonrepudiation** = actor cannot deny the event; canonical control = **digital signature** [OSG glossary]
  - **Availability** includes timely and uninterrupted access, not just uptime [OSG glossary]
  - Formal C-I-A definitions: **FIPS 199** (Federal Information Processing Standards) Section 3, each quoted from **44 U.S.C.** (United States Code) **Sec. 3542** (FISMA — Federal Information Security Management Act) [NIST FIPS 199]
  - FISMA's integrity definition explicitly includes nonrepudiation and authenticity — supports the five-pillar grouping [NIST FIPS 199]
  - **DAD triad** = disclosure, alteration, destruction; failure states of C-I-A [OSG glossary]
- Exam traps / distractors:
  - **MAC/HMAC** (message authentication code / hash-based MAC) = integrity + authentication, NO nonrepudiation (shared symmetric key); **digital signature** = adds nonrepudiation [OSG glossary]
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
- Exam traps / distractors:
  - Employer-pressure scenarios: canon 3 pull is the trap; canons 1-2 outrank -> refuse/report
  - "**Be seen to adhere**" -> undisclosed conflict of interest violates Code even without bad acts
  - **RFC 1087** (Request for Comments; IAB — Internet Activities Board — "Ethics and the Internet") as distractor for ISC2 Code questions [RFC 1087]
- Related terms: organizational code of ethics (1.1), due care, RFC 1087
- Sources: [ISC2 ethics page], [RFC 1087], [unverified]

## Security documentation hierarchy (policy -> procedure)
- Definition (ISC2 framing): formal security documentation levels: **policy -> standard -> baseline -> guideline -> procedure**; standards+baselines share a tier, giving "four levels of policy development" [OSG glossary]
- Key facts: [OSG glossary]

  | Level | Function | Binding? |
  | --- | --- | --- |
  | **Policy** | Management intent, scope, roles | Mandatory |
  | **Standard** | Compulsory uniform requirements | Mandatory |
  | **Baseline** | Minimum security level to meet | Mandatory |
  | **Guideline** | Recommendations, methodologies | **Discretionary** |
  | **Procedure** | Step-by-step how-to (SOP — standard operating procedure) | Mandatory |

  - Policy types by purpose: **regulatory** (law/industry-required), **advisory** (most policies; behavior + consequences), **informative** (unenforceable) [OSG glossary]
  - Policy scope: **organizational** (whole org) vs. **issue-specific** (one service/function) [OSG glossary]; NIST triple = **program / issue-specific / system-specific** policy, SP 800-12 Rev. 1 Secs. 5.2-5.4 (NIST's "program policy" = OSG's "organizational policy") [NIST SP 800-12]
  - **AUP** (acceptable use policy) = issue-specific policy defining acceptable activity/use of company resources; NOT the role-assigning document (that is the **organizational security policy**) [OSG glossary]
  - "Mandatory" binds via **senior management** authority + employment/contract relationship; sanction = **disciplinary, not legal** (law binds only via the regulation behind a regulatory policy, or independently criminal acts). Management official issues program policy, SP 800-12 Rev. 1 Sec. 5.2 [NIST SP 800-12]. Enforced policy evidences **due care** in negligence claims [unverified]
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

  - **Vulnerability** includes the absence of a safeguard, not only a flaw [OSG glossary]
- Exam traps / distractors:
  - **Threat vs. vulnerability vs. risk** definitional swaps — top 1.9 question type
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
  - Plans (time axis) vs. **policy/standard/procedure** (authority axis) — questions swap axes
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
  - **Accept vs. reject** = documented conscious decision vs. undocumented ignoring (negligence/due care failure)
  - **Insurance = transfer**, not acceptance/mitigation; consequence transfers, **accountability does not** [unverified]
  - **Avoid vs. mitigate**: activity eliminated vs. activity continued with controls
  - ISO 31000 vocabulary swap: modify=mitigate, retain=accept, share=transfer. Audit 2026-09-01: iso.org full text paywalled; retain/share/modify/avoid vocabulary corroborated by iso.org search snippets only — not primary-verified [unverified]
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
  - **800-37 vs. 800-30 vs. 800-39**: RMF process vs. risk assessment guide vs. enterprise risk strategy
  - "First RMF step" -> **Prepare** (Rev. 2); six-step lists starting Categorize are outdated
  - "Who accepts risk" -> **AO** (senior official), not ISSO (Information System Security Officer)/assessor
  - **RMF vs. CSF** (Cybersecurity Framework): federal/compliance/system-level vs. voluntary/outcome-based/any org
- Related terms: FIPS 199 (five pillars entry), risk responses (acceptance), SP 800-53 control baselines, CSF
- Real-world risk methodologies (low exam weight per OSG; not in OSG glossary) [unverified]:
  - **OCTAVE** (Operationally Critical Threat, Asset, and Vulnerability Evaluation) — Carnegie Mellon SEI (Software Engineering Institute); self-directed, asset-driven org risk assessment
  - **FAIR** (Factor Analysis of Information Risk) — quantitative model: loss frequency x loss magnitude in dollar terms
  - **TARA** (Threat Agent Risk Assessment) — Intel; prioritizes the threat agents most likely to attack
- Sources: [NIST SP 800-37], [ISC2 outline], [unverified]

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
  - **Appetite** = risk org chooses to bear; **tolerance** = ability to absorb losses; **capacity** = risk org is able to shoulder; appetite may exceed capacity (testable mismatch) [OSG glossary]
- Exam traps / distractors:
  - **Residual never zero**; formally accepted by senior management
  - Inherent vs. residual swap on post-control scenarios
  - **Controls gap** = a difference, not a held risk
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
  - Qualitative is CORRECT (not fallback) when numbers unreliable or speed matters; "quantitative always better" = wrong
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
  - **RoT vs. PUF**: boot-integrity anchor vs. identity fingerprint — distractors swap
  - Minimum requirements go **in the contract**; trust-based options lose
  - SCRM = proactive governance (D1); detecting poisoned update = operations (D7)
- Related terms: third-party assessment, SOC 2 (Domain 6), vendor agreements (1.8), minimum security requirements
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Threat modeling - STRIDE and methodologies
- Definition (ISC2 framing): **threat modeling** = identifying, understanding, categorizing potential threats [OSG glossary]; done **proactively at design time** (exam answer), vs. reactive ops [unverified]
- Key facts:
  - **STRIDE** = Microsoft threat categorization scheme [OSG glossary]; property mapping per Microsoft SDL threat-modeling docs [Microsoft SDL]:

  | Letter | Threat | Property violated |
  | --- | --- | --- |
  | **S**poofing | Fake identity/origin | Authentication / authenticity |
  | **T**ampering | Unauthorized modification | Integrity |
  | **R**epudiation | Deny having acted | Nonrepudiation |
  | **I**nformation disclosure | Data exposure | Confidentiality |
  | **D**enial of service | Resource exhaustion | Availability |
  | **E**levation of privilege | Gain unauthorized rights | Authorization |

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
  - **Trike** = risk-based alternative to STRIDE/DREAD aggregation [OSG glossary]; **open-source**, implements a **requirements model** — ensures the assigned risk level for each asset is "acceptable" to **stakeholders** (course video) [unverified]
- Exam traps / distractors:
  - **STRIDE categorizes, DREAD scores** — the recurring pair
  - **Repudiation vs. spoofing**: deny-after-the-fact vs. lie-about-identity (same axis as authenticity/nonrepudiation pillar split)
  - "Seven steps"/"attack simulation" -> **PASTA**; "Agile" -> **VAST**
  - Threat modeling = design-time risk input (D1), NOT penetration testing (D6)
- Related terms: five pillars (property mapping), risk categories (adversarial sources), SP 800-30 threat sources, TARA
- Sources: [OSG glossary], [unverified]
- **Reduction analysis** (aka decomposing): divide target into smaller containers (modules / hosts+protocols / departments) to understand logic + external interactions; evaluate each sub-element's inputs, processing, security, data mgmt, storage, outputs [OSG glossary]. = the DFD step of STRIDE workflows; = PASTA stage 3 (ADA). Five things to identify (verify OSG ch. 1) [unverified]:

  | # | Concept | Look for |
  | --- | --- | --- |
  | 1 | **Trust boundaries** | Where trust level changes (user->app, DMZ->internal) |
  | 2 | **Dataflow paths** | Data movement between locations |
  | 3 | **Input points** | External input locations (attack surface) |
  | 4 | **Privileged operations** | Anything running elevated |
  | 5 | **Security stance / approach** | Declared policy, assumptions |

  - Traps: decompose BEFORE categorizing threats; distinct from **attack surface reduction** (hardening, not modeling)

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

  - Principle 4 = the tested one: governance (board: evaluate/direct/monitor) vs. management (plan/build/run)
  - ISACA also runs CISA -> COBIT pairs with IT **audit** language
- Exam traps / distractors — framework-for-purpose matching:

  | Described purpose | Answer |
  | --- | --- |
  | IT governance, business/IT alignment, audit | **COBIT** |
  | IT service management (incidents, SLAs) | ITIL |
  | Certifiable ISMS | ISO 27001 |
  | Voluntary cyber risk outcomes, any org | NIST CSF |
  | Corporate internal control / SOX | **COSO** [unverified] |

- Related terms: governance alignment (1.3), ITIL-vs-COBIT (key areas entry), ISO 27001, NIST CSF, COSO
- Sources: [OSG glossary], [unverified]

## Security control categories (administrative / technical / physical)
- Definition (ISC2 framing): categories = **how implemented**; types (preventive/detective/corrective...) = **what it does**; every control has one of each
- Key facts:

  | Category | Implemented as | Examples |
  | --- | --- | --- |
  | **Administrative** | Policies, procedures, people processes | Hiring, background checks, training, supervision |
  | **Logical/technical** | Hardware/software mechanisms | AuthN, encryption, firewalls, IDS |
  | **Physical** | Blocks direct contact/access | Locks, guards, mantraps, fences |

  - Administrative aka **management/managerial/procedural** controls — four names, one category [OSG glossary]
  - NIST legacy taxonomy: management/**operational**/technical; operational = day-to-day mechanisms [OSG glossary]. Correction (audit 2026-09-01): previously attributed to FIPS 200 — the FIPS 200 page shows control *families*, not M/O/T classes; the M/O/T grouping was legacy **SP 800-53** (pre-Rev 4) [unverified]
  - **Vacation history review** = administrative + detective (canonical combined classification) [OSG glossary]
- Exam traps / distractors:
  - Category vs. type axes never mix: "detective" is not a category, "physical" is not a type
  - Classification pairs: training = admin + preventive; guard = physical + preventive/deterrent; log review = technical + detective
  - **Defense in depth** = layering across categories; "control failed" -> add different-category layer
- Related terms: control types (preventive/detection/corrective, 1.9 — future entry), defense in depth (3.1), physical security (7.14)
- Sources: [OSG glossary], [ISC2 outline], [unverified]

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
  - **Preventive vs. deterrent**: works without attacker's cooperation vs. works on their decision
  - **Corrective vs. recovery**: minor return-to-normal vs. advanced restoration (recovery = extension of corrective) [OSG glossary]
  - **Directive vs. deterrent**: compliance-oriented instruction vs. consequence-oriented discouragement
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
  - Same breach -> criminal + civil + administrative proceedings on same facts; can lose civil after winning criminal (lower bar)
  - Collect evidence to the **highest** standard regardless of current proceeding — may escalate (1.5, D7 forensics)
  - Parallels **investigation types (1.5)**: administrative, criminal, civil, regulatory [ISC2 outline]
  - **PCI DSS = contractual, not law** — merchant-agreement enforcement, card-brand fines (verify OSG ch. 4) [unverified]
  - Key US computer-crime-adjacent laws [OSG glossary]:

  | Law | What it does | Hook |
  | --- | --- | --- |
  | **CFAA** (Computer Fraud and Abuse Act) | Exclusively computer crimes **crossing state lines** (states'-rights design) | First major US cybercrime law; **1986** (H.R. 4718, 99th Congress) [congress.gov] |
  | **Federal Sentencing Guidelines** (1991) | Punishment guidelines for federal law violations | Formalized **prudent person rule**; executive **personal liability** for due care failures [unverified] |
  | **FISMA** (2002) | Federal agencies must run an infosec program | Explicitly includes **contractors' activities**; delegated the "how" to NIST |
  | **Copyright / DMCA** | Copyright = "original works of authorship" vs. unauthorized duplication; DMCA **Sec. 1201** anti-circumvention ban + **Sec. 512** ISP safe harbor (notice-and-takedown) | DMCA **1998** [copyright.gov] |

  - FISMA program elements (44 U.S.C. Sec. 3554 territory — verify wording) [unverified]: periodic **risk assessments** (-> FIPS 199), risk-based policies/procedures, per-system **security plans**, awareness **training**, control testing **at least annually** + independent **Inspector General** evaluation, remediation (**POA&M** — Plan of Action and Milestones), **incident response** (-> US-CERT/CISA reporting), **continuity** plans, annual **OMB**/Congress reporting. Operationally = run the **RMF** forever; FISMA is the law that ordered NIST to write FIPS 199/200 + SP 800-53
  - Broader recognition landscape: **HIPAA** (health), **GLBA** (financial privacy), **SOX** (financial reporting), FERPA (education), **GDPR**/CCPA (privacy) [ISC2 outline], **CLOUD Act** 2018 (US access to overseas data) [OSG glossary], ITAR/EAR/Wassenaar (import/export) [unverified]
- Exam traps / distractors:
  - Classify the proceeding: regulator fine -> **administrative**; lawsuit -> **civil**; prosecution -> **criminal**
  - **PCI as "regulation/legislation"** = wrong option
  - Data-to-law matching: health->HIPAA, cardholder->PCI (contractual), EU persons->GDPR
  - Legal interpretation needed -> involve **legal counsel** (CISO answer)
  - Internal/HR investigation does NOT require criminal standard, but sloppy handling forecloses criminal referral
- Related terms: regulatory policy (1.6 entry), investigation types (1.5), privacy (GDPR/CCPA future entry), due care
- Sources: [OSG glossary], [ISC2 outline], [unverified]

## Intellectual property and licensing
- Definition (ISC2 framing): **IP** = intangible creations owned/protected by an org: copyrights, trademarks, patents, trade secrets, confidential data [OSG glossary]; **licensing** = contract stating how a product is to be used [OSG glossary]
- Key facts:

  | Type | Protects | Duration | Catch |
  | --- | --- | --- | --- |
  | **Copyright** | Expression ("original works of authorship") | **Life + 70 yrs** (post-1978; work-for-hire 95/120) [copyright.gov] | Idea not protected, only expression |
  | **Patent** | Inventions: sole make/use/sell right | Up to **20 yrs from first non-provisional filing** [uspto.gov] | Requires **public disclosure** |
  | **Trademark** | Words/slogans/logos identifying company | Renewable indefinitely [unverified] | Brand identity, not tech |
  | **Trade secret** | Business-critical secret info | While secret | No registration; **disclosed = gone** |

  - Patent vs. trade secret tradeoff: ~20-yr monopoly + publication vs. indefinite protection + zero remedy after leak
  - **Economic Espionage Act**: trade-secret theft for foreign gov't -> up to $500K + 15 yrs; otherwise $250K + 10 yrs [OSG glossary]; year 1996 [unverified]
  - License types (verify OSG ch. 4) [unverified]:

  | License | Accepted by |
  | --- | --- |
  | **Contractual** | Negotiated signature |
  | **Shrink-wrap** | Opening the package |
  | **Click-through** | Clicking (EULA) |
  | **Cloud services** | Using the service |

- Exam traps / distractors:
  - Source code = **copyright AND trade secret** simultaneously — "pick one" options wrong
  - "Patent it to keep it secret" = self-contradicting (patents publish)
  - Confidential-forever algorithm -> **trade secret**; exclusivity w/ disclosure OK -> **patent**
  - Trademark **(TM)** = unregistered claim vs. **(R)** = registered
  - Unlicensed software = contractual/licensing violation, pairs with copyright infringement distractor
- Related terms: DMCA (legal entry), licensing as contractual compliance (PCI fourth box), import/export controls (1.4)
- Sources: [OSG glossary], [unverified]

<!-- REVIEW -->
## Encryption export controls and privacy laws
- Definition (ISC2 framing): two 1.4 compliance areas — governments restrict where crypto goes (**export controls**); privacy laws restrict processing of personal data [ISC2 outline]
- Key facts:
  - Export regimes (verify OSG ch. 4) [unverified]:
    - **ITAR** (International Traffic in Arms Regulations) — State Dept; defense articles (US Munitions List)
    - **EAR** (Export Administration Regulations) — Commerce/BIS; **dual-use**; commercial crypto lives here
    - **Wassenaar Arrangement** — ~40-country multilateral dual-use coordination; voluntary
    - **Computer export controls**: BIS (Bureau of Industry and Security) licenses high-performance computing exports; **embargoed destinations** (OSG list: Cuba, Iran, North Korea, Sudan, Syria) [unverified]. EAR Country Groups E:1/E:2; real-world membership has shifted (Sudan delisted 2020, Crimea added) — answer with the book on exam day [unverified]
    - Some countries restrict crypto **import/use** (licenses, escrow) — legality is per-jurisdiction
  - Privacy laws [OSG glossary]:

  | Law | Year | Covers |
  | --- | --- | --- |
  | **Privacy Act** | 1974 | Federal agencies' records: necessity, access, amendment |
  | **ECPA** | **1986** (H.R. 4952, 99th Congress) [congress.gov] | Crime to invade electronic privacy; email/voicemail monitoring + provider disclosure |
  | **HIPAA** | 1996 | Medical data: hospitals, physicians, insurers |
  | **GLBA** | 1999 | Financial institutions; deregulation + privacy duties |
  | **COPPA** | — | Sites catering to / collecting from children |
  | **GDPR** | Reg. EU **2016/679** | EU/EEA persons' PII incl. transfers out |
  | **CCPA** | — | California; **modeled on GDPR** |

  - GDPR specifics [unverified]: extraterritorial (Art. 3); rights = access, rectification, **erasure** (Art. 17), portability; **72-hr** breach notify (Art. 33); fines to **4% global revenue** (Art. 83); transfers need adequacy decision or SCCs. Audit 2026-09-01: eur-lex fetch failed — verify article numbers against Regulation 2016/679 text
- Exam traps / distractors:
  - **ITAR vs. EAR**: munitions/State vs. dual-use/Commerce — standard swap
  - **ECPA** restrains providers/private parties, not only government
  - GLBA origin = deregulation; privacy rules rode along
  - HIPAA -> business associates **directly liable** via **HITECH (2009)** Sec. 13401 — Security Rule safeguards apply to BAs as to covered entities; BAs must notify the covered entity of breaches [HHS]
  - "US law resembling GDPR" -> **CCPA**
- Related terms: transborder data flow (1.4, own entry later), DMCA/IP (licensing entry), FISMA, data protection methods (2.6)
- Sources: [OSG glossary], [ISC2 outline], [unverified]
