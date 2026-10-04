# Domain 3: Security Architecture and Engineering

## Zero trust
- Definition (ISC2 framing): outline 3.1 design principle "zero trust or **trust but verify**" [ISC2 outline]; zero trust = nothing trusted by default — **deny by default, grant by explicit exception** [OSG glossary]; trust but verify = the *traditional* model, internal entities trusted automatically -> insider risk + easy **lateral movement** [OSG glossary]. Example: a contractor on the VPN can RDP to any server on the flat LAN = trust but verify; the same contractor gets a ZTNA session token to one app, re-checked on every new session = zero trust
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
  - Products/techniques (microsegmentation, SASE, MFA, ZTNA) = **enablers**, not the principle. Example: rolling out ZTNA for remote users while the internal LAN stays "allow any inside" = bought an enabler, not zero trust
  - Zero trust != no trust: trust evaluated **per session**, dynamically (tenet 3). Example: conditional access re-prompts MFA when device compliance drops mid-day; NOT a VPN logon that stays good all shift regardless
  - **PDP vs. PEP**: decides vs. enforces; "terminates the connection" -> PEP; "evaluates posture against policy" -> PE
  - Network **location** as trust signal -> wrong (tenet 2). Example: "allow if source is 10.0.0.0/8" as the only check
- Related terms: least privilege (3.1), PDP/PEP (5.4), microsegmentation (4.1), SASE (3.1), ABAC/risk-based access control (5.4)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-207]

## Secure design principles (3.1)
- Definition (ISC2 framing): design-time properties, not operational controls; outline 3.1 lists threat modeling, least privilege, defense in depth, secure defaults, fail securely, SoD, keep it simple, zero trust/trust but verify, privacy by design, shared responsibility, SASE [ISC2 outline]. Lineage: Saltzer & Schroeder 1975 (economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism, psychological acceptability; plus **work factor** and **compromise recording**, which they say apply "only imperfectly") [Saltzer-Schroeder 1975 Sec. I.A.3]
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

  - Examples: least privilege = the service account gets log-on-as-a-service only; need-to-know = a Secret-cleared analyst still cannot open another project's Secret share; SoD = the analyst who writes a detection rule cannot promote it to production
  - Example (KISS): 40 reviewed firewall rules you can audit; NOT 4,000 accumulated "temporary any/any" rules nobody dares remove

  - Newer additions:

  | Principle | ISC2 framing | Note |
  | --- | --- | --- |
  | **Privacy by design** (PbD) | Privacy built in at design phase = security by design [OSG glossary] | Cavoukian **7 foundational principles**: proactive not reactive; privacy as the default; embedded into design; full functionality (positive-sum); end-to-end lifecycle protection; visibility and transparency; respect for user privacy [IPC Ontario, Cavoukian 2009] |
  | **Shared responsibility** | Orgs intertwined with the world; take your role seriously [OSG glossary] | Broader than the cloud model (cloud split -> 3.5) |
  | **SASE** (Secure Access Service Edge) | Converges network security functions with WAN capability for cloud/mobile access [OSG glossary] | Gartner term: converged network + security as a service — SD-WAN + SWG/CASB/ZTNA/NGFW (FWaaS) [Gartner glossary] |
  | **Threat modeling** | Design-time threat identification | See Domain 1.10 entry |

  - Example (PbD): the SIEM pipeline pseudonymizes user IDs at ingest by default; NOT a DLP rule bolted on after the complaint
  - Example (shared responsibility, 3.1 sense): patching your internet-facing NTP/DNS so it is not a reflector against others; vs. 3.5's "CSP patches the hypervisor, you patch the guest OS"
  - Example (SASE): the remote laptop's web traffic hits the cloud SWG/ZTNA point of presence instead of back-hauling over VPN to HQ's firewall

  - Companion design concepts [OSG glossary]: **abstraction** = group similar elements into classes/roles for collective control assignment; **data hiding** = data placed where subject cannot see *or* access it (not merely unseen). Example: abstraction = grant rights to the "Tier2-Analysts" group, not 40 users; data hiding = ring-0 kernel memory a ring-3 process can neither read nor address; NOT an unlinked admin URL (that is obscurity)
- Exam traps / distractors:
  - **Fail-safe vs. fail-secure**: life-safety flips the default — fire door opens (safe); firewall crash drops traffic (secure)
  - One person creates vendors AND approves payments -> **SoD** violation, not least privilege (per-task rights may be minimal; the combination is the flaw)
  - Second firewall, same vendor -> defense in depth but not **diversity of defense**; "one vuln beats all layers" -> diversity
  - Hidden admin URL as sole protection -> **security through obscurity** (invalid); secure defaults = auth on by default
  - "Provider secures the cloud, you secure what's in it" -> the 3.5 **cloud** shared responsibility model, not 3.1's societal framing
- Related terms: zero trust (previous entry), threat modeling (D1), need-to-know (7.4), cloud shared responsibility (3.5), microsegmentation (4.1)
- Sources: [ISC2 outline], [OSG glossary], [Saltzer-Schroeder 1975], [IPC Ontario], [Gartner glossary]

## Security models (3.2)
- Definition (ISC2 framing): a **security model** maps abstract policy statements into the algorithms and data structures needed to build hardware/software — the yardstick a design is measured against [OSG glossary]. Outline 3.2 names Biba, Star Model, Bell-LaPadula [ISC2 outline]. Models state *what* the policy permits; access control types (MAC/DAC, 5.4) are the enforcement mechanism.
- Key facts:
  - Foundations [OSG glossary]:

  | Foundation | Gist | Example |
  | --- | --- | --- |
  | **State machine** | Every transition lands in a secure state | Reload keeps old ruleset until validated |
  | **Information flow** | Governs flow between levels/objects; built on state machine | DLP stops Secret mail to Internet |
  | **Noninterference** | One subject's actions must not affect another's view/state | Tenant A's load invisible to B |
  | **Lattice** | Levels + compartments with bounds; basis of MAC | Secret/{NATO} dominates Confidential/{} |
  | **Take-Grant** | Directed graph of take/grant/create/remove rights [unverified — Lipton & Snyder 1977 JACM, paywalled] | Owner grants read; grantee takes it |

  - Named models (state machine + lattice + MAC unless noted). Read rules are "simple", write rules are "star":

  | Model | Protects | Rules |
  | --- | --- | --- |
  | **Bell-LaPadula** (BLP) | Confidentiality [OSG glossary] | Simple Security Property: **no read up**; * (star) Security Property: **no write down** [OSG glossary]; Discretionary Security Property: access matrix for DAC [OSG glossary]; strong * = read/write at own level only [unverified — not in Bell & LaPadula 1976 MTR-2997 unified exposition; later derivative term] |
  | **Biba** | Integrity [OSG glossary] | Simple Integrity Axiom: **no read down**; * (star) Integrity Axiom: **no write up** [OSG glossary]; invocation property: no invoking a higher-integrity subject [unverified — Biba 1977 MTR-3153 (DTIC ADA039324) is a scanned image, text not checkable] |
  | **Clark-Wilson** | Integrity via limited interfaces/programs [OSG glossary] | Access triple **subject/program/object**; well-formed transactions; SoD; terms below |
  | **Brewer and Nash** | Conflict of interest; access changes **dynamically** with prior activity [OSG glossary] | Aka Chinese Wall (deprecated), ethical wall, cone of silence |
  | **Goguen-Meseguer** | Integrity; predetermined domain of objects per subject [OSG glossary] | Root of noninterference |
  | **Sutherland** | Integrity; prevents interference [OSG glossary] | Information-flow based |
  | **Graham-Denning** / **HRU** | Secure creation/deletion of subjects+objects; assignment and resilience of rights [OSG glossary] | HRU (Harrison-Ruzzo-Ullman) extends G-D; G-D has 8 primitive rules [unverified — Graham & Denning 1972 AFIPS, paywalled] |

  - Examples: **BLP** no write down = a Top Secret analyst cannot paste into a Secret report; no read up = a Secret analyst cannot open the TS share
  - Examples: **Biba** no write up = an untrusted web form cannot update the production pricing table; no read down = the patch server will not pull from an unsigned mirror
  - Examples: **Clark-Wilson** = payroll changes only through the HR app's "adjust salary" transaction (TP), never by direct `UPDATE` on the table (CDI); **Brewer-Nash** = the consultant who opened Bank A's folder is locked out of Bank B's for the engagement
  - Examples: **Goguen-Meseguer**/noninterference = a low user's job runs identically whether or not a TS job is running, so nothing leaks via contention; **Graham-Denning / HRU** = who may create an AD account and delegate rights on it — the admin-ops layer BLP/Biba do not cover

  - Clark-Wilson vocabulary [OSG glossary]:

  | Term | Meaning | Example |
  | --- | --- | --- |
  | **CDI** (constrained data item) | Data whose integrity the model protects | General-ledger table |
  | **UDI** (unconstrained data item) | Unvalidated input or any output; outside the model | Uploaded CSV before validation |
  | **TP** (transformation procedure) | The *only* procedures allowed to modify a CDI | ERP "post journal entry" function |
  | **IVP** (integrity verification procedure) | Scans CDIs, confirms integrity | Nightly ledger reconciliation job |

  - Enforcement concepts [OSG glossary]: **TCB** (trusted computing base) = hardware + software + controls that enforce policy; **security perimeter** = imaginary boundary between TCB and the rest; **reference monitor** = the *concept* that validates every access request against policy; **security kernel** = the OS core that *implements* it; **trusted path** = TCB's secure channel to the rest of the system. Example: TCB = kernel + LSASS + the code honoring NTFS DACLs; reference monitor = the rule that every file open is checked against the DACL; security kernel = the Windows Security Reference Monitor doing it; trusted path = the Ctrl+Alt+Del secure attention sequence; NOT a lookalike logon page.
  - Evaluation: **Common Criteria** (CC) = ISO/IEC 15408, methodology in ISO/IEC 18045 [OSG glossary] [ISO/IEC 15408]. **PP** (protection profile) = customer's "I want"; **ST** (security target) = vendor's "I will provide"; **TOE** (target of evaluation) = the product; **EAL** (evaluation assurance level) = how much reliability testing the TOE got, not how secure it is [OSG glossary]. Example: PP = the agency's "a firewall must do X, Y, Z" document; ST = the vendor's "our NGFW does X, Y, Z this way"; an EAL4 firewall on old firmware was examined harder than an EAL2 one on current firmware — not patched better. EAL1 functionally tested -> EAL2 structurally tested -> EAL3 methodically tested and checked -> EAL4 methodically designed, tested, reviewed -> EAL5 semiformally designed/tested -> EAL6 semiformally verified design -> EAL7 formally verified design and tested [ISO/IEC 15408]. Predecessors: **TCSEC** "Orange Book" DoD 5200.28-STD (Dec 1985) — divisions **D** minimal, **C** discretionary (C1, C2), **B** mandatory (B1, B2, B3), **A** verified (A1) [TCSEC DoD 5200.28-STD Sec. 1–4]; **ITSEC** v1.2 (June 1991), assurance levels E0–E6 separate from functionality classes [ITSEC v1.2].
  - U.S. **security modes** for classified processing [OSG glossary]:

  | Mode | All users cleared for all data | Need-to-know for all data | Example |
  | --- | --- | --- | --- |
  | **Dedicated** | Yes | Yes | Air-gapped box, one project team |
  | **System high** | Yes | No — clearance + formal approval for all, need-to-know for *some* [CNSSI 4009-2022 via NIST CSRC glossary] | TS enclave; shares by project NTK |
  | **Compartmented** | Yes | No; formal approval per compartment | SCI network; briefing per compartment |
  | **Multilevel** | No | No; system enforces labels (multistate) | Labeled MLS OS, mixed-clearance users |

- Exam traps / distractors:
  - **Biba** is BLP inverted: no read *down*, no write *up*. "Star" = write rule in both; "simple" = read rule in both. A stem describing "prevents low-integrity data from contaminating" -> Biba, not BLP.
  - **Clark-Wilson vs. Biba**: both integrity; CW = commercial, programs/TPs mediate access, enforces SoD; Biba = labels/lattice, no notion of well-formed transactions.
  - **Brewer-Nash** is the only one whose permissions depend on **history** (what the user already touched) — consultancy/auditor scenarios.
  - **Reference monitor** (abstract requirement: always invoked, tamperproof, verifiable) vs. **security kernel** (the implementation).
  - **PP vs. ST**: requirement statement vs. vendor claim; **EAL4** does not mean "more secure than EAL3 product", only more rigorously evaluated.
  - **Security model vs. access control model**: BLP/Biba are models; MAC/DAC/RBAC (5.4) are mechanisms. BLP *uses* MAC. Example: SELinux MLS policy is the mechanism; the no-write-down rule it enforces is the model.
  - **Compartmented vs. system high**: both require full clearance; compartmented adds formal access approval per compartment.
- Related terms: MAC / lattice-based access control (5.4), TCB and reference monitor (3.4), secure design principles (3.1), Common Criteria and control selection (3.3), data classification (2.1)
- Sources: [ISC2 outline], [OSG glossary], [ISO/IEC 15408], [TCSEC DoD 5200.28-STD], [ITSEC v1.2], [CNSSI 4009-2022], [unverified]

## Control selection (3.3)
- Definition (ISC2 framing): choose controls from the system's **security requirements** — categorize impact, pick a baseline, tailor it, document, assess — rather than from vendor features or a generic checklist [ISC2 outline]. Requirements come from stakeholders, regulation, and classification (D1, D2); this entry is the architecture-side handoff.
- Key facts:
  - NIST chain (federal, but the exam's reference model):

  1. **Categorize** — FIPS 199 (Feb 2004): SC = {(confidentiality, impact), (integrity, impact), (availability, impact)}, impact = low / moderate / high; system category = **high water mark** across the three objectives [FIPS 199]
  2. **Select baseline** — FIPS 200 (Mar 2006) sets minimum requirements and a risk-based selection process [FIPS 200]; SP 800-53B (Sept 2020, 5.2.0 Aug 2025) supplies low / moderate / high baselines plus a **privacy baseline** applied regardless of impact [NIST SP 800-53B]
  3. **Tailor** — modify the baseline to the mission [OSG glossary]: scoping (remove inapplicable controls), compensating controls, parameter values, supplements; SP 800-53B gives tailoring guidance and working assumptions [NIST SP 800-53B]
  4. **Document** in the system security plan; **implement**, **assess**, **authorize**, **monitor** — RMF steps of SP 800-37 Rev 2 (Dec 2018): Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor [NIST SP 800-37]

  - Product-level selection input: Common Criteria EAL tells you evaluation depth of a TOE against its ST; **PP** tells you whether the product class meets *your* requirement statement [OSG glossary] [ISO/IEC 15408]. FIPS 140-3 level tells you cryptographic-module assurance (3.4).
  - Selection criteria a CISO weighs: cost vs. expected loss reduction (ALE, D1), control type coverage (preventive / detective / corrective, D1), regulatory mandate, operational impact, compatibility with architecture (TCB, network placement), residual risk acceptable to the **authorizing official** (ATO, 3.10).
  - Security requirements split: **functional** (what the system must do — authenticate, log, encrypt) vs. **assurance** (confidence it does it correctly — CC Part 2 vs. Part 3 mirror this) [ISO/IEC 15408]. Example: functional = "the firewall must log denied connections"; assurance = the test evidence that it still logs them under load.
- Exam traps / distractors:
  - Baseline is set by the **high water mark**, not the average of C/I/A impacts and not by the single most sensitive record alone (that drives categorization of the *information type*, which then rolls up). Example: C = low, I = moderate, A = high -> system is **high**, not moderate.
  - **Tailoring vs. scoping**: scoping is one step *inside* tailoring (dropping controls that don't apply); tailoring also adds compensating controls and sets parameters. Stem says "removing controls for components that don't exist" -> scoping. Example: dropping AC-18 (wireless access) because the data center has no Wi-Fi = scoping; setting "lock after 15 min" on AC-11 (device lock) = parameter tailoring; adding jump-host session logging because the legacy app cannot do MFA = compensating control [NIST SP 800-53B].
  - Selecting controls is RMF **Select** (step 3), after Categorize; "assess" comes after implement. Sequence questions trade on this.
  - **FIPS 199** (categorize) vs. **FIPS 200** (minimum requirements) vs. **SP 800-53** (control catalog) vs. **SP 800-53B** (baselines).
  - EAL / CC certification of a product does not make the *deployment* compliant — configuration and operating environment are outside the TOE. Example: a CC-evaluated firewall running an `any any allow` rule — the TOE passed, your deployment did not.
  - Requirement-driven selection beats "best practice" or "industry standard" options when the stem gives a specific requirement. Example: stem says "retain logs 7 years" -> the control that meets 7 years, not the "industry-standard 1-year SIEM retention".
- Related terms: scoping and tailoring (2.6), risk treatment and control types (1.9), security models and CC (3.2), FIPS 140-3 (3.4), ATO and system lifecycle (3.10)
- Sources: [ISC2 outline], [OSG glossary], [FIPS 199], [FIPS 200], [NIST SP 800-53B], [NIST SP 800-37], [ISO/IEC 15408]

## Security capabilities of information systems (3.4)
- Definition (ISC2 framing): protections the hardware/firmware/OS layer provides by construction — outline names **memory protection**, **Trusted Platform Module** (TPM), **encryption/decryption** [ISC2 outline]; OSG adds process isolation, protection rings, secure/measured boot, TCB and reference monitor (3.2) [OSG glossary].
- Key facts:
  - Isolation and memory [OSG glossary]:

  | Capability | What it does | Adjacent term | Example |
  | --- | --- | --- | --- |
  | **Memory protection** | OS blocks a process touching memory not allocated to it | vs. process isolation (scope: memory vs. whole process) | Access violation kills the process |
  | **Process isolation** | Each process gets its own memory space for data + code | **Hardware segmentation** = same, enforced in hardware | Reading LSASS needs an opened handle |
  | **Protection rings** | Concentric privilege levels; 4 levels numbered 0–3, higher number = less privilege; ring 0 OS kernel, ring 3 applications [Intel SDM Vol. 3A Sec. 6.5, Fig. 6-3] | **Mediated-access model** = higher ring asks lower ring via system call | Driver in ring 0, browser ring 3 |
  | **Virtual memory / paging** | Swap file extends RAM; page-in from disk | Pagefile holds sensitive data at rest — encrypt / clear | pagefile.sys holds swapped-out creds |
  | **DEP** (data execution prevention) | Marks memory non-executable; blunts buffer overflows | Buffer overflow = classic "fail open" exploit | Stack shellcode faults instead of running |
  | **Trusted recovery** | System returns to a secure state after failure/reboot | Fail-secure principle (3.1) | Reboot to last-known-good config |

  - Hardware roots of trust:

  | Component | Role | Standard |
  | --- | --- | --- |
  | **TPM** | Mainboard cryptoprocessor; stores/processes keys for hardware-backed disk encryption; platform integrity measurements [OSG glossary] | ISO/IEC 11889 (TPM library, 2015) [ISO/IEC 11889] |
  | **HSM** (hardware security module) | Manages/stores keys, accelerates crypto, faster signatures, stronger auth [OSG glossary]; CA and payment key custody | Validated under **FIPS 140-3** (Mar 2019): 4 security levels, aligned to ISO/IEC 19790:2012 [FIPS 140-3]; L1 production-grade components, no physical mechanisms -> L2 **tamper-evidence** + role-based auth -> L3 tamper detection/response on covers/doors + identity-based auth -> L4 complete tamper-detecting **envelope** + environmental (voltage/temperature) protection [FIPS 140-2 Sec. 1]; FIPS 140-3 keeps the four levels but delegates their content to ISO/IEC 19790:2012 [FIPS 140-3 Sec. 3] |
  | **Root of trust** / **trust anchor** | Inherently trusted starting point of a chain; tamper-resistant; system trust derives from it [OSG glossary] | SP 800-193 (May 2018): firmware **protection, detection, recovery** [NIST SP 800-193] |
  | **Secure boot** | UEFI refuses unsigned drivers/OS; blocks bootkits/rootkits [OSG glossary] | Enforcement |
  | **Measured boot** | UEFI hashes every boot element; **attestation** = verifying the record as true [OSG glossary] | Detection / evidence, not blocking |

  - Examples: root of trust = the UEFI platform key / the CA cert pre-loaded in the browser's root store — you cannot verify it, only trust it; secure boot = UEFI refuses the unsigned bootkit; measured boot = PCR hashes in the TPM, and the attestation service flags the laptop whose PCRs changed — it does not block it
  - Example (FIPS 140 levels): L2 = tamper-evident seal on a smartcard; L3 = HSM that zeroizes keys when its cover is opened

  - Encryption/decryption as a *system capability*: full-disk encryption keyed by TPM; **homomorphic encryption** = compute on ciphertext, protects data **in use** [OSG glossary]; **lightweight cryptography** for constrained devices (IoT, ICS, smartcards) [OSG glossary]; memory/bus encryption [unverified]; **trusted execution environment** (TEE) = processor-protected enclave where secrets are stored and operated on without leaving it, verifiable by remote attestation [NIST IR 8320 Sec. 5, 6.2]. Example: TEE = SGX enclave / TrustZone holding the fingerprint template, unreadable even to the OS kernel; homomorphic = the cloud scores encrypted transactions for fraud without ever decrypting them.
  - Covert channels [OSG glossary]: **storage** channel = write to shared storage another process reads; **timing** channel = modulate performance/timing predictably. Both leak outside intended paths; the TCB should prevent them. Example: storage = process A fills the disk quota to signal a 1 and process B reads "disk full"; timing = A loads the CPU in a pattern that B times.
  - Emanations [OSG glossary]: **TEMPEST** = study/control of compromising EM/RF signals; countermeasures **Faraday cage**, **white noise**, **control zone** (cage + noise for one area). Example: Faraday cage = the shielded SCIF; white noise = a jammer on the leakage band; control zone = only the server cage shielded, not the whole building.
  - Legacy exploit classes tied to these capabilities [OSG glossary]: **maintenance hook / backdoor** (developer bypass); **TOCTOU / race condition** (timing between check and use); **incremental attacks** — data diddling (small changes), salami (small skims); Meltdown/Spectre = CPU speculative-execution side channels (Meltdown = CVE-2017-5754, NVD published 2018-01-04) [NVD CVE-2017-5754]. Example: maintenance hook = hardcoded vendor support account in a firewall image; TOCTOU = symlink swapped between the permission check and the open; salami = rounding fractions of a cent per transaction into one account; data diddling = altering a few invoice amounts before posting.
- Exam traps / distractors:
  - **TPM vs. HSM**: TPM = soldered, platform-bound, platform integrity + disk keys; HSM = dedicated appliance/card for enterprise key ops (CA signing, PKI). "Protect the CA's private key" -> HSM. "Bind disk encryption to this laptop" -> TPM.
  - **Secure boot vs. measured boot**: blocks vs. records. "Detect firmware tampering and report to a server" -> measured boot + attestation.
  - **Covert storage vs. timing**: file/lock/disk-space = storage; CPU load/response latency = timing.
  - **Memory protection vs. process isolation vs. hardware segmentation**: OS enforcement of allocated memory vs. per-process spaces vs. hardware-enforced. Example: OS kills a process on an access violation (protection) vs. separate address spaces so mimikatz must open a handle to LSASS (isolation) vs. an SGX enclave the CPU itself refuses to let the kernel read (hardware segmentation).
  - **Reference monitor** is a concept; the **security kernel** implements it; the **TCB** is everything trusted to enforce policy (3.2).
  - **Attestation** = verify true/accurate; not authentication. Example: a TPM quote proving the laptop booted with the expected PCRs = attestation; the user proving identity at that logon = authentication.
  - FIPS 140-3 validates a **module**, not the product around it, and says nothing about algorithm choice beyond "approved". Example: the validated OpenSSL FIPS provider plus your app calling it in ECB mode with a hardcoded key — module validated, product not.
- Related terms: TCB / reference monitor / security kernel (3.2), cryptographic solutions and FIPS 140-3 (3.6), side-channel attacks (3.7), embedded/IoT vulnerabilities (3.5), silicon root of trust in SCRM (1.11)
- Sources: [ISC2 outline], [OSG glossary], [ISO/IEC 11889], [FIPS 140-3], [FIPS 140-2], [NIST SP 800-193], [NIST IR 8320], [Intel SDM], [NVD], [unverified]

<!-- REVIEW -->
## Vulnerabilities of security architectures and solution elements (3.5)
- Definition (ISC2 framing): assess and mitigate the *inherent* weaknesses of each system type listed in outline 3.5 [ISC2 outline] — the exam wants the weakness that is characteristic of the architecture, and the managerial mitigation (segmentation, contracts, configuration baselines), not a CVE.
- Key facts:
  - Compute and application architectures:

  | System | Characteristic vulnerability | ISC2-framed mitigation | Example |
  | --- | --- | --- | --- |
  | **Client-based** | Mobile code (applets, JavaScript) runs with local rights; local cache/creds [OSG glossary] | Patch, sandboxing, no local sensitive storage, thin clients / VDI [OSG glossary] | Macro runs with the user's token |
  | **Server-based** | Data flow control: single point aggregating data and load; DoS [unverified — OSG framing, no primary source found] | Redundancy, flow control, least functionality | One web tier, one SYN flood |
  | **Database** | **Aggregation** (combine records -> more sensitive whole) and **inference** (deduce higher-level facts from lower-level data) [OSG glossary]; contamination when levels commingle | **Polyinstantiation** (same key, different rows per level), **cell suppression**, partitioning, noise/perturbation; **ACID**, **concurrency** locks, **semantic integrity** [OSG glossary] | Payroll rows sum to department budget |
  | **Cryptographic systems** | Weak/short keys, bad IVs, key mismanagement, implementation flaws (3.6, 3.7) | Approved algorithms, key life cycle (SP 800-57), FIPS 140-3 modules | Hardcoded AES key in the APK |
  | **Distributed** (DCE) | Many members perceived as one entity; trust and coordination between members; heterogeneous patch state [OSG glossary] | Mutual authentication, encrypted inter-node traffic, central logging | Unpatched member node pivots cluster-wide |
  | **Microservices / APIs** | Many small independently deployable services; each API is an attack surface — injection, broken auth [OSG glossary] | API gateway, per-service authN/authZ, rate limiting, schema validation | Internal API trusts gateway header blindly |
  | **Serverless / FaaS** | Customer owns code and IAM; CSP owns platform; there is still a server [OSG glossary] | Least-privilege function roles, dependency hygiene, event-source validation | Lambda role with `*:*` policy |

  - Infrastructure architectures:

  | System | Characteristic vulnerability | ISC2-framed mitigation | Example |
  | --- | --- | --- | --- |
  | **Virtualized** | Hypervisor (VMM) is the new TCB; **VM escape**; **VM sprawl** = VMs without management plan [OSG glossary] [NIST SP 800-125] | Patch/harden hypervisor, restrict admin access, isolate guests, image inventory [NIST SP 800-125]; Type I bare-metal vs. Type II hosted [OSG glossary] | Guest escapes hypervisor, reads neighbors |
  | **Containerization** | No hypervisor; containers **share the host kernel** -> escape reaches host and neighbors [NIST SP 800-190]; risk areas: image, registry, orchestrator, container runtime, host OS [NIST SP 800-190] | Trusted images, signed registries, orchestrator RBAC, minimal host OS | Pod kernel exploit owns the host |
  | **Cloud** (SaaS / PaaS / IaaS) | **Shared responsibility** split shifts by model; multitenancy; data sovereignty (laws of storage location) [OSG glossary] | Contract/SLA, CASB, encryption with customer-held keys, CSA CCM [OSG glossary] | Public S3 bucket is customer's fault |
  | **Embedded / static** | Limited-function computer inside a product; microcontroller or **SoC**; hard to patch; firmware OTA risk [OSG glossary] | Network isolation, manual updates, application firewalls, wrapper controls | Printer firmware never patched, flat VLAN |
  | **IoT** | Internet-connected devices affecting the physical world; weak defaults, no update path [OSG glossary] | Segment onto own network; manufacturer baseline — NIST IR 8259 (May 2020), SP 800-213 (Nov 2021) for federal acquisition [NIST IR 8259] [NIST SP 800-213] | Default-cred camera joins Mirai botnet |
  | **ICS / OT** (SCADA, DCS, PLC) | Prioritize **safety, availability, integrity over confidentiality**; patching constrained by continuous operation; real-time; legacy gear [NIST SP 800-82] | SP 800-82 Rev 3 (Sept 2023) Guide to OT Security; segmentation/DMZ between IT and OT, unidirectional gateways [NIST SP 800-82] | PLC reboot for patch halts plant |
  | **HPC** | Supercomputers / MPP; massive parallel data; availability and research-data integrity dominate [OSG glossary] | Zone segmentation — **access**, **management** (schedulers, workflow), **HPC compute**, **data storage** zones — SP 800-223 (Feb 2024) [NIST SP 800-223 Sec. 2.1]; isolation of scheduler and interconnect; job-level access control [unverified] | Scheduler node holds every user's jobs |

  - **Edge** vs. **fog** [OSG glossary]: edge = intelligence *in each device* at the network edge; fog = collects from sensors/edge devices and processes at a **LAN**-positioned node before central. Both widen the physical attack surface. Example: edge = the camera runs the face-match model onboard; fog = the plant-floor gateway aggregating 200 sensors before cloud upload.
  - Cloud model definitions — SP 800-145 (Sept 2011) [NIST SP 800-145]:

  | Dimension | Items |
  | --- | --- |
  | 5 essential characteristics | On-demand self-service, broad network access, resource pooling, rapid elasticity, measured service |
  | 3 service models | SaaS (use provider app), PaaS (deploy your app on provider platform), IaaS (you control OS/storage/network) |
  | 4 deployment models | Private, community, public, hybrid |

  - Cloud shared responsibility [OSG glossary]: customer always owns data, identities, and configuration; provider always owns physical/hypervisor. IaaS -> customer also owns OS + middleware + runtime; PaaS -> provider owns OS/runtime, customer owns app + data; SaaS -> customer owns only data/access configuration — SP 800-145 service-model text: IaaS consumer controls OS, storage, deployed apps (maybe host firewalls); PaaS consumer controls deployed apps + hosting-environment config only; SaaS consumer has at most "limited user-specific application configuration settings" [NIST SP 800-145 Sec. 2].
  - Private cloud can be **third-party hosted** and still be private (single tenant); public = multitenant [OSG glossary].
- Exam traps / distractors:
  - SP 800-145 five characteristics by *the question each answers* [NIST SP 800-145]: **who provisions** -> on-demand self-service (consumer, unilaterally, no human at provider); from where -> broad network access; how shared -> resource pooling; **how much it flexes with demand** -> rapid elasticity; how billed -> measured service. "Ability to supply/provision capabilities" -> **self-service**; "scale with peaks/demand" -> **elasticity**. Shared adjectives ("automatically", "rapidly", "dynamically") appear in several NIST definitions and are not discriminators (missed 2026-10-04: picked elasticity for consumer self-provisioning)
  - Utility analogy + examples: self-service = flip the switch yourself (`terraform apply`, no ticket); broad access = any outlet (laptop, phone, function over HTTPS); pooling = one grid serves the city (shared host, unidentifiable disks); elasticity = AC kicks on and more current flows (4 -> 40 -> 4 servers); measured = the meter (itemized vCPU-hours/egress). **Provision** (obtain) -> self-service; **scale** (grow/shrink what runs) -> elasticity. Security pairings: self-service -> shadow IT/sprawl; pooling -> tenant isolation, remanence; elasticity -> economic DoS; measured -> billing as audit/detection source [unverified]
  - **Aggregation vs. inference**: aggregation = combining many *authorized* pieces yields something more sensitive; inference = *deducing* protected facts from unprotected ones. Polyinstantiation is the inference defense [OSG glossary]. Example: aggregation = exporting every Unclassified ship schedule reveals the fleet pattern; inference = `AVG(salary)` on a one-person department reveals that salary; polyinstantiation = the Secret row says cargo "supplies", the TS row says "missiles", same key.
  - **Containers vs. VMs**: containers share the kernel — a kernel exploit is a shared fate; VMs share the hypervisor. "Strongest isolation" -> separate VMs (or hosts), not containers.
  - **Type I vs. Type II hypervisor**: bare-metal vs. hosted on a general OS; Type II inherits the host OS attack surface. Example: Type I = ESXi/Hyper-V on bare metal; Type II = VirtualBox on an analyst's laptop — own the laptop, own every guest.
  - **Serverless** still runs on servers; the *customer* keeps responsibility for code, secrets, and permissions.
  - **OT priority order** is safety/availability first; "apply the patch immediately" is usually the wrong OT answer — compensating controls + scheduled window. Example: Log4j on the HMI -> isolate the OT VLAN and add an IDS signature now, patch at the next scheduled outage.
  - **IoT mitigation** = network segmentation and vendor-lifecycle assessment, not endpoint agents. Example: badge readers and smart TVs on their own VLAN with egress ACLs — there is no EDR agent for them.
  - **Edge vs. fog**: device vs. LAN node.
  - **SaaS vs. PaaS vs. IaaS** responsibility: the stem's clue is who controls the OS. Example: unpatched OS on an EC2 instance = yours (IaaS); OS under Azure App Service = Microsoft's (PaaS); in M365 you own only mailbox rules and MFA config (SaaS).
  - Cloud **community** deployment (shared interest group) is the forgotten fourth model. Example: a cloud serving only state agencies, or only banks under the same regulator.
- Related terms: shared responsibility principle (3.1), cloud in D8 acquired software (8.4), data sovereignty / location (2.4), microsegmentation and zero trust (3.1, 4.1), physical security of edge devices (3.9)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-145], [NIST SP 800-125], [NIST SP 800-190], [NIST SP 800-82], [NIST IR 8259], [NIST SP 800-213], [NIST SP 800-223], [unverified]

## Cryptographic solutions (3.6)
- Definition (ISC2 framing): select and manage cryptography across its **life cycle** (keys, algorithm selection), across **methods** (symmetric, asymmetric, elliptic curve, quantum), and through **PKI** including quantum key distribution [ISC2 outline]. Exam angle: which primitive delivers which service, and who manages the keys.
- Key facts:
  - Services: confidentiality (encryption), integrity (hash/MAC), authentication (MAC or signature), **nonrepudiation** (digital signature only) [OSG glossary]. **Kerckhoffs' principle**: algorithm public, key secret [OSG glossary]. Example: AES is public and your key is not; a vendor's "proprietary secret cipher" pitch violates it. **Confusion** hides key/ciphertext relation; **diffusion** spreads plaintext changes across ciphertext; **avalanche** = small input change, large output change [OSG glossary]. **Key space** = 2^key-length values [OSG glossary].
  - Symmetric vs. asymmetric:

  | Attribute | Symmetric | Asymmetric |
  | --- | --- | --- |
  | Keys | One shared secret; n(n-1)/2 for n parties (4 entities -> 6 keys; 1,000 -> 499,500) [NIST SP 800-175B Rev 1 Sec. 3.2] | Key pair; 2n for n parties |
  | Speed / use | Fast; bulk data | Slow; key exchange, signatures |
  | Distribution | Out-of-band or via asymmetric (**digital envelope**) [OSG glossary] | Public key freely distributed via certificates |
  | Services | Confidentiality, integrity (MAC) | + authentication, **nonrepudiation** |

  - Symmetric algorithms [OSG glossary] [FIPS 197] [NIST SP 800-131A]:

  | Algorithm | Block / key | Status |
  | --- | --- | --- |
  | **DES** | 64-bit block, 56-bit key (1977) | Superseded by AES Dec 2001 [OSG glossary] |
  | **3DES / TDEA** | 64-bit block; 2-key or 3-key | 2-key encryption disallowed; 3-key deprecated through 2023, **disallowed after 2023**; decryption legacy-use only [NIST SP 800-131A] |
  | **AES** (Rijndael) | 128-bit block; 128/192/256-bit keys | FIPS 197 (Nov 26 2001, updated May 9 2023) [FIPS 197]; 10/12/14 rounds (Nr) for 128/192/256-bit keys [FIPS 197 Sec. 5 Table 3] |
  | **Blowfish** / **Twofish** | 64-bit block, 32–448-bit key / 128-bit block | Schneier; Twofish AES finalist [OSG glossary] |
  | **IDEA** | 64-bit block, 128-bit key | Used in PGP [OSG glossary] |
  | **RC4** | Stream cipher | WEP/WPA; obsolete [OSG glossary] |

  - Modes — SP 800-38A (Dec 2001): **ECB**, **CBC**, **CFB**, **OFB**, **CTR** [NIST SP 800-38A]; **GCM** = authenticated encryption with associated data (AEAD), GMAC = MAC only — SP 800-38D (Nov 2007) [NIST SP 800-38D]. ECB = no IV, identical blocks -> identical ciphertext, weakest [OSG glossary]; CBC chains with IV; CTR uses counter, parallelizable, no chaining [OSG glossary]; OFB errors don't propagate [OSG glossary].
  - Asymmetric [OSG glossary] [FIPS 186-5]:

  | Algorithm | Hard problem / basis | Note |
  | --- | --- | --- |
  | **RSA** | Integer factoring | Encryption + signatures; most widely used |
  | **Diffie-Hellman** | Discrete logarithm | **Key agreement only**, never encrypts; DHE/ECDHE ephemeral = forward secrecy |
  | **ElGamal** | DH extension | Full cryptosystem; **doubles** ciphertext length |
  | **ECC** | Elliptic curve discrete log | Same strength with **shorter keys**; ECDHE, ECDSA |
  | **DSA / DSS** | FIPS 186 | FIPS 186-5 (Feb 2023): DSA **no longer approved for generating** signatures, verify-legacy only; RSA, ECDSA, **EdDSA** approved [FIPS 186-5] |

  - Comparable strengths — SP 800-57 Part 1 Rev 5 (May 2020) Table 2 [NIST SP 800-57]:

  | Strength (bits) | Symmetric | RSA modulus | ECC key |
  | --- | --- | --- | --- |
  | 80 | 2TDEA | 1024 | 160–223 |
  | 112 | 3TDEA | 2048 | 224–255 |
  | 128 | AES-128 | 3072 | 256–383 |
  | 192 | AES-192 | 7680 | 384–511 |

  - Time frames: < 112 bits disallowed for applying protection; 112 bits legacy-use after 2030 [NIST SP 800-57]; minimum security strength 112 bits [NIST SP 800-131A]; RSA 1024 disallowed for signature generation [NIST SP 800-131A]. TLS 1.3 (RFC 8446, Aug 2018) removed static RSA/DH suites — all key exchange now forward-secret [RFC 8446].
  - Hashing and integrity [OSG glossary]: hash = one-way, fixed-length digest, no key; **MD5** 128-bit, replaced [OSG glossary]; **SHA-2** family FIPS 180-4 (Aug 2015) [FIPS 180-4]; **SHA-3** FIPS 202 (Aug 2015), Keccak, SHA3-224/256/384/512 + SHAKE128/256 [FIPS 202]; **RIPEMD-160** alternative to SHA-1 [OSG glossary]. **HMAC** = keyed hash, integrity + authentication, "partial signature", **no nonrepudiation** [OSG glossary]. **Digital signature** = hash encrypted/signed with sender's **private** key [OSG glossary]. Passwords: **salt** (unique random per hash), **pepper** (secret), **key stretching** — PBKDF2, bcrypt, Argon2 [OSG glossary]. **Birthday/collision** resistance depends on digest length (3.7).
  - Key management life cycle — SP 800-57 Pt 1 [NIST SP 800-57]: key states **pre-activation -> active -> suspended -> deactivated -> compromised -> destroyed**; phases **pre-operational, operational, post-operational, destroyed**. **Cryptoperiod** = time span a key is authorized for use; limits exposure to cryptanalysis and damage from compromise [NIST SP 800-57]. Example: suspended = key paused during a leak investigation, may be reinstated; deactivated = cryptoperiod over, still decrypts old archives; compromised = exposed -> revoke and re-encrypt. Practices [OSG glossary]: **key escrow** (copies held centrally; agency = law-enforcement access), **key recovery** (extract from backup/escrow), **M of N control** (minimum M of N agents for escrow retrieval), **split knowledge**, **key destruction**/zeroization, **key suspension**; Fair Cryptosystems = failed U.S. segmented-key backdoor [OSG glossary]. Example: escrow = BitLocker recovery keys stored in AD; recovery = helpdesk pulling that key for a locked-out user; M of N = the root CA's HSM needs 3 of 5 card holders to activate; split knowledge = two custodians each enter half the HSM master key. Random source: DRBG per SP 800-90A Rev 1 (June 2015) [NIST SP 800-90A]. Modules validated to FIPS 140-3 (3.4). **Crypto agility** = ability to swap algorithms without redesign; NIST: capabilities to replace and adapt algorithms across protocols, software, hardware, firmware, infrastructure while preserving security and operations — CSWP 39 (Dec 19 2025) [NIST CSWP 39]. Example: swapping RSA for ML-KEM is a cipher-suite config change; NOT a `SHA1withRSA` string hardcoded in every app.
  - PKI = framework (not a product) combining asymmetric + symmetric + hashing + certificates [OSG glossary]:

  | Component | Role | Example |
  | --- | --- | --- |
  | **CA** (certificate authority) | Authenticates and **issues** certificates; root CA self-signs, kept **offline** [OSG glossary] | AD CS issuing CA signs certs |
  | **RA** (registration authority) | Offloads identity validation/registration; **never issues** [OSG glossary] | Helpdesk verifies employee before enrollment |
  | **Intermediate/subordinate CA** | Below root, above leaf; chain = root -> intermediate -> leaf -> end entity [OSG glossary] | Root -> "Issuing CA 01" -> server cert |
  | **CRL** | List of revoked serial numbers; periodic, can be stale [OSG glossary] | Weekly CRL file fetched over HTTP |
  | **OCSP** (RFC 6960, June 2013) | Real-time status: **good / revoked / unknown** [RFC 6960]; **stapling** = server presents CA-signed timestamped response [OSG glossary] | Browser queries responder per certificate |
  | **CSR** | Request to CA, PKCS#10 format [OSG glossary] | `openssl req -new -key ...` |
  | **CP / CPS** | Certificate policy = rules of use; certificate practice statement = how the CA operates [OSG glossary] | CP = eligibility rules; CPS = CA runbook |

  - X.509 v3 certificate profile — RFC 5280 (May 2008): version, serial number, signature algorithm, issuer, validity (notBefore/notAfter), subject, subjectPublicKeyInfo, extensions; Section 6 path validation [RFC 5280]. Trust models: hierarchical, bridge, mesh, peer-to-peer/web of trust [OSG glossary]. Example: hierarchical = corporate AD CS chain; bridge = one hub CA cross-certifies two merged companies' PKIs; mesh = several CAs cross-certify each other directly; web of trust = PGP key signing. Certificate types: DV, OV, EV [OSG glossary]. Formats: PKCS#12 / PFX container [OSG glossary]. **Certificate pinning** deprecated [OSG glossary].
  - Quantum:

  | Term | What it is | Status |
  | --- | --- | --- |
  | **Quantum cryptography** | Uses wave/particle nature of light; no current real-world use per OSG [OSG glossary] | Research |
  | **QKD** (quantum key distribution) | Physics-based distribution of a shared **symmetric** key — same goal as DH [OSG glossary] | Point-to-point hardware; not an algorithm |
  | **Post-quantum cryptography** (PQC) | Classical math believed hard even for quantum computers [OSG glossary] | FIPS 203 **ML-KEM** (key encapsulation), FIPS 204 **ML-DSA**, FIPS 205 **SLH-DSA** (SPHINCS+) — all Aug 13 2024 [FIPS 203] [FIPS 204] [FIPS 205]; stateful hash-based LMS/XMSS in SP 800-208 (Oct 2020) [NIST SP 800-208] |
  | **Quantum supremacy** | Quantum computer solves what classical cannot [OSG glossary] | Shor's algorithm (1994) breaks RSA/ECDSA/ECDH ("no longer secure"); Grover's quadratic speedup -> symmetric "larger key sizes needed", doubling key size compensates -> AES-256 [NIST IR 8105 (Apr 2016) Table 1] |

  - Other solutions [OSG glossary]: **homomorphic encryption** (compute on ciphertext, data in use); **link encryption** (whole circuit, hop by hop) vs. end-to-end (headers exposed, payload protected); **hybrid cryptography** = asymmetric to move a symmetric session key; **ephemeral key** = one session; **cryptographic erasure** = destroy the key to sanitize (3.10). Example: link = MACsec/IPsec between two routers, decrypted at every hop; end-to-end = S/MIME — mail servers see headers, never the body; hybrid = TLS moves the AES session key under ECDHE, then AES-GCM carries the bytes.
- Exam traps / distractors:
  - **Diffie-Hellman** does key agreement, not encryption or signatures. "Establish a shared secret over an untrusted channel" -> DH/ECDH; "sign" -> RSA/ECDSA/EdDSA.
  - **Nonrepudiation** requires an asymmetric signature; HMAC and symmetric MACs give integrity + authentication only, because both parties hold the key. Example: an HMAC-signed webhook — the vendor can claim you forged it since you hold the same key; an ECDSA-signed commit, you cannot.
  - Direction: **sign with your private**, **verify with signer's public**; **encrypt with recipient's public**, decrypt with recipient's private.
  - **Hashing is not encryption**: no key, not reversible; "encrypt the password" is the distractor for "salt and hash".
  - **ECB** offered as an acceptable mode; GCM/CTR/CBC are the modern picks; GCM is the one that also authenticates.
  - **QKD vs. PQC**: QKD distributes keys via physics; PQC is math (ML-KEM/ML-DSA). "Deploy quantum-safe TLS today" -> PQC, not QKD. Example: QKD = dedicated fibre between two bank data centers; PQC = ML-KEM negotiated as a TLS key-exchange group in software.
  - **RA vs. CA**: RA verifies identity; only the CA signs/issues. **CRL vs. OCSP**: batch/stale vs. real-time; stapling fixes OCSP privacy/latency.
  - **Root CA offline** is deliberate; day-to-day issuance is by intermediates.
  - **Key escrow vs. key recovery vs. M of N**: storage arrangement vs. the act of retrieval vs. the control on who can retrieve.
  - **Cryptoperiod** (key) is not certificate validity (credential); a key can outlive or precede its cert. Example: renewing a cert for another year from a CSR built on the old key pair restarts the certificate's validity, not the key's cryptoperiod.
  - **3DES and DSA** are exam-current traps: 3DES encryption disallowed after 2023; DSA no longer approved for new signatures — but both still "work", which is why they distract.
  - ECC "shorter key" does not mean weaker; strength equivalence is the table above.
- Related terms: TPM/HSM/FIPS 140-3 (3.4), cryptanalytic attacks (3.7), data states (2.6), TLS/IPsec (4.1), Kerberos and certificate-based authentication (5.2), cryptographic erase in disposal (3.10)
- Sources: [ISC2 outline], [OSG glossary], [FIPS 197], [FIPS 186-5], [FIPS 180-4], [FIPS 202], [FIPS 203], [FIPS 204], [FIPS 205], [NIST SP 800-38A], [NIST SP 800-38D], [NIST SP 800-57], [NIST SP 800-131A], [NIST SP 800-90A], [NIST SP 800-208], [NIST SP 800-175B], [NIST IR 8105], [NIST CSWP 39], [RFC 5280], [RFC 6960], [RFC 8446]

## Cryptanalytic attacks (3.7)
- Definition (ISC2 framing): outline 3.7 lists brute force, ciphertext-only, known plaintext, frequency analysis, chosen ciphertext, implementation attacks, side-channel, fault injection, timing, MITM, pass the hash, Kerberos exploitation, ransomware [ISC2 outline]. Exam groups them by **what the attacker has** (classical), **what the attacker exploits** (implementation), and **what the attacker does with credentials** (operational).
- Key facts:
  - Classical — classified by attacker's material [OSG glossary]:

  | Attack | Attacker has | Note | Example |
  | --- | --- | --- | --- |
  | **Brute force** | Nothing but ciphertext/keyspace | Try every key; defeated by key length; "work factor" | `hashcat -a 3` mask on NTLM |
  | **Ciphertext-only** | Ciphertext only | Weakest position; frequency analysis is its classic tool | Encrypted C2 blob, nothing else |
  | **Known plaintext** | Plaintext + matching ciphertext | Exploits key reuse/predictable keys | ZIP cracked via one known file |
  | **Chosen plaintext** | Can encrypt plaintexts of choice | Analyze resulting ciphertext; adaptive variant | Encrypt chosen input, compare cookies |
  | **Chosen ciphertext** | Can **decrypt** chosen ciphertext portions | Padding-oracle style | Tamper cookie, read padding error |
  | **Frequency analysis** | Ciphertext; language statistics | Beats **monoalphabetic substitution** (E, T, A, O, N...) | ROT13 / Caesar ciphertext |
  | **Meet-in-the-middle** | Known plaintext | Encrypt with all k1, decrypt with all k2; why double-DES fails [OSG glossary] | Why 2DES was never adopted |

  - Classical — structural [OSG glossary]:

  | Attack | Target | Note | Example |
  | --- | --- | --- | --- |
  | **Birthday / collision** | Hash | Substitute a signed message with one of equal digest; 23 people -> >50% shared birthday | Two contracts, one colliding digest |
  | **Analytic** | Algorithm logic | Algebraic reduction of complexity | Math shortcut, not key guessing |
  | **Statistical** | Host RNG / floating point | Exploits inability to produce randomness | Weak RNG -> predictable session IDs |
  | **Rainbow table** | Stored password hashes | Precomputed hash chains; defeated by **salt** | ophcrack vs. unsalted LM/NTLM |
  | **Dictionary / hybrid** | Passwords | Wordlist, then wordlist + brute-force suffixes | rockyou.txt plus `?d?d` suffix rule |
  | **Key clustering** | Cipher weakness | Different keys -> identical ciphertext | Two keys decrypt the same ciphertext |
  | **Replay** | Authentication traffic | Retransmit captured data; defeated by nonce/timestamp | Re-sent captured session cookie |

  - Implementation-layer [OSG glossary]:

  | Attack | Exploits | Distinguisher | Example |
  | --- | --- | --- | --- |
  | **Implementation attack** | Flaws in the software/code/methodology, not the math | Umbrella term | Heartbleed: bounds bug, math intact |
  | **Side-channel** | **Passive, noninvasive** observation of device operation (power, timing, EM) | Smartcards; nothing is altered | Oscilloscope on smartcard power line |
  | **Timing** | Variation in operation duration | A *type* of side-channel | Early-exit string compare on MAC |
  | **Power analysis** | Power draw during operations | Side-channel; **SPA** = direct (visual) analysis of power patterns per instruction, **DPA** = statistical analysis of power variations [FIPS 140-2 Sec. 4.11] | Square-and-multiply visible in trace |
  | **Fault injection** | **Actively** induces an external fault (voltage, clock, heat, laser) to corrupt device integrity | Active — not a side-channel | Voltage glitch skips PIN check |
  | **IV attack** | Short/plaintext/poorly chosen IV | WEP | WEP IV repeats, keystream recovered |
  | **Downgrade** (POODLE) | Forces weaker suite/version via AitM/false proxy | POODLE -> SSL 3.0 fallback | Strip TLS 1.2, force SSL 3.0 |

  - Operational / credential attacks [OSG glossary]:

  | Attack | Mechanism | Managerial control |
  | --- | --- | --- |
  | **MITM / on-path / AitM** | Adversary relays and possibly alters traffic; OSG prefers **adversary-in-the-middle** | Mutual authentication, certificate validation, pinning history, TLS 1.3 |
  | **Pass the hash** | Reuse cached credential hash ("authentication token") without plaintext; mostly Windows | Credential tiering, privileged access workstations, LAPS, Credential Guard [Microsoft Learn — Credential Guard overview, Windows LAPS overview, privileged-access-devices] |
  | **Kerberos exploitation** | **Golden ticket** = KRBTGT hash -> forge any TGT; mimikatz dumps hashes/tickets [OSG glossary]; **Kerberoasting** = enumerate SPNs, request TGS tickets, crack service-account hash offline; **pass-the-ticket** = reuse a stolen Kerberos ticket on another host [Microsoft Learn — Defender for Identity classic alerts]; silver ticket [MITRE ATT&CK T1558.002] (service-account hash -> forge TGS without contacting the KDC) | Rotate KRBTGT **twice**, >= 10 h apart (password history = 2; default ticket lifetime 10 h) [Microsoft Learn — AD forest recovery, reset krbtgt], strong service-account passwords, monitor TGS anomalies; RFC 4120 (July 2005): AS + TGS in KDC; offline dictionary attack not solved by Kerberos [RFC 4120] |
  | **Ransomware** | Malware encrypts/blocks system, demands payment [OSG glossary]; crypto turned against the owner | Offline/immutable backups, segmentation, IR playbook; not decryption |

  - **Crypto-malware** (cryptojacking/mining) is *not* ransomware — OSG flags the confusion [OSG glossary]. Example: XMRig pegging a server's CPU = cryptojacking; a ransom note on every desktop = ransomware. Related sabotage of crypto: **rubber-hose** (coercion), social engineering [unverified — colloquial term, no standards source].
- Exam traps / distractors:
  - **Side-channel vs. fault injection vs. timing**: side-channel = passive observe; timing = side-channel subtype using duration; fault injection = *active* perturbation. "Attacker varies supply voltage to skip an instruction" -> fault injection, not side-channel.
  - **Implementation vs. analytic**: code/deployment flaw vs. mathematical weakness in the algorithm itself. Example: Heartbleed (OpenSSL bounds bug) vs. a shortcut for factoring RSA moduli.
  - **Known vs. chosen plaintext**: possess pairs vs. can *generate* pairs. **Chosen ciphertext** = can decrypt, the reverse direction.
  - **Birthday attack** targets hash collisions (signature substitution); mitigation is longer digest, not longer key.
  - **Meet-in-the-middle** is the reason 2DES ~ 57 bits [unverified — Diffie & Hellman 1977 / Merkle & Hellman 1981 analyses, paywalled] and 3DES was needed; not the same as man-in-the-middle.
  - **Rainbow table vs. brute force**: precomputation vs. live guessing; salt kills rainbow tables, length kills brute force.
  - **Frequency analysis** works only where plaintext letter frequency survives (monoalphabetic substitution); polyalphabetic (Vigenere) flattens it.
  - **Pass the hash** is credential *reuse*, not cracking; a longer password does not stop it. Example: `sekurlsa::pth` with the NTLM hash into SMB on the next host — a 30-character password changes nothing.
  - **Golden ticket** = KRBTGT compromise = domain-wide forgery; resetting user passwords does nothing.
  - **Ransomware** answer is recovery capability (backups tested, offline) and containment; paying or "stronger encryption" are distractors.
  - **Replay vs. MITM**: retransmission of captured valid data vs. live interposition. Example: replay = re-sending a captured authenticator before its timestamp expires; MITM = ntlmrelayx forwarding the live authentication to a third host.
- Related terms: cryptographic solutions and key length (3.6), TPM/HSM tamper resistance (3.4), Kerberos and SSO (5.2, 5.6), incident response and backups (7.6, 7.10), TEMPEST/emanations (3.4)
- Sources: [ISC2 outline], [OSG glossary], [RFC 4120], [FIPS 140-2], [Microsoft Learn], [unverified]

## Site and facility design principles (3.8)
- Definition (ISC2 framing): physical security is the outermost layer and protects **people first**, then assets; a **secure facility plan** is derived from risk assessment and **critical path analysis** [OSG glossary]. Design goal: influence behavior and control access by how the site is laid out, before adding guards and locks.
- Key facts:
  - **CPTED** (Crime Prevention Through Environmental Design) — architecture shapes offender decisions [OSG glossary]:

  | Strategy | Mechanism | Example |
  | --- | --- | --- |
  | **Natural access control** | Subtle guidance of entry/exit via entranceway placement, fences, bollards, lighting | Single obvious lobby; landscaping funnels foot traffic |
  | **Natural surveillance** | Make offenders feel observed: open, obstacle-free sightlines, especially at entrances | Low hedges, glass lobby, lit walkways |
  | **Natural territorial reinforcement** | Area looks cared for, owned, actively defended | Signage, maintained grounds, clear public/private boundary |

  - Layered physical defense [OSG glossary]: **deter** (discourage) -> **deny** (prevent) -> **detect** (discover) -> **delay** (slow until response) -> **determine** (cause/purpose) -> decide/respond. Each ring should add time for the previous ring's detection to trigger response. Example: lighting/signage deter -> badge door denies -> door-forced alarm detects -> vestibule delays -> CCTV review determines -> guard responds.
  - Site selection factors [unverified — verify OSG ch. 10]: visibility and neighbors, accessibility (roads, transit), natural disaster exposure (flood plain, seismic, storm tracks), local crime, proximity of emergency services, utility reliability, ability to build without external signage.
  - Facility design principles: server/data rooms in the **core** of the building (no exterior walls/windows) [unverified]; single controlled entry with visitor processing; minimize windows in secure areas; separate public, work, and restricted zones; **restrictive defaults** in access rules [OSG glossary]; plan for **fail-safe** egress (life) vs. **fail-secure** assets (3.1).
  - Standards to know exist: **ANSI/TIA-942** Telecommunications Infrastructure Standard for Data Centers — four levels **Rated-1** basic -> Rated-2 redundant components -> Rated-3 concurrently maintainable -> **Rated-4** fault tolerant [TIA-942 ratings, tiaonline.org]. Correction (audit 2026-09-28): was "tiers 1–4"; TIA's own rating pages use Rated-1..4, not "Tier". **ISO/IEC 27002:2022** clause 7 = physical controls (5 organizational, 6 people, 8 technological) [ISO/IEC 27002:2022]. **NFPA 75** Standard for the Fire Protection of Information Technology Equipment (2024 ed.); **NFPA 76** Standard for the Fire Protection of Telecommunications Facilities (2020 ed.) [NFPA catalog].
  - **Lighting** is the most common perimeter control; purpose is to discourage casual intruders and prowlers [OSG glossary]. **Fence** defines the protected perimeter [OSG glossary]; **PIDAS** = 2–3 concentric fences, main 8–20 ft possibly electrified/sensored, outer 4–6 ft to keep animals/casual trespassers off [OSG glossary].
- Exam traps / distractors:
  - **CPTED vs. target hardening**: locks, bars, and fences are hardening; CPTED is design that changes behavior (sightlines, ownership cues). Stem asking for "environmental design" wants natural surveillance/access control/territorial reinforcement.
  - **Deterrent vs. preventive vs. detective**: lighting and signage deter; fences and locks prevent/deny; CCTV and motion sensors detect. CCTV is *not* preventive unless monitored and responded to in real time.
  - **Fail-safe** wins whenever human life is in the stem — emergency doors unlock on power loss even in a data center.
  - "Most important" physical security goal -> **personnel safety**, above asset protection.
  - **Natural access control** (guiding flow) vs. **natural surveillance** (being seen): a fence funneling visitors to the lobby is access control; the glass lobby is surveillance.
  - Signage: territorial reinforcement wants ownership signs; data centers want **no** signage revealing function — both can be right depending on the asset asked about.
- Related terms: facility controls (3.9), perimeter/internal physical security operations (7.14), personnel safety and duress (7.15), fail-safe vs. fail-secure (3.1), BIA and site risk (1.7)
- Sources: [OSG glossary], [TIA-942], [ISO/IEC 27002:2022], [NFPA catalog], [unverified]

## Site and facility security controls (3.9)
- Definition (ISC2 framing): controls for specific facility areas and environmental threats named in outline 3.9 — wiring closets/IDF, server rooms/data centers, media storage, evidence storage, restricted work areas, utilities/HVAC, environmental issues, fire, power [ISC2 outline]. Exam angle: the control matched to the room and the hazard, with safety of people as the tiebreaker.
- Key facts:
  - Areas [OSG glossary]:

  | Area | Threat | Controls |
  | --- | --- | --- |
  | **Wiring closet / IDF / MDF** | Neglected entry point; tap, rogue device; IDF = per-floor closet feeding the **MDF** (main); **entrance facility** = telco demarcation | Locked, no shared use (janitorial), cable plant management policy, inventory of ports, no signage |
  | **Server room / data center** (server vault) | Unauthorized physical access, environment | Core location, access control vestibule, badge + biometric, logging, hot/cold aisles, no unescorted visitors; unmanned preferred |
  | **Media storage facility** | Theft, remanence, degradation | Locked cabinet/safe, inventory, environment control, sanitization before reuse |
  | **Evidence storage** | Admissibility, tampering | Chain of custody, restricted access, tamper-evident seals, separate from media storage |
  | **Restricted / work area** (**SCIF**) | Compartmented data exposure | Clearance + SCI approval, no personal devices, escorts, visitor logs, TEMPEST if required |
  | **Utilities / HVAC** | Loss of cooling, humidity extremes, contaminated air, tampering with plant | Redundant HVAC, monitoring, **plenum-rated** cabling, positive pressure, restricted access to plant rooms |

  - Fire — **fire triangle**: fuel, heat, oxygen, plus the chemical reaction; remove one and the fire stops [OSG glossary]. Detection [OSG glossary]:

  | Detector | Senses | Note |
  | --- | --- | --- |
  | **Fixed-temperature / heat** | Specific temperature melts sprinkler trigger | Most common; head is detector *and* release |
  | **Rate-of-rise** | Rapid temperature increase [unverified — NFPA 72 paywalled] | Faster than fixed-temp |
  | **Smoke — ionization / photoelectric** | Charged particles / light obstruction [unverified for mechanism — NFPA 72 paywalled] | Standard office detection |
  | **Flame-actuated** | Infrared energy of flames | Fast, reliable, expensive; high-risk areas |
  | **Incipient / aspirating** | Combustion chemicals before visible fire | Costliest; critical environments |

  - Suppression — water systems [OSG glossary]:

  | System | How it works | Where |
  | --- | --- | --- |
  | **Wet pipe** (closed head) | Pipes always full; immediate discharge | General office; leak/freeze risk |
  | **Dry pipe** | Pipes hold compressed air; valve opens on trigger, then water | Areas where pipes may freeze [unverified — NFPA 13 paywalled] |
  | **Preaction** | Dry until early detection fills pipes; water released only when head melts; can be aborted | **Best water system for rooms with both computers and humans** |
  | **Deluge** | Larger pipes, large water volume, all heads open | **Inappropriate for electronics** |

  - Suppression — gas and agents: **gas discharge** displaces oxygen or interrupts the reaction [OSG glossary]; **halon** converts to toxic gas at 900°F and depletes ozone -> replaced [OSG glossary]; replacements **FM-200** (HFC-227ea), **Inergen** (IG-541), **FE-13** (HFC-23), **Aero-K** (powdered aerosol), argon (IG-01), CO2 — all EPA SNAP-acceptable Halon 1301 total-flooding substitutes; clean agents per **NFPA 2001** [EPA SNAP total flooding agents]; CO2 lethal to occupants — OSHA requires a pre-discharge alarm at >= 4% design concentration [OSHA 29 CFR 1910.162(b)(5)]; "use only in unmanned spaces" is the OSG framing [unverified]. Fire classes: **A** ordinary combustibles (wood, paper), **B** flammable liquids/gases/greases, **C** energized electrical, **D** combustible metals [OSHA 29 CFR 1910.155(c)]; **K** commercial kitchen oils [unverified — Class K is from NFPA 10; OSHA defines no Class K]. Correction (audit 2026-09-28): tag was 1910.157, which only references the classes; definitions are in 1910.155(c). Agents: A water/soda acid; B CO2/foam/dry powder; C CO2/gas/dry powder; D dry powder; K wet chemical [unverified — NFPA 10 paywalled].
  - Power anomalies [OSG glossary]:

  | Term | Meaning | Pair |
  | --- | --- | --- |
  | **Fault** | Momentary loss | **Blackout** = complete loss |
  | **Sag** | Momentary low voltage | **Brownout** = prolonged low voltage |
  | **Spike** | Momentary high voltage | **Surge** = prolonged high voltage |
  | **Inrush** | Initial surge on connecting to power | Generator/UPS switchover |
  | **Noise** | Steady interference; **transient** = short burst | **EMI**: common mode (hot–ground), traverse mode (hot–neutral); **RFI** = radio spectrum |
  | **Clean power** | Nonfluctuating pure power | Goal of conditioning |

  - Power controls [OSG glossary]: **UPS** = battery-fed clean power for short outages; **double conversion** (online, always via battery) vs. **line-interactive**; **generator** for blackouts (fuel, testing); **surge protector** cuts power on overvoltage — only where instant cut-off is harmless; **power conditioner** also filters noise; redundant utility feeds and dual power supplies [unverified for A/B feed terminology — TIA-942 body paywalled]. Example: double conversion = the load always runs off the inverter so a sag never reaches the server; line-interactive = utility passes through and the UPS switches to battery on a fault, with a transfer gap.
  - HVAC and environment [OSG glossary]: monitor temperature, humidity, dust/smoke; **hot and cold aisles** optimize cooling; low humidity -> **electrostatic discharge** (ESD); high humidity -> condensation/corrosion [unverified]; typical targets 15–32°C and 40–60% RH [unverified — verify OSG ch. 10 / ASHRAE TC 9.9 thermal guidelines, paywalled]; **positive pressurization** keeps contaminants out [unverified]; water detection under raised floors; plenum-rated cable produces minimal smoke/toxic gas. **Natural disasters** (earthquake, flood, storm, extreme temperature) vs. man-made (fire, arson, riot, utility failure, explosion) [OSG glossary].
  - Perimeter and entry controls [OSG glossary]: fences (3–4 ft deter casual, 6–7 ft too hard to climb easily, 8 ft + barbed wire deter determined [unverified — OSG ch. 10 only, no standards source]), **PIDAS**, **bollards/barricades** (vehicles), gates, **turnstile** (one at a time, one direction), **access control vestibule** (mantrap deprecated; person trap) with guard, **badges/proximity/smartcards**, **visitor logs**, guards vs. **guard dogs**, motion detectors (infrared, photoelectric for dark windowless rooms, passive audio, **dual-technology** IR + microwave to cut false alarms), infrared linear beam, noise detection, CCTV/surveillance. **Tailgating** (unaware) vs. **piggybacking** (convinced to hold the door) [OSG glossary].
- Exam traps / distractors:
  - **Preaction** is the water answer for a room with people *and* electronics; **deluge** is never; **dry pipe** is for freezing risk, not "less water damage" per se.
  - **Class C** (electrical) fire — water/foam conducts; gas or dry powder. Class K is kitchen, not "kinetic".
  - **Halon** distractor: it works, but is banned for ozone and toxic when hot — the answer is a clean-agent replacement.
  - **CO2** suppresses well but suffocates people; unmanned spaces only.
  - **Sag vs. brownout**, **spike vs. surge**: momentary vs. prolonged is the whole distinction. **Fault vs. blackout** likewise. Example: sag = lights dip when the chiller compressor starts; brownout = utility lowers voltage through an afternoon heatwave; spike = lightning; surge = after a generator transfer; inrush = powering a rack back on.
  - **UPS** buys minutes for clean shutdown or generator start; the **generator** is the availability control for sustained outage. Example: the UPS carries the racks through the generator's start-up and transfer; a multi-hour outage is the generator's job.
  - **EMI common vs. traverse mode**: hot-to-ground vs. hot-to-neutral.
  - **Humidity**: too low -> static/ESD; too high -> corrosion. Both are answers to different stems.
  - **Evidence storage** requires chain of custody; media storage does not — don't merge them.
  - **Wiring closets** are the usual "forgotten" physical weak point; the fix is access control and policy, not encryption.
  - **Photoelectric motion detector** is for dark, windowless internal rooms; **infrared** for heat changes; dual-technology when false alarms are the stated problem.
  - **Tailgating vs. piggybacking**: victim unaware vs. victim complicit. Example: tailgating = slipping in behind a badge holder who never looked back; piggybacking = "forgot my badge, can you hold the door?"
- Related terms: site design principles (3.8), physical security operations (7.14), media management and sanitization (7.5, 2.4), evidence handling (7.1), BC/DR site strategies (7.10), TEMPEST and emanations (3.4)
- Sources: [ISC2 outline], [OSG glossary], [OSHA 29 CFR 1910.155], [OSHA 29 CFR 1910.162], [EPA SNAP], [unverified]

## Information system lifecycle (3.10)
- Definition (ISC2 framing): manage security across the **system** life cycle — stakeholder needs and requirements, requirements analysis, architectural design, development/implementation, integration, verification and validation, transition/deployment, operations and maintenance/sustainment, retirement/disposal [ISC2 outline]. This is systems engineering scope (hardware, people, process), broader than the software SDLC of Domain 8.
- Key facts:
  - Reference frameworks: **ISO/IEC/IEEE 15288:2023** System life cycle processes — common process framework for acquirers/suppliers; software-dominant systems use ISO/IEC/IEEE 12207 [ISO/IEC/IEEE 15288]. **NIST SP 800-160 Vol 1 Rev 1** (Nov 2022) *Engineering Trustworthy Secure Systems* — security aspects of the 15288 technical processes (Appendix H: business/mission analysis, stakeholder needs and requirements definition, system requirements definition, architecture definition, design definition, ... implementation, integration, verification, transition, validation, operation, maintenance, disposal) and the 15288 stages concept, development, production, utilization, support, retirement [NIST SP 800-160]. **SP 800-64 Rev 2** (security in the SDLC, Oct 2008) **withdrawn** May 31 2019 -> use SP 800-160 [NIST SP 800-64]. **SP 800-37 Rev 2** RMF is subtitled "a system life cycle approach" [NIST SP 800-37].
  - Stage by stage:

  | Stage | Security activity | Trap | Example |
  | --- | --- | --- | --- |
  | **Stakeholder needs & requirements** | Elicit protection needs from mission, regulation, classification; define **assurance** expected [OSG glossary] | Cheapest place to add security; skipping it is the root cause of most later findings | CISO: "no PII leaves the region" |
  | **Requirements analysis** | Functional vs. nonfunctional/security requirements; traceability matrix; misuse cases | Requirements are *what*, not *how* — a firewall is design, not requirement | "Logs tamper-evident", not "buy Splunk" |
  | **Architectural design** | Security architecture: TCB boundary, trust zones, models (3.2), threat modeling (1.10), reference architectures (SABSA, CSA EA [OSG glossary]) | Design chooses mechanisms to satisfy requirements | Jump host between tiers; DMZ |
  | **Development / implementation** | Secure coding, code review, SAST (D8); configuration baselines for hardware | "Implementation" here = build, not deployment | SAST gate in the CI pipeline |
  | **Integration** | Assemble elements + third-party/COTS components; **interface testing** against specifications [OSG glossary]; supply-chain checks (1.11) | Integration is where component assumptions collide | Vendor SAML module tested against spec |
  | **Verification & validation** | **Verification** = built to spec (did we build it right); **validation** = meets stakeholder need (did we build the right thing); **acceptance testing** [OSG glossary]; **regression testing** after change [OSG glossary] | V vs. V swap is the standard trap | Pen test vs. UAT sign-off |
  | **Transition / deployment** | Change management approval, secure config, training, **ATO** (authorization to operate) — formal management acceptance of risk, time-limited, revocable [OSG glossary] | Certification (technical evaluation) vs. accreditation/authorization (management decision) — FIPS 200: certification = comprehensive assessment of controls in support of accreditation; accreditation = official management decision by a senior official to authorize operation and explicitly accept risk; now termed **authorization to operate** [FIPS 200 via NIST CSRC glossary] | CAB approval; AO signs ATO memo |

  | Stage | Security activity | Trap | Example |
  | --- | --- | --- | --- |
  | **Operations & maintenance / sustainment** | Patch and vulnerability management, **configuration management** (baseline, change control) [OSG glossary], continuous monitoring, **baseline reporting** [OSG glossary]; track **EOL** (no longer produced) vs. **EOS/EOSL** (no longer supported) [OSG glossary] | Longest, costliest stage; **legacy platforms** = unsupported [OSG glossary] | Patch Tuesday; CMDB baseline drift |
  | **Retirement / disposal** | Media sanitization — SP 800-88 Rev 2 (Sept 2025): **clear** (logical, read/write), **purge** (e.g., cryptographic erase, degauss), **destroy** [NIST SP 800-88]; revoke certificates/keys/accounts; data retention obligations; contract/license termination; decommission documentation | Disposal is not deletion; **cryptographic erase** only works if keys were never exposed | Shred drives, revoke service accounts |

  - Assurance vocabulary [OSG glossary]: **assurance** = degree of confidence security needs are satisfied, continually re-verified; **assurance procedure** = formal process building trust into the life cycle; **life cycle assurance** = trust judged from design, architecture, creation, testing, distribution (vs. **operational assurance** during use — TCSEC splits assurance into operational (system architecture, system integrity) and life-cycle (security testing, design verification) [TCSEC DoD 5200.28-STD Sec. 2.1.3]). Example: life-cycle = signed build pipeline and design review; operational = runtime integrity checks and audit logging. **Immutable system** = never altered in place; replaced with a new build [OSG glossary]. Example: a container image rebuilt and redeployed for every patch, never `apt upgrade` in place. **Waterfall** = 7 stages (system requirements -> software requirements -> preliminary design -> detailed design -> code/debug -> testing -> O&M), feedback to prior phase [OSG glossary]; **spiral** iterates; **Agile** adaptive [OSG glossary] — detail in 8.1.
- Exam traps / distractors:
  - **Verification vs. validation**: spec conformance vs. fitness for stakeholder purpose. "Meets the documented requirements" -> verification; "solves the business problem" -> validation. Example: verification = all 40 spec'd detection rules fire in test; validation = the SOC actually catches the ransomware the business feared.
  - **Certification vs. accreditation (ATO)**: technical evaluation vs. management's formal risk acceptance; the **authorizing official** accepts risk, engineers do not. Example: the assessor's report saying "controls implemented and effective" = certification; the CIO signing the ATO memo accepting residual risk = accreditation.
  - Security requirements come from **stakeholders and risk**, not from the design team's preferred products; picking a control in the requirements phase is a scope error.
  - **System life cycle** (3.10, 15288) includes hardware, facilities, people, and disposal; **SDLC** (8.1) is software only. A stem about decommissioning servers or sanitizing disks is 3.10.
  - **Disposal** requires sanitization proportional to classification plus revocation of identities/keys — "delete the data" and "format the drive" are the distractors (2.4 remanence). Example: "cryptographic erase" of a self-encrypting drive whose key was once exported to a backup = not sanitized.
  - **EOL vs. EOS**: still supported after EOL until EOS; risk spikes at EOS. Example: a switch model no longer sold (EOL) still gets security patches until its end-of-support date (EOS).
  - **Operations & maintenance** is where most cost and most breaches occur; "security is complete at deployment" is the misconception.
  - **SP 800-64** appears in older material — withdrawn; **SP 800-160** is current.
- Related terms: SDLC and methodologies (8.1), change and configuration management (7.3, 7.9), data remanence and destruction (2.4), RMF and control selection (3.3), SCRM and acquisition (1.11), EOL/EOS (2.5)
- Sources: [ISC2 outline], [OSG glossary], [ISO/IEC/IEEE 15288], [NIST SP 800-160], [NIST SP 800-64], [NIST SP 800-37], [NIST SP 800-88], [FIPS 200], [TCSEC DoD 5200.28-STD]
