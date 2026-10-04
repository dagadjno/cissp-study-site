# Domain 8: Software Development Security

<!-- REVIEW -->
## Development methodologies (8.1)
- Definition (ISC2 framing): the **Software Development Life Cycle (SDLC)** is a management concept — a standardized process by which ideas become software, yielding a more reliable product; models named: waterfall, spiral, Agile [OSG glossary]. Outline 8.1 asks you to *integrate security* into whichever model is used: security requirements, design review, code review, and testing are gates in every model, not a phase added at the end [ISC2 outline]
- Key facts:
  - OSG SDLC phases (security work in each): conceptual definition -> functional requirements -> **control specifications** -> design review -> coding -> code review walk-through -> system test review -> maintenance and change management [unverified — OSG body text; verify OSG ch. 20]
  - Cost of a defect rises the later it is found; security **requirements** are cheapest, post-release patching dearest — SSDF: "the earlier in the SDLC that security is addressed, the less effort and cost" (**shift left**) [NIST SP 800-218 §1]. Example: a missing authorization check costs one design-review comment in requirements; found after release it costs an emergency patch, incident response, and customer notification

  | Model | Discriminator | Security fit |
  | --- | --- | --- |
  | **Waterfall** | 7 sequential stages: system reqs, software reqs, preliminary design, detailed design, code and debug, testing, O&M [OSG glossary]; Royce 1970 (Proc. IEEE WESCON; his fig. 2 names the steps system reqs, software reqs, analysis, program design, coding, testing, operations) [Royce 1970 fig. 2] | Clear gates, poor at late change; modified waterfall allows return to the *previous* phase only — Royce: iteration "with the preceding and succeeding steps but rarely with the more remote steps" [Royce 1970 fig. 3] |
  | **Spiral** | Waterfall repeated in **iterations**; each pass fulfils every phase [OSG glossary]; Boehm 1988, **risk-driven**; "metamodel" is OSG wording — Boehm: spiral "can accommodate most previous models as special cases" [Boehm 1988, IEEE Computer 21(5)] | Risk analysis each loop; prototypes early |
  | **Agile** | Working product and customer needs over process, tools, documentation [OSG glossary]; Manifesto = 4 values + **12 principles** [OSG glossary for 12] | Security must be a backlog item / definition-of-done, else it is skipped |
  | **Scrum** | Agile derivative: teams of **<=10**, **sprints** 2 weeks–1 month, **15-minute** daily scrum, **scrum master** as facilitator [OSG glossary] | Security stories per sprint; scrum master is not the product owner |
  | **DevOps** | Development + QA + operations in one automated operational model [OSG glossary] | Speed; security bolted on unless... |
  | **DevSecOps** | DevOps + security; enables **software-defined security** — controls managed as code in the **CI/CD** pipeline [OSG glossary] | "Shift left": security tests automated in the pipeline |
  | **SAFe** (Scaled Agile Framework) | Agile at **enterprise scale**: coordinates hundreds/thousands of practitioners, aligns team work to strategy [OSG glossary] | Governance layer over many Agile teams |

  - Agile 4 values (individuals/interactions, working software, customer collaboration, responding to change — each "over" its counterpart; page links the 12 principles) [Agile Manifesto — agilemanifesto.org]
  - Sprint length: glossary gives both "2 weeks (or no longer than 1 month)" and "1–4 weeks" [OSG glossary] — either can appear on the exam
- Exam traps / distractors:
  - "MOST significant security challenge of DevSecOps" -> **enforcement of access controls**: collapsing dev/ops/sec roles + a super-privileged pipeline identity creates **toxic combinations of entitlements** (write + approve + deploy) -> **separation of duties** and **least privilege** under strain. Distractors (standardized configs, patching SLAs, regulatory knowledge sharing) are things DevSecOps *improves* (missed 2026-10-04). Example: the CI service account that can push to main, approve its own pull request, and deploy to prod — one stolen token = full supply-chain compromise
  - Pattern: "most significant challenge when adopting [modern practice]" resolves to a classic *principle* under strain (SoD, least privilege, accountability), not an operational detail
  - "Manager wants to BEST ensure a secure product" -> the option covering the **whole SDLC** (security analysis in every phase, planning through disposal; SSDF framing [NIST SP 800-218]). Single-phase options (secure coding = implementation only; perfect requirements = one phase + absolutist) and process-maturity options (CPI/CMMI = org capability, indirect) are distractors (missed 2026-10-04: picked due diligence of coding practices)
  - Pattern: lifecycle-wide beats phase-specific when the ask is "ensure a secure product"; "indefectible"/"perfect" = absolutist, always wrong
  - **Waterfall vs. spiral**: both are phase-driven; spiral = waterfall *iterated* with risk analysis each loop. "Prototype early, revisit requirements" -> spiral. Example: waterfall = requirements signed off in January, first running code in September; spiral = a throwaway prototype in month two, requirements re-cut after each loop's risk review
  - **Agile vs. Scrum**: Agile = philosophy/values; Scrum = a *framework* implementing it (sprints, roles). "Daily 15-minute meeting" -> Scrum, not "Agile" generically. Example: Agile = "ship a working slice every two weeks and re-plan with the customer"; Scrum = the 9-person team, 2-week sprint, 15-minute standup, and scrum master that implement it
  - **DevOps vs. DevSecOps**: DevOps merges dev + QA + ops; only DevSecOps adds security as a first-class participant. "Security testing automated in the pipeline" -> DevSecOps. Example: DevOps = merge triggers build, unit tests, deploy to staging; DevSecOps = the same pipeline also fails the build on a SAST finding or a leaked cloud key
  - **SAFe** is *not* a new methodology — it scales Agile across an enterprise; distractor pairs it with "a security framework". Example: 40 Scrum teams at a bank aligned to one quarterly release train and portfolio backlog — still Agile, just coordinated
  - "Add a security review after release" -> wrong in every model; the CISO answer is security in **requirements** and **design**
  - Agile's "working software over documentation" does *not* mean no documentation — exam distractor. Example: the threat model and API spec still get written; what is dropped is the 200-page design document nobody reads before coding
- Related terms: maturity models (next entry), change management (next entry), CI/CD (8.2), system life cycle (3.10), threat modeling (1.10)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-218], [Royce 1970], [Boehm 1988], [Agile Manifesto], [unverified]

## Maturity models, O&M, change management, IPT (8.1)
- Definition (ISC2 framing): maturity models rate how repeatable and measured the *process* is, not how secure one product is; change management prevents unintended outages by forcing request -> review -> approve -> test -> implement -> document [OSG glossary]; operation and maintenance (O&M) is the longest, most expensive SDLC phase and where most security incidents occur [unverified — OSG body text; not stated in NIST SP 800-64r2 §3.4 (audit 2026-09-28)]
- Key facts:
  - **CMM** (Capability Maturity Model, aka SW-CMM / S-CMM): describes an organization's progression toward sound engineering practice in software development [OSG glossary]; SEI (Software Engineering Institute, Carnegie Mellon) — Paulk et al., *Capability Maturity Model for Software v1.1*, Feb 1993 [SEI CMU/SEI-93-TR-024]

  | Level | SW-CMM — level names [SEI CMU/SEI-93-TR-024 §2.1]; glosses are OSG's (SEI level 2 = basic project management tracking cost/schedule/functionality; "reuse of code" not in SEI) [unverified — OSG body text] | CMMI [CMMI Institute] | Looks like |
  | --- | --- | --- | --- |
  | 0 | — | Incomplete: ad hoc, work may not complete | Project abandoned half-built |
  | 1 | **Initial**: ad hoc, chaotic | Initial: unpredictable, reactive | Hero developer; releases slip |
  | 2 | **Repeatable**: basic project management, reuse of code | **Managed**: planned/measured at *project* level | Per-project schedule, tracked builds |
  | 3 | **Defined**: documented org-wide standards | Defined: proactive, *organization-wide* standards | One org-wide SDLC checklist |
  | 4 | **Managed**: quantitative measures | **Quantitatively Managed**: data-driven objectives | Defect-escape rate tracked, targeted |
  | 5 | **Optimizing**: continuous improvement | Optimizing: stable, flexible, continuous improvement | Metrics change the process itself |

  - CMMI (CMM Integration) also has *capability* levels 0–3 (Incomplete, Initial, Managed, Defined) for individual practice areas — distinct from maturity levels [CMMI Institute]. Example: configuration management rated capability 3 while the organization overall sits at maturity 2
  - **SAMM** (Software Assurance Maturity Model): OWASP (Open Worldwide Application Security Project) open-source project; framework to integrate security into development *and* assess maturity [OSG glossary]; v2.0, **prescriptive**, **3 maturity levels** per practice, 5 business functions x 3 practices [OWASP SAMM]:

  | Business function | Security practices |
  | --- | --- |
  | **Governance** | Strategy & Metrics, Policy & Compliance, Education & Guidance |
  | **Design** | Threat Assessment, Security Requirements, Secure Architecture |
  | **Implementation** | Secure Build, Secure Deployment, Defect Management |
  | **Verification** | Architecture Assessment, Requirements-driven Testing, Security Testing |
  | **Operations** | Incident Management, Environment Management, Operational Management |

  - **IDEAL** model (SEI): process-improvement roadmap — **I**nitiating (sponsorship, responsibilities), **D**iagnosing (current vs. desired state), **E**stablishing (select/plan improvements), **A**cting (pilot, implement, institutionalize), **L**earning (improve the improvement process) [SEI]. Example: CISO sponsors "cut prod vulns" (I) -> gap assessment against SAMM (D) -> plan a SAST rollout (E) -> pilot on one team, then all (A) -> retrospective on what the rollout missed (L)
  - **Change management** components (OSG): **request control** (users request, cost/benefit, prioritize) -> **change control** (develop/test in a controlled environment, quality control, rollback plan) -> **release control** (approve for production, verify no debug code/backdoors, acceptance testing) [unverified — OSG body text; verify OSG ch. 20]. Example: ticket "add SSO to the portal" costed and prioritized = request control; built on a feature branch, tested in staging, rollback = redeploy previous image = change control; CAB approves, debug endpoints stripped, UAT sign-off = release control
  - **CAB** (change approval board) evaluates proposed changes before approving/denying [OSG glossary]; **change documentation** written *before* implementation [OSG glossary]; **version control** enables rollback to earlier code [OSG glossary]
  - **Configuration management** (CM / SCM, software configuration management): controls software versions across the organization; four components — **identification**, **control**, **status accounting**, **audit** [OSG glossary]. Example: identification = name each baseline (web-1.4.2, nginx.conf v7); control = only approved changes alter it; status accounting = record which build runs where; audit = compare live hosts against the recorded baseline. Glossary also defines CM as (1) logging/auditing of security-control changes to identify agents of change and (2) keeping systems in a secure consistent state [OSG glossary]
  - **Integrated Product Team** (IPT): multidisciplinary team (developers, security, operations, business, customers/stakeholders) collaborating across the whole life cycle (example: the payments-app squad with its dev lead, SOC analyst, SRE, product owner, and a merchant representative in every design review — vs. security "consulted" at release); U.S. DoD origin — May 1995 Secretary of Defense direction to apply IPPD (Integrated Product and Process Development) via IPTs across acquisition; DAU glossary: "multidisciplinary group of people who are collectively responsible for delivering a defined product or process" [DAU — *Rules of the Road* IPT guide; DoD Guide to IPPD v1.0, Feb 1996 — confirmed via DAU page snippets only; dau.edu blocks automated fetch (audit 2026-09-28)]
  - O&M security tasks: patching (evaluate, test, deploy, audit that patches stayed applied [OSG glossary]), monitoring, regression testing after changes [OSG glossary], eventual retirement/disposal
- Exam traps / distractors:
  - **CMM Level 2 = Repeatable; CMMI Level 2 = Managed** — a question saying "Managed" at level 2 is CMMI, at level 4 is SW-CMM
  - **Level 3 vs. 4**: 3 = *documented/standardized*; 4 = *measured quantitatively*. "Metrics collected and used" -> 4; "processes written down org-wide" -> 3
  - CMM assesses the **organization's process**, not a product's security — product assurance is Common Criteria (3.x)
  - **SAMM vs. CMM**: SAMM = security-specific, OWASP, prescriptive; CMM = general software process maturity, SEI. Example: SAMM scores Threat Assessment at 1 (ad hoc threat models) and Secure Build at 3 (every build signed and gated) per practice; CMM gives the whole organization one level
  - **IDEAL vs. CMM**: IDEAL = *how to improve*; CMM = *what level you are at*
  - **Change control vs. configuration management**: change control approves *a* change; CM tracks *all* versions/baselines over time. "Which version is in production?" -> CM status accounting. Example: "was CHG-4412 approved?" -> CAB record (change control); "which build is on the prod web tier right now?" -> status accounting
  - **Request control vs. release control**: rollback plan and testing = change control; strip debug code, final approval = release control
  - **IPT** is a *team structure*, not an SDLC model
- Related terms: change management processes (7.9), configuration management (7.3), patch management (7.8), Common Criteria (3.x), risk maturity (1.9)
- Sources: [ISC2 outline], [OSG glossary], [CMMI Institute], [OWASP SAMM], [SEI], [SEI CMU/SEI-93-TR-024], [DAU], [unverified]

## Software development ecosystem controls (8.2)
- Definition (ISC2 framing): every component a developer touches — language, libraries, tool sets, IDE (integrated development environment), runtime, CI/CD (continuous integration/continuous delivery) pipeline, SCM, code repository — is an attack surface and needs controls; testing tools (SAST/DAST/IAST/SCA) are the detective layer [ISC2 outline]
- Key facts:
  - **Programming language generations** [unverified — OSG body text]:

  | Gen | Type | Example |
  | --- | --- | --- |
  | **1GL** | Machine language — directly executable by CPU [OSG glossary] | Binary opcodes |
  | **2GL** | Assembly — mnemonics for CPU instruction set, hardware-specific [OSG glossary] | x86 asm |
  | **3GL** | High-level, compiled or interpreted | C, Java, Python |
  | **4GL** | Closer to natural language, domain-specific | SQL, report generators |
  | **5GL** | Natural-language / constraint / visual (AI-oriented) | Prolog-style, visual tools |

  - **Compiled** = converted to machine code before distribution/execution via a **compiler** (OS-specific executable) [OSG glossary]; **interpreted** = converted one command at a time at execution [OSG glossary]; **runtime code / JIT** (just-in-time) = human-readable until the moment of execution [OSG glossary]. Compiled: source hidden, faster, harder to inspect (needs **decompiler**/**disassembler** [OSG glossary]); interpreted: source exposed, easy to modify/tamper [unverified]. Example: compiled = a .exe you drop into Ghidra to read; interpreted = a Python script where `strings` shows the hard-coded password
  - **Runtime environment**: portable execution across OSs — sandboxes, VMs, containers [OSG glossary]; container security = host *and* inside the container [OSG glossary]
  - **Libraries / code reuse**: inclusion of preexisting code [OSG glossary]; one flawed shared library = many vulnerable products; inventory via **SBOM** (software bill of materials — components, versions, sources, relationships) [OSG glossary]. Example: Log4Shell — with an SBOM, "which products ship a vulnerable log4j-core?" is a query; without one it is weeks of grepping servers; **SDKs** provide APIs/subroutines for complex environments [OSG glossary]
  - **Tool sets / IDE**: trojanized compiler or IDE plugin compromises every build (example: a malicious IDE extension on one developer workstation = an implant in every artifact the pipeline then signs); controls = trusted sources, integrity/signature checks, hardened developer workstations, least privilege on build agents [NIST SP 800-218 PO.3.2 (deploy/operate toolchains per security practices), PO.5.2 (harden development endpoints)]
  - **CI/CD**: code may roll out dozens to hundreds of times per day; requires automation integrating repositories, SCM, and movement between dev/test/prod environments [OSG glossary]. Continuous *delivery* = release-ready with a manual gate; continuous *deployment* = automatic to production [NIST SP 800-204C §3.3.1, fig. 2]. Example: continuous delivery = every merge builds a release candidate, a human clicks Deploy; continuous deployment = the merge goes to prod with no click. Enablers: **IaC** (infrastructure as code — hardware managed like code under DevOps) [OSG glossary], **immutable architecture** (never patch in place; build, validate, swap, decommission old) [OSG glossary]. Example: IaC = the firewall rule is a Terraform file changed via pull request; immutable = a vulnerable image is not patched in place — a new one is baked, tested, and the old instances terminated
  - Pipeline controls: signed commits and artifacts (**code signing** = digital signature proving origin and integrity [OSG glossary]), separate **staging** segment for compliance checks before **production** [OSG glossary], no developer write access to prod (SoD), pipeline secrets in a **secrets management** system [OSG glossary]. Example: developers merge to main; only the pipeline's deploy identity can write to prod, and its token lives in the vault, not in the pipeline YAML
  - **Code repositories**: central storage/management point for collaborative source [OSG glossary]. Hygiene: least-privilege access to all forms of code, version control for accountability of changes [NIST SP 800-218 PS.1.1]; no hard-coded credentials/keys (secret scanning), branch protection with mandatory review, MFA, private by default, audit logs, protect against public exposure of internal repos [unverified — practice detail beyond PS.1.1]. Example: secret scanning blocks the commit containing an `AKIA…` key; branch protection means nobody, including the lead, pushes to main without a second reviewer
  - **Application security testing**:

  | Tool | How | Finds / limits |
  | --- | --- | --- |
  | **SAST** (static) | Analyzes source or compiled code *without running* it [OSG glossary] | Early in SDLC; false positives; needs code |
  | **DAST** (dynamic) | Tests running app in a runtime environment; often the *only* option for someone else's software [OSG glossary] | Runtime/config flaws; no code visibility |
  | **IAST** (interactive) | Sensor modules embedded in the running app while tests or users exercise it [OWASP DevSecOps Guideline — IAST] | Combines SAST+DAST insight; needs test traffic |
  | **SCA** (software composition analysis) | Inventories third-party/open-source components vs. known CVEs and licenses; software-only subset of *component analysis* [OWASP Component Analysis] | Dependency risk; not your own code |

  - **Fuzzing**: dynamic technique feeding invalid/random/crafted input, watching for crashes [OSG glossary]; **generational** (intelligent, model-based) [OSG glossary] vs. **mutation** (modify existing valid inputs) [unverified — OWASP Fuzzing page describes static-vector/random generators but does not use the mutation/generation labels (audit 2026-09-28)]. Example: mutation = flip bytes in a captured valid PDF; generational = build PDFs from the spec with deliberately malformed length fields
  - Other 8.2/6.2 tests: **code review** (manual, comb source for logic flaws) [OSG glossary]; **Fagan inspection** = formal code review for catastrophic-impact environments [OSG glossary], six steps planning-overview-preparation-inspection-rework-follow-up [unverified — Fagan 1976, IBM Systems Journal 15(3), paywalled; not reachable in audit 2026-09-28] (example: a scheduled inspection meeting with assigned roles and a defect log, rework re-checked at follow-up — vs. everyday async pull-request comments); **misuse/abuse case testing** models the attacker [OSG glossary] (example: test "user submits a negative quantity for a refund" beside "user buys an item"); **test coverage analysis** estimates degree of testing [OSG glossary]
  - Object-oriented programming (OOP) vocabulary [OSG glossary]:

  | Term | Gloss | Example |
  | --- | --- | --- |
  | **Object / class / instance** | Encapsulated code set / collection of common methods defining behavior / an object of a class | `User` class; `alice` instance |
  | **Message / method** | Input to an object / the operation invoked | `alice.resetPassword()` |
  | **Polymorphism** | Same message, different behavior by external conditions | `.render()` draws PDF or chart |
  | **Delegation** | Object forwards a message it cannot handle | Proxy passes unknown call onward |
  | **Cohesion** | How self-sufficient an object is — want **high** | `AuthService` does only auth |
  | **Coupling** | Interaction between objects — want **low** | Swap hasher; billing untouched |

- Exam traps / distractors:
  - **SAST vs. DAST**: "without executing" / "source code" -> SAST; "running application", "black-box", "vendor product with no source" -> DAST. Example: SAST = scanner reads the source and flags the string-concatenated SQL; DAST = scanner attacks the running app and gets a 500 with a stack trace; IAST = agent inside the app watches the tainted input reach the query
  - **IAST vs. DAST**: IAST needs an *agent inside* the app; DAST is external
  - **SCA vs. SAST**: SCA finds *known* vulns in *dependencies*; SAST finds flaws in *your* code. "Log4j-style library exposure" -> SCA/SBOM. Example: SCA flags `log4j-core` in the dependency manifest against its CVE; SAST would stare at your code and never see the library's flaw
  - **Compiled vs. interpreted**: compiled hides source (obfuscation is not protection) but is platform-bound; interpreted is portable but source-exposed. Neither is inherently "secure"
  - **Fuzzing is dynamic**, not static — distractor lists it under SAST
  - **Continuous delivery vs. continuous deployment**: delivery keeps a human release decision
  - **High cohesion / low coupling** is the good design; distractors flip them
  - **Code signing** proves origin + integrity, not absence of vulnerabilities. Example: a validly signed vendor driver with an exploitable bug still passes every signature check
- Related terms: code review and testing (6.2), interface testing (6.2), configuration management (7.3), containerization/microservices (3.5), secrets/credential management (5.2)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-218], [NIST SP 800-204C], [OWASP DevSecOps Guideline], [OWASP Component Analysis], [unverified]

## Assessing software security effectiveness (8.3)
- Definition (ISC2 framing): effectiveness is demonstrated by evidence — audit trails of *who changed what, when, with whose approval*, plus a risk analysis that shows residual risk is accepted by the owner; testing results are inputs, not the conclusion [ISC2 outline]
- Key facts:
  - **Auditing and logging of changes**: **auditing** = recording events to an audit log/trail to make subjects accountable [OSG glossary]; **audit trail** = records of user/system activity [OSG glossary]; **accountability** = holding someone responsible for actions [OSG glossary]. In software: version-control history, signed commits, CAB minutes, pipeline logs, deployment records; ties to CM **status accounting** and **configuration audit** [OSG glossary]
  - Logging *changes* answers "was this change authorized?" — unauthorized code in production = change-control failure regardless of whether it is malicious
  - **Risk analysis** = identify threats/vulns, likelihood and impact [OSG glossary]; **risk mitigation** = reducing risk via controls [OSG glossary]; **residual risk** = total risk minus what controls cover [OSG glossary]; software risk analysis starts with **threat modeling** at design [OSG glossary]
  - **Assurance** = degree of confidence security needs are met; must be continually maintained and reverified [OSG glossary]; **life cycle assurance** = trust judged from design, architecture, creation, testing, distribution [OSG glossary]; **assurance procedures** build trust into the life cycle [OSG glossary]
  - Test sequence and purpose [OSG glossary for each definition; ordering unverified]:

  | Test | Purpose | Who |
  | --- | --- | --- |
  | **Unit** | Each code unit independently | Developers |
  | **Interface** | Modules against interface specs | Dev/test |
  | **Regression** | New code behaves like old except intended changes | Test, after every change |
  | **Acceptance / UAT** | Meets stated functional (and security) criteria; end users can work with it | Users/customers |

  - **NIST SP 800-218** "Secure Software Development Framework (SSDF) v1.1" (Feb 2022): four practice groups — **PO** Prepare the Organization, **PS** Protect the Software, **PW** Produce Well-Secured Software, **RV** Respond to Vulnerabilities [NIST SP 800-218]; **SP 800-218A** extends SSDF to generative AI / dual-use foundation models [NIST SP 800-218A]
  - **Certification** (technical evaluation against requirements) vs. **accreditation/authorization** (management's formal acceptance of residual risk — **ATO**, authorization to operate) [OSG glossary for ATO; distinction: FIPS 200 App. A — certification = "comprehensive assessment of the ... security controls ... in support of security accreditation"; accreditation = "official management decision ... to authorize operation ... and to explicitly accept the risk" [FIPS 200 App. A]]
  - Security assessments = comprehensive reviews; audits = same but by *independent* auditors [OSG glossary] (example: the internal team's quarterly review vs. the external SOC 2 auditor's)
- Exam traps / distractors:
  - **Logging vs. auditing**: logging records; auditing *reviews* records for accountability. "Detect an unauthorized change" needs someone to review the log — logging alone is not a control outcome. Example: the pipeline records every deploy (logging); someone reconciles last month's deploys against CAB approvals and finds one with no ticket (auditing)
  - **Certification vs. accreditation**: technical test result vs. management sign-off. "Who accepts residual risk?" -> management (accreditation/ATO), never the tester. Example: the pen-test report and control assessment = certification; the CIO signing the ATO memo with two open mediums accepted = accreditation
  - **Regression vs. UAT**: regression checks *nothing broke*; UAT checks *users accept*. After a patch -> regression. Example: after the patch the automated suite confirms login and checkout still pass (regression); the finance team confirms the new report meets their need (UAT)
  - **Risk analysis vs. vulnerability scan**: scan finds vulns; analysis weighs likelihood x impact and drives mitigation choice. Example: scan = one CVE on 40 hosts; analysis = 38 are internal, 2 are internet-facing payment servers -> those two tonight, the rest in cycle
  - **Assurance != testing**: assurance is confidence across the whole life cycle; a clean pen test alone does not confer assurance. Example: Friday's clean pen test says nothing about Monday's unsigned hotfix — assurance is how code is built, reviewed, and shipped over time
  - SSDF **PS** (protect the software from tampering — repos, signing) vs. **PW** (produce secure code) — distractor swaps them. Example: PS = signed commits, protected branches, artifact integrity; PW = threat modeling, secure coding, SAST
- Related terms: log reviews (6.2), management review (6.3), remediation/exception handling (6.4), security audits (6.5), risk management (1.9)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-218], [NIST SP 800-218A], [FIPS 200], [unverified]

## Security impact of acquired software (8.4)
- Definition (ISC2 framing): you inherit the vendor's vulnerabilities but keep the accountability; assess before acquisition, contract for security, and monitor afterward — the same due care / due diligence logic as supply chain risk management (1.11) [ISC2 outline]
- Key facts:

  | Source | Definition | Key security questions / controls | Example |
  | --- | --- | --- | --- |
  | **COTS** (commercial off-the-shelf) | Not developed internally; purchased from vendors [OSG glossary] | Vendor patch cadence, CVE history, SBOM, Common Criteria evaluation, **licensing** terms [OSG glossary] | Vendor EDR agent, vendor's patch schedule |
  | **Open source** | Source exposed to the public [OSG glossary]; community-maintained, often embedded inside COTS [OSG glossary] | Who maintains it, unpatched transitive deps (SCA), **license** obligations (GPL vs. MIT) [OSG glossary] | OpenSSL inside the appliance |
  | **Third-party / custom** | Developed by an outside party for you | **Software escrow agreement** (source held by independent third party against developer failure/bankruptcy) [OSG glossary], code review rights, acceptance testing | Contractor-built claims portal |
  | **Managed services** | **MSP/MSSP** remotely operates on-prem or cloud IT [OSG glossary] | SLA, **right-to-audit clause** [OSG glossary], data handling, access by provider staff, exit terms | MSSP runs your SIEM |
  | **Cloud (SaaS/PaaS/IaaS)** | SaaS = on-demand app, no local install; PaaS = platform/stack, run your own code; IaaS = full infrastructure outsourcing [OSG glossary] | **Shared responsibility** split shifts by model; **cloud services license agreement** (click-through) [OSG glossary]; CASB, data sovereignty [OSG glossary] | M365 / App Service / EC2 |

  - **Closed-source** = logic hidden from public [OSG glossary]; hidden source is *not* assurance — you rely on vendor testing and DAST/SCA (DAST is often the only test option for others' software [OSG glossary]). Example: the appliance firmware is a blob — your evidence is its CVE history and your own DAST/pen-test results, not the vendor's "secure by design" brochure
  - **Reverse engineering** of purchased software to evaluate it is typically barred by license/EULA; OSG frames it as unethical when used to build competing products [OSG glossary]
  - Evidence to request: independent assessment reports (SOC 2, pen tests), SBOM, vulnerability disclosure process, secure development attestation (SSDF-based self-attestation for U.S. federal suppliers — agencies must obtain it before using the software; CISA's Secure Software Development Attestation Form, Mar 2024) [OMB M-22-18 §III; CISA attestation form]
  - **Shadow IT** = departments acquiring SaaS/tools without IT knowledge — unassessed acquired software [OSG glossary] (example: marketing's Trello board full of customer lists, discovered in CASB logs)
  - Risk in cloud models: SaaS -> you control only data/identity/config; PaaS -> plus your code and its dependencies; IaaS -> plus OS, middleware, runtime patching — SP 800-145: SaaS consumer controls only "limited user-specific application configuration settings"; PaaS consumer controls "the deployed applications"; IaaS consumer controls "operating systems, storage, and deployed applications" [NIST SP 800-145 §2]
- Exam traps / distractors:
  - **Open source is not automatically more (or less) secure** — "many eyes" is a claim, not a control; the assessable fact is maintenance activity and patch latency. Example: an npm package with millions of weekly downloads and one unpaid maintainer who last committed 18 months ago — the download count is not the control
  - **Escrow** protects against *vendor failure*, not against vulnerabilities — distractor offers it as a vuln control. Example: vendor goes bankrupt -> escrow agent releases the source so you can keep patching; vendor ships a SQLi -> escrow does nothing
  - **COTS vs. custom**: COTS you cannot fix yourself (depend on vendor patches); custom you can, but must own the SDLC. "Vendor slow to patch critical flaw" -> compensating controls (WAF, segmentation), not "rewrite"
  - **MSP vs. cloud provider**: MSP *manages* your systems (people + process); CSP *hosts* them. Both need SLA + right to audit; neither removes your accountability. Example: MSSP analysts tune your Splunk rules; AWS hosts the Splunk instance — a bad MSSP rule is not AWS's problem, and neither failure is your regulator's problem
  - **SaaS vs. PaaS** responsibility: application patching is *yours* only in PaaS/IaaS; in SaaS it is the provider's. Example: Salesforce patches Salesforce (SaaS); the vulnerable Spring dependency in your app on App Service is yours to patch (PaaS)
  - **License compliance** (copyleft obligations) is a legal/IP risk (1.4), separate from vulnerability risk — both are "security impact". Example: copying a GPL library into your proprietary agent obliges you to release your source — legal exposure with zero CVEs
- Related terms: SCRM (1.11), licensing/IP (1.4), vendor agreements (1.8), cloud systems (3.5), third-party security services (7.7), SBOM/SCA (8.2)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-145], [OMB M-22-18], [CISA attestation form]

<!-- REVIEW -->
## Source-code weaknesses and secure coding practices (8.5)
- Definition (ISC2 framing): weaknesses are *classes* of coding errors (CWE — Common Weakness Enumeration); vulnerabilities are their *instances* in products (CVE — Common Vulnerabilities and Exposures, a SCAP element assigning standard IDs [OSG glossary]); secure coding guidelines/standards (OWASP, SEI CERT) exist to prevent the classes, not to patch instances [ISC2 outline]
- Key facts:
  - **OWASP Top 10** (awareness document for web app security) [OWASP Top 10]:

  | # | 2021 | 2025 |
  | --- | --- | --- |
  | A01 | Broken Access Control | Broken Access Control |
  | A02 | Cryptographic Failures | Security Misconfiguration |
  | A03 | Injection | **Software Supply Chain Failures** |
  | A04 | Insecure Design | Cryptographic Failures |
  | A05 | Security Misconfiguration | Injection |

  | # | 2021 | 2025 |
  | --- | --- | --- |
  | A06 | Vulnerable and Outdated Components | Insecure Design |
  | A07 | Identification and Authentication Failures | Authentication Failures |
  | A08 | Software and Data Integrity Failures | Software or Data Integrity Failures |
  | A09 | Security Logging and Monitoring Failures | Security Logging and Alerting Failures |
  | A10 | Server Side Request Forgery (SSRF) | **Mishandling of Exceptional Conditions** |

  - **CWE Top 25 (2025)**, top 5: CWE-79 XSS, CWE-89 SQLi, CWE-352 CSRF, CWE-862 Missing Authorization, CWE-787 Out-of-bounds Write; then CWE-22 path traversal, CWE-416 use-after-free, CWE-125 OOB read, CWE-78 OS command injection, CWE-94 code injection [cwe.mitre.org]
  - ISC2 vocabulary for the weakness classes [OSG glossary unless noted]:

  | Weakness | ISC2 gloss | Primary control |
  | --- | --- | --- |
  | **Buffer overflow** | More data than buffer holds -> crash or shell; **integer overflow** = value exceeds allocated storage | Bounds checking; **DEP** (block exec in data memory), **ASLR** (randomize layout) |
  | **Injection** (SQL/LDAP/XML/HTML/DLL/command) | Attacker submits code to alter operations or poison data | **Input validation**, parameterized queries, stored procedures, least-privilege DB account |
  | **XSS** (reflected, stored/persistent, "DCOM"/DOM) | Script reflected or stored, served as legitimate content | Output encoding, **escaping** metacharacters |
  | **Race condition / TOCTOU** | Timing manipulated; permission checked too far ahead of use | Atomic check-and-use, locking |
  | **Directory traversal** | Escape web root into host filesystem | Canonicalize + validate paths |
  | **Parameter pollution** | Multiple values for one input to defeat validation | Reject duplicates, strict parsing |
  | **Session hijacking** | Take over an authorized session | Regenerate IDs, bind to context, TLS |

  - **Input validation** = checking, filtering, sanitizing input before processing (defensive programming vs. overflows, fuzzing) [OSG glossary]; **input sanitization** = length checks, known-bad scanning, escaping metacharacters [OSG glossary]; **escaping** = mark metacharacter as ordinary (e.g. backslash prefix) [OSG glossary]. Prefer **allow list** (deny by default) over **blocklist** (allow by default, deny by exception) [OSG glossary]
  - **Memory safety**: **memory leak** = program fails to release memory [OSG glossary]; **pointer dereference** flaws (null/dangling, use-after-free) [OSG glossary for pointer terms; UAF = CWE-416 [cwe.mitre.org]]; **bounds** = limits on memory a process may access [OSG glossary]; memory-safe languages remove whole CWE classes — "removing the memory safety class of vulnerability from a product by transitioning to an MSL" [CISA/NSA *The Case for Memory Safe Roadmaps*, Dec 2023, p. 9]. Example: rewriting the parser in Rust removes CWE-787/CWE-416 as a class; adding a bounds check in C fixes one instance
  - **Exception/error handling**: code anticipates errors to avoid termination and information leakage [OSG glossary]; fail securely (fail-closed) on error [OSG glossary]; **restrictive defaults** [OSG glossary]. Example: database connection fails -> login denied with a generic error, not an admin bypass with a stack trace
  - **Covert channels**: **storage** (write to shared area another process reads) vs. **timing** (modulate resource timing) [OSG glossary]
  - **Backdoor / maintenance hook**: developer-installed access bypassing security; must be removed before release (release control) [OSG glossary]
  - **Incremental attacks**: **salami** (gather small amounts into something valuable) and **data diddling** (small malicious data changes) [OSG glossary]
  - **Obfuscation** = code written to be hard to decipher — not a security control (security through obscurity) [OSG glossary] (example: minified JavaScript still gives up the API key after one pass through a beautifier)
  - Secure coding standards: OWASP Secure Coding Practices checklist (QRG v2.1 — project archived, checklists migrated into the OWASP Developer Guide) [OWASP SCP QRG], OWASP ASVS (Application Security Verification Standard; v5.0 — testing basis plus developer requirements list) [OWASP ASVS], SEI CERT language coding standards (C, C++, Java, Fortran) [SEI CERT Coding Standards], Microsoft SDL (Security Development Lifecycle — 10 practices, integrates security into DevOps) [Microsoft SDL]; organizational adoption = a **standard** in the policy hierarchy (1.6), enforced via SAST rules, code review checklists, and language/library allow lists. Example: policy says "code shall be free of injection flaws"; the standard says "SEI CERT C applies; SAST rule set X blocks the merge"
- Exam traps / distractors:
  - **XSS vs. CSRF** — classify by the evidence: unauthorized **action** performed with the victim's ambient session (logged in, credentials cached) -> **CSRF** (CWE-352); attacker **script executes** in the browser (cookie theft, DOM change) -> **XSS** (reflected/stored/DOM by where the payload lives). "Credentials stored locally" is the CSRF *precondition*, not an XSS fingerprint; a stem with no injection point is never XSS. Example: unauthorized bank withdrawal while Ava is logged in = CSRF; Ava's session cookie exfiltrated by a forum post = stored XSS (missed 2026-10-04: picked reflected XSS)
  - Defenses discriminate the same way: anti-CSRF tokens, `SameSite` cookies, re-auth for sensitive actions -> CSRF; output encoding, CSP, input validation -> XSS. Same-origin policy stops neither CSRF *send* nor XSS; three-variants-plus-one option sets -> inspect the odd one out
  - **CWE vs. CVE**: weakness *type* vs. specific *instance* in a product; **CVSS** scores severity of a CVE [OSG glossary]. "Category of flaw" -> CWE; "this product, this version" -> CVE. Example: CWE-89 = SQL injection as a class; CVE-YYYY-NNNNN = the SQLi in one vendor's file-transfer appliance, specific versions; CVSS 9.8 = how bad that one instance is
  - **OWASP Top 10 is awareness**, not a compliance standard or a complete test suite — ASVS/SAMM are the deeper artifacts. Example: a vendor claiming "OWASP Top 10 compliant" is marketing; ask which ASVS level they verify against
  - **Input validation vs. output encoding**: injection -> validate input; XSS -> encode output (both help, but the exam pairs them)
  - **Race condition vs. TOCTOU**: TOCTOU is the *specific* race between permission check and use; not every race condition is TOCTOU
  - **Covert storage vs. timing**: shared file/variable -> storage; CPU load/delay pattern -> timing. Example: storage = a process writes bits into a shared file's unused metadata field; timing = a VM modulates CPU load that a neighbor VM measures
  - **Salami vs. data diddling**: accumulate many tiny takes -> salami; small alterations of data -> diddling. Both = incremental attacks. Example: salami = skim the sub-cent rounding off every interest calculation into one account; diddling = change the bank account number on three vendor invoices before the payment run
  - **Buffer overflow vs. integer overflow**: writes past bounds vs. arithmetic wraps — integer overflow often *causes* a size miscalculation leading to overflow
  - **Backdoor vs. trapdoor/maintenance hook**: synonyms for the exam; vs. **logic bomb** (triggers on condition) and **Trojan** (masquerades)
  - "Insecure Design" (A04:2021/A06:2025) cannot be fixed by perfect implementation — design flaw vs. implementation bug is a favorite discriminator. Example: design = password reset uses a 4-digit SMS code with no attempt limit — flawless code, still broken; implementation = the limit exists but an off-by-one allows one extra try
- Related terms: OWASP SAMM (8.1), SAST/DAST (8.2), code review (6.2), secure design principles (3.1), memory protection (3.4), API security (next entry)
- Sources: [ISC2 outline], [OSG glossary], [OWASP Top 10], [cwe.mitre.org], [CISA/NSA], [OWASP SCP QRG], [OWASP ASVS], [SEI CERT Coding Standards], [Microsoft SDL]

## API security and software-defined security (8.5)
- Definition (ISC2 framing): an **API** (application programming interface) is an abstract interface to services/protocols, letting developers bypass web pages and call the service directly — opportunity for providers, risk for security [OSG glossary]; **software-defined security** = security controls actively managed by code and integrated directly into the CI/CD pipeline, a DevSecOps concept [OSG glossary]
- Key facts:
  - **API attacks** (ISC2 list): injection, XSS, CSRF, SSRF, buffer overflows, race conditions, replay, request forgeries [OSG glossary]
  - **REST** (Representational State Transfer): common web-service message protocol with an *optional* security layer; designed to replace **SOAP** (Simple Object Access Protocol), which ISC2 calls insecure because designed around plaintext HTTP [OSG glossary]. How it works: SOAP has WS-Security (XML signature/encryption) and both ride TLS; the exam wants "REST replaced SOAP; secure either with TLS + authN/authZ" [OASIS WS-Security 1.1 SOAP Message Security §3.2 — integrity via XML Signature, confidentiality via XML Encryption]
  - **OWASP API Security Top 10 (2023)** [OWASP API Top 10]:

  | # | Name | Gist |
  | --- | --- | --- |
  | API1 | **Broken Object Level Authorization** (BOLA) | Change the ID, get someone else's record |
  | API2 | Broken Authentication | Weak tokens, no rate limit on auth |
  | API3 | Broken Object *Property* Level Authorization | Over-exposed fields / mass assignment |
  | API4 | Unrestricted Resource Consumption | No rate/size limits -> DoS, cost |
  | API5 | Broken *Function* Level Authorization | User calls admin endpoints |

  | # | Name | Gist |
  | --- | --- | --- |
  | API6 | Unrestricted Access to Sensitive Business Flows | Automation abuse (scalping, spam) |
  | API7 | Server Side Request Forgery | API fetches attacker-chosen URL |
  | API8 | Security Misconfiguration | Verbose errors, permissive CORS |
  | API9 | Improper Inventory Management | Shadow/zombie API versions |
  | API10 | Unsafe Consumption of APIs | Trusting third-party API data |

  - Controls: authenticate every call (API keys identify the *app*; **OAuth** = access delegation, **OpenID Connect** = SSO over OAuth [OSG glossary]); authorize per object *and* per function; rate limiting/throttling; schema-based input validation; API gateway as PEP [NIST SP 800-204 §2.7.1]; API inventory (discover shadow APIs — "inventory all API hosts", protect all exposed versions) [OWASP API Top 10 API9:2023]; **secrets management** for API tokens [OSG glossary]; **WAF** as an application-level firewall in front [OSG glossary]
  - **Microservices** = small, independently deployable, loosely coupled services, each with its own data store, communicating over APIs — every internal hop is an API attack surface [OSG glossary] (example: an attacker already in the cluster calls `orders-svc` directly, skipping the gateway's auth)
  - **Software-defined security** in practice: IaC scanned before apply, policy as code (guardrails), security groups/WAF rules/identity policies versioned in the repo and deployed by the pipeline; the control's state is reproducible and auditable [OSG glossary for concept; practice unverified]
  - Companion "software-defined" terms: **SDN** (network control plane in software, 4.1), **SOAR** (Security Orchestration, Automation, Response — automated response playbooks) [OSG glossary]
- Exam traps / distractors:
  - **BOLA (API1) vs. BFLA (API5)**: wrong *record* -> object level; wrong *function/endpoint* -> function level. Both are "Broken Access Control" in web Top 10 terms. Example: BOLA = `GET /invoices/1042` returns another tenant's invoice; BFLA = `DELETE /admin/users/7` succeeds for an ordinary user
  - **API3 vs. API1**: property-level = right object, too many/wrong *fields* exposed or writable. Example: `GET /users/me` also returns `passwordHash`, or `PATCH /users/me` accepts `role=admin`
  - **REST is not "secure by default"** — glossary says its security layer is *optional*; TLS + authN/authZ must be added. Example: an internal REST endpoint shipped over plain HTTP with no auth because "only the frontend calls it"
  - **API key vs. OAuth token**: key identifies the calling application, not a user; OAuth delegates a user's access. "Third-party app acts on user's behalf" -> OAuth. Example: API key = the mobile app's `X-Api-Key` header identifying the app build; OAuth = the user clicking "Allow this scheduler to read my calendar"
  - **Software-defined security vs. SOAR vs. SDN**: controls *as code in the pipeline* vs. *automated incident response* vs. *programmable network*. Example: software-defined security = the WAF rule is a Terraform resource reviewed in a pull request; SOAR = a playbook isolates the host when EDR fires; SDN = the controller pushes a new VLAN path
  - **Software-defined security vs. DevSecOps**: DevSecOps is the culture/methodology; software-defined security is the technique it enables
  - **Rate limiting** addresses API4 (resource consumption) and API2 brute force — not authorization flaws. Example: 100 requests/minute stops credential stuffing and scraping cost, but a logged-in user still reaches another customer's record
- Related terms: microservices/APIs (3.5), interface testing (6.2), SDN (4.1), OAuth/OIDC/federation (5.2–5.3), PDP/PEP (5.4), SOAR (7.7)
- Sources: [ISC2 outline], [OSG glossary], [OWASP API Top 10], [OASIS WS-Security], [NIST SP 800-204], [unverified]

<!-- REVIEW -->
## Database security (OSG classic)
- Definition (ISC2 framing): a **database** = electronic filing system of files, records, fields; a **DBMS** (database management system) stores, modifies, extracts it [OSG glossary]. Exam focus: relational vocabulary, ACID, and the inference/aggregation problem with its countermeasures — outline places database system vulnerabilities in 3.5 but the OSG teaches them in the software chapters [ISC2 outline]
- Key facts:
  - Database models [OSG glossary]:

  | Model | Structure | Mapping |
  | --- | --- | --- |
  | **Hierarchical** | Logical tree; each field one parent, 0..n children | One-to-many |
  | **Distributed** | Data in several databases, logically one entity | Many-to-many |
  | **Relational** | Tables of related records | Rows x columns, keys |
  | **Object-relational** | Relational + object-oriented environment | — |
  | **NoSQL** | Nonrelational: **key/value**, **document** (XML/JSON), **graph** (nodes/edges) | Some support SQL expressions |

  - Relational vocabulary [OSG glossary]:

  | Term | Meaning |
  | --- | --- |
  | **Relation / tuple / attribute** | Table / row (record) / column |
  | **Cardinality / degree** | Number of **rows** / number of **columns** |
  | **Candidate key** | Any column set uniquely identifying records (aka alternate key) |
  | **Primary key** | The chosen candidate key; must be unique per record |
  | **Foreign key** | Another table's primary key, expressing a relationship |
  | **Referential integrity** | Foreign key must match an existing primary key |
  | **Semantic integrity** | No structural/semantic rule violated: valid domain ranges, logical values, uniqueness constraints |

  - Also: **schema** (structure defining the DB), **normalization** (remove redundancy; attributes depend on primary key), **view** (client interface limiting what is seen/done — e.g. analysts query `v_users_safe` without the salary column), **stored procedure** (callable subroutine in the RDBMS), **DDL / DML** (Data Definition / Manipulation Language), **data dictionary** (repository of data elements and relationships), **metadata** (data about data) [OSG glossary]
  - **ACID** [OSG glossary]:

  | Property | Requirement | Mechanism | Example |
  | --- | --- | --- | --- |
  | **Atomicity** | All-or-nothing; any failure -> full rollback | Transaction boundaries | Transfer: both legs or neither |
  | **Consistency** | Begin and end consistent with all DB rules | Constraints | Orphan foreign key rejected |
  | **Isolation** | Transactions do not see each other's intermediate state | Locks / **concurrency** control [OSG glossary] | Report never sees half-done transfer |
  | **Durability** | Once committed, preserved | Transaction logs, backups | Committed order survives power cut |

  - **Concurrency** = lock so an authorized user changes data, unlock after all changes complete — protects integrity and availability [OSG glossary] (example: two analysts edit the same ticket; the lock makes the second wait instead of silently overwriting)
  - Inference/aggregation problem [OSG glossary]:

  | Threat | Meaning | Countermeasure |
  | --- | --- | --- |
  | **Aggregation** | Combining records yields more sensitive info than parts | Restrict aggregate functions to cleared users |
  | **Inference** | Deduce higher-classified fact from nonsensitive pieces | **Polyinstantiation**, cell suppression, noise/perturbation |
  | **Contamination** | Mixing data of different classifications / need-to-know | **Database partitioning** (split by sensitivity) |

  - **Polyinstantiation** = two or more rows with the same primary key but different data for different classification levels — a cover story so low-cleared users cannot infer the real record [OSG glossary] (example: Secret row says "Yokosuka, munitions"; the Unclassified row with the same primary key says "Pearl Harbor, supplies" — the low user sees a plausible record, not a suspicious blank); **cell suppression** hides individual cells [OSG glossary]; **noise and perturbation** inserts false/altered data to defeat statistical inference [unverified — OSG body text] (example: suppression = the one-person department's salary cell shows "*"; noise = every salary ±3% so averages hold and individuals do not)
  - Access control flavors: **content-dependent** (by data value — via views) vs. **context-dependent** (by circumstances — time, prior queries, sequence) [unverified — OSG body text]. Example: content = a view hides rows where salary > 200k; context = the same user may query salaries only 09:00–17:00 from the HR subnet, and not after already pulling the headcount table
  - Analytics stack: **data warehouse** (large store from many DBs for analysis), **data mining** (find correlations in warehouse data), **data mart** (glossary: "storage facility used to secure metadata"), **big data**, **decision support system (DSS)** [OSG glossary]; KDD (knowledge discovery in databases) and OLAP/OLTP as terms [unverified]; warehouses concentrate value -> aggregation/inference risk and prime exfil target
  - Tooling: **database vulnerability scanner** (DB + web app) e.g. **sqlmap** (open-source) [OSG glossary]; **SQL injection** defeats auth or talks to the DB directly [OSG glossary]; **ODBC** (Open Database Connectivity) = proxy between app and DB — "proxy" is OSG wording [unverified — OSG body text]; Microsoft: ODBC is "a specification for a database API", DBMS-independent, with a **Driver Manager** mediating between applications and DBMS-specific drivers [Microsoft Learn — What Is ODBC?]
- Exam traps / distractors:
  - **Aggregation vs. inference**: aggregation = *you have access to all the pieces* and the sum is sensitive; inference = *deduce* what you cannot access. Partitioning/aggregate-function restrictions -> aggregation; polyinstantiation -> inference. Example: aggregation = ten individually Unclassified shipping records reveal a troop movement; inference = a user deduces a salary from a department average after one person leaves
  - **Cardinality vs. degree**: rows vs. columns — pure recall trap
  - **Candidate vs. primary key**: several candidates, one chosen primary (example: employee table — SSN, email, badge_id all qualify; badge_id is chosen)
  - **Referential vs. semantic integrity**: cross-table key match vs. in-table value rules. Example: referential = an order with `customer_id=999` when no customer 999 exists is rejected; semantic = `age=-4` is rejected
  - **Isolation vs. atomicity**: hide intermediate state vs. all-or-nothing rollback. Example: atomicity = the transfer debits A and credits B, or neither; isolation = a report running mid-transfer never sees A debited and B not yet credited
  - One authorized update degrades *other* apps/systems -> **isolation** failure (effects not confined to the transaction/process; D3 process-isolation sense too). Race condition and covert channel are *attack* options — no adversary in the stem means they lose to the missing property; covert channel is a **confidentiality** mechanism, the symptom here is **availability** (missed 2026-10-04)
  - Pattern: authorized actor + authorized action + unwanted side effect -> answer is a missing property/control, never an attack; "attack"/"covert"/"malicious" options are distractors until the stem supplies an attacker
  - **Polyinstantiation vs. polymorphism**: DB cover-story rows vs. OOP same-message-different-behavior
  - **Concurrency (locks)** protects integrity/availability, not confidentiality
  - **Normalization** is a data-design quality step, not a security control (though it reduces update anomalies)
- Related terms: database systems (3.5), Bell-LaPadula/multilevel security (3.2), need-to-know (7.4), data classification (2.1), injection (8.5)
- Sources: [OSG glossary], [ISC2 outline], [Microsoft Learn — ODBC], [unverified]

## Knowledge-based systems, AI, and machine learning (OSG classic)
- Definition (ISC2 framing): systems that apply codified or learned knowledge to decisions — **expert systems** (rules), **neural networks** (weighted decision chains), **machine learning** (solutions derived from large datasets), under the umbrella **artificial intelligence** [OSG glossary]. Exam relevance: discriminate the mechanisms, and know how ISC2 wants them applied to security tooling (7.7 ML/AI-based tools)
- Key facts:

  | System | Mechanism [OSG glossary] | Security use / weakness |
  | --- | --- | --- |
  | **Expert system** | **Knowledge base** (human expert rules as if/then) + **inference engine** (applies rules to reach a decision); consistent application of accumulated knowledge | Consistent, explainable; brittle — only as good as its rules; no learning |
  | **Fuzzy logic** | Approximates human reasoning; degrees of truth instead of binary set membership | Handles ambiguity in expert systems |
  | **Neural network** | Long chain of computational decisions feeding each other to produce output; aka **deep learning**, cognitive systems | Learns patterns; opaque ("black box"); needs training data |
  | **Machine learning (ML)** | Program a computer to derive solutions from large/complex datasets; "often confused with the science-fiction concept of AI" | Anomaly detection, UEBA; poisoning/evasion, false positives |
  | **AI** | Simulation of human intelligence: learning, reasoning, perception, decision-making | Umbrella term; see ML |
  | **Decision support system (DSS)** | Analyzes business data to ease decisions; *informational*, not operational; used by knowledge workers | Not autonomous |

  - Expert systems are only as good as their knowledge base — two failure modes: incomplete rules and outdated rules; they also cannot handle novel situations outside the rules [unverified — OSG body text]. Example: no rule for Kerberoasting -> never fires; the PsExec rule still keys on a since-renamed service name
  - Neural networks trained on outcomes can detect novel attack patterns [unverified] but cannot explain a verdict — matters for accountability and for analysts tuning detections; NIST names opacity ("limited explainability or interpretability") as an AI risk [NIST AI 100-1 (AI RMF 1.0) §3.5]. Example: the model scores a host "anomalous 0.92" but cannot say why -> the analyst can neither tune it nor justify the block
  - Security applications ISC2 lists: intrusion detection, fraud detection, behavioral analytics (7.2 UEBA, 7.7 ML/AI-based tools) [ISC2 outline]
  - Adversarial ML terms: **adversarial machine learning (AML)** appears in the glossary [OSG glossary]; data poisoning (corrupt training set) [NIST AI 100-2e2023 §2.3], evasion (craft input to misclassify) [NIST AI 100-2e2023 §2.2] (example: poisoning = the attacker's noisy "benign" traffic during the training month raises the baseline so later C2 looks normal; evasion = pad the sample so the classifier scores it benign), model inversion (extract training data) [unverified — NIST's taxonomy files training-data extraction under *privacy attacks*: membership inference, data reconstruction, model extraction (§2.4); "model inversion" is not a NIST term]
- Exam traps / distractors:
  - **Expert system vs. neural network**: explicit *rules* written by humans vs. *learned* weights from data. "Codified expertise, if/then" -> expert system; "trained on examples" -> neural network/ML. Example: expert system = a SIEM correlation rule, IF 10 failed logons THEN 1 success within 2 minutes -> alert; ML = UEBA baseline flags a user whose login hours and volume drift with no rule ever written
  - **Knowledge base vs. inference engine**: the *rules* vs. the *component that applies them*. Example: the Sigma rule set is the knowledge base; the engine evaluating each event against it is the inference engine
  - **Inference engine vs. inference attack**: same word, unrelated — one is an expert-system component, the other a database confidentiality attack
  - **ML vs. AI**: ML is a subset/technique; ISC2 labels AI the broader (and hyped) concept
  - **Fuzzy logic vs. fuzzing**: reasoning with degrees of truth vs. a dynamic testing technique. Example: fuzzy = "risk score 0.7, probably malicious" instead of match/no-match; fuzzing = malformed PDFs thrown at the parser until it crashes
  - **DSS** is informational support for humans, not an automated control. Example: the dashboard showing MTTR per analyst informs the SOC manager's staffing decision; it does not re-roster shifts
- Related terms: ML/AI-based tools (7.7), UEBA (7.2), IDS heuristic detection (7.7), inference attacks (database entry), SP 800-218A (8.3)
- Sources: [OSG glossary], [ISC2 outline], [NIST AI 100-2e2023], [NIST AI 100-1], [unverified]

## Malware and malicious code (OSG classic)
- Definition (ISC2 framing): **malware / malicious code** = any script or program performing unwanted, unauthorized, or unknown activity; any code meant to do harm [OSG glossary]. Exam tests the *discriminators between types* (propagation, trigger, disguise) and the detection approach, not exploitation mechanics
- Key facts:
  - Propagation and disguise classes [OSG glossary]:

  | Type | Discriminator |
  | --- | --- |
  | **Virus** | Attaches to legitimate files/programs; needs a host and user action to spread |
  | **Worm** | **Self-replicating** without a host; primary goal is to spread; DoS via resource/bandwidth consumption |
  | **Trojan** | Masquerades as benign, performs the "cover" function *plus* a hidden payload; tends **not to replicate** |
  | **Logic bomb** | Hidden code that fires when a **condition** is met (date, countdown, missing payroll name) |
  | **Rootkit** | Embeds deep in the OS to manipulate what the OS and users see |
  | **Backdoor / RAT** | Undocumented access left by developer / malware granting remote control |
  | **Bot / zombie / botnet** | Remote-control agent / compromised host / the collective under a **botmaster** (bot herder) |

  - Virus subtypes [OSG glossary]:

  | Subtype | Discriminator |
  | --- | --- |
  | **File infector** | Infects executables (.exe/.com), fires on execution |
  | **Companion** | Separate file with a near-identical name to a legitimate OS file |
  | **Boot sector** | Loads from MBR before the OS |
  | **Macro** | Lives in documents/emails, abuses productivity-app scripting |
  | **Multipartite** | More than one propagation technique |
  | **Polymorphic** | Mutates its own **code** each infection -> new signature |
  | **Encrypted / stealth** | Alters *storage* (not code) via a **virus decryption routine** / masks its activity |

  - Payload/monetization classes [OSG glossary]: **ransomware** (block use, demand payment) vs. **crypto malware** (mine cryptocurrency with your resources — "often confused with ransomware"); **spyware** (monitor, exfil) vs. **adware** (targeted pop-ups); **keylogger** classed as a **PUP** (potentially unwanted program — also sniffers, scanners, password crackers); **fileless malware** (memory only, never written to disk); **hoax** (social engineering about nonexistent malware that gets users to damage their own systems)
  - Defenses [OSG glossary]: **antimalware** = a host-based IDS example providing preventive *and* corrective control, watches memory, processes, storage; **heuristic detection** (behavior/anomaly) vs. signature; **sandboxing** (isolate suspicious code); **allow listing** (deny by default — beats malware not on the list) vs. **blocklisting**; **DEP/ASLR** memory defenses; **file integrity monitoring** (hash comparison)
  - Development-side link: **logic bombs**, **backdoors/maintenance hooks**, and trojanized dependencies are *insider/supply-chain* malware that change control (release control) and code review are meant to catch — this is why ISC2 puts malware in Domain 8
- Exam traps / distractors:
  - **Virus vs. worm**: needs host file/user action vs. self-propagating over the network. "Spread with no user interaction" -> worm
  - **Trojan vs. virus**: disguise vs. replication; a Trojan may *carry* a virus
  - **Logic bomb vs. Trojan vs. backdoor**: condition-triggered / disguised / hidden access. "Disgruntled admin, fires after termination" -> logic bomb. Example: logic bomb = script that wipes the share when `jsmith` is absent from the payroll table; Trojan = `invoice.pdf.exe` that opens a PDF and drops a beacon; backdoor = `/debug?token=letmein` the developer left in
  - **Polymorphic vs. encrypted virus**: code changes vs. storage/encryption changes; both defeat static signatures. Example: polymorphic = the loader's code is regenerated with each infection; encrypted = the same loader, body re-encrypted under a new key
  - **Ransomware vs. crypto malware**: extortion vs. cryptojacking
  - **Spyware vs. adware vs. PUP**: exfil / ads / "questionable but not clearly malicious" (a port scanner is a PUP)
  - **Rootkit** hides *other* malware by lying to the OS — not itself the initial access
  - **Antimalware is a HIDS example** with preventive + corrective functions — distractor calls it detective only. Example: blocks the write of the dropper (preventive), quarantines the one that slipped through (corrective)
  - **Heuristic vs. signature**: unknown/zero-day -> heuristic/behavioral; known sample -> signature
- Related terms: anti-malware, sandboxing, allow/deny listing (7.7), ransomware as cryptanalytic-attack-adjacent (3.7), backdoor/maintenance hook (8.5), insider threat (7.15)
- Sources: [OSG glossary]
