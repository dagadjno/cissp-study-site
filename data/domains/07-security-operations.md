# Domain 7: Security Operations

<!-- REVIEW -->
## Investigations - evidence, forensics, and artifacts (7.1)
- Definition (ISC2 framing): forensics = collection, protection, and analysis of evidence to present the facts in court [OSG glossary]; outline 7.1 = evidence collection/handling, reporting/documentation, investigative techniques, digital forensics TTPs, artifacts (data, computer, network, mobile) [ISC2 outline]. Management view: the security professional **preserves and documents**; legal counsel and law enforcement decide what is prosecutable. **Locard's exchange principle**: every contact leaves a trace [OSG glossary]
- Key facts:
  - Evidence types [OSG glossary]:

  | Type | What it is | Watch for | Example |
  | --- | --- | --- | --- |
  | **Real** (object) | Physical items brought into court | Seized drive, laptop | The seized laptop itself |
  | **Documentary** | Written items proving a fact | Must be **authenticated**; logs live here | Its exported event log |
  | **Testimonial** | Witness testimony, verbal or deposition | Direct experience only; else hearsay | Analyst describing what they saw |
  | **Demonstrative** | Supports testimony (charts, models) | May not be admitted itself | Timeline slide built for the jury |

  - Admissibility = **relevant** (helps determine a fact) + **material** (fact relates to the case) + **competent** (obtained legally, e.g. warrant or consent) [OSG glossary]. Example: pcap taken from a coworker's home router without consent -> relevant and material, but not competent
  - Rules on documents [OSG glossary]:

  | Rule | Says | Example |
  | --- | --- | --- |
  | **Best evidence rule** | Original document, not a copy, unless an exception applies | Hashed original image, not a screenshot of it |
  | **Parol evidence rule** | Written agreement is the complete agreement; no oral modifications | Vendor's verbal "24 h notice" promise loses to the signed contract |
  | **Hearsay** | Statements made outside court; **unauthenticated log files** can be treated as hearsay | SIEM export with no custodian attesting how it is generated |

  - **Chain of custody** (chain of evidence): document tracking every person in control from discovery to court [OSG glossary]; SP 800-61r2 lists what it records: identifying info (location, serial, hostname, MAC), name/title/phone of each handler, time/date of each transfer, storage location [NIST SP 800-61]. Example: drive bagged and serial logged at seizure, every hand-off signed with a time; an unexplained 2 h gap is what the defense attacks
  - **Order of volatility**, most to least [RFC 3227]:
    1. Registers, cache
    2. Routing table, ARP cache, process table, kernel stats, memory
    3. Temporary file systems
    4. Disk
    5. Remote logging/monitoring data
    6. Physical configuration, network topology
    7. Archival media
  - RFC 3227 rules: don't shut down before collection; don't trust programs on the system; avoid touching access times; beware attacker-planted evidence-destruction triggers [RFC 3227]
  - **SP 800-86** (Aug 2006) four-phase forensic process: **collection -> examination -> analysis -> reporting**; volatile data normally gets priority [NIST SP 800-86]
  - Investigative techniques [OSG glossary]: **interview** = information from a non-suspect; **interrogation** = questioning a suspect (example: asking the helpdesk tech what she saw = interview; questioning the admin whose credentials ran the script = interrogation). **e-discovery** = duty to preserve and share electronic records with the adversary in litigation (example: litigation hold on the mailboxes of everyone named in the lawsuit). **Exigent circumstances** = evidence would be destroyed or harm imminent, justifies immediate collection (example: the suspect's screen shows a wipe script counting down -> seize now, paperwork after)
  - Artifacts = items of evidence left behind by the actor [OSG glossary]; outline categories: **data**, **computer** (memory, registry, logs, file system), **network** (flows, pcaps, device logs), **mobile** (SIM, app data, location) [ISC2 outline]
  - Tooling named in the OSG glossary: **FTK Imager** (drive cloning, read-only mount, hashes) [OSG glossary]; hash before and after every copy, work from the copy, write-blocker on originals [NIST SP 800-86 Sec. 3.1.2, 4.2.1-4.2.2] [OSG glossary]
  - **EDRM** (Electronic Discovery Reference Model) — e-discovery = each side's legal duty to preserve and share case-related records, electronic included [OSG glossary]. **Why it exists**: (1) **volume** — human review is the costliest stage, so the model front-loads cheap mechanical reduction; (2) **spoliation** — deleting relevant data after the duty to preserve attaches (even by routine purge) draws sanctions: fines, adverse inference, default judgment [unverified]; (3) **defensibility** — a recognized, repeatable process survives "how do we know you collected everything unaltered?" Security owns the three stages where the org can lose the case: information governance (retention decides what exists), preservation (suspend purges on legal hold), collection (chain of custody). "Litigation notice received, what FIRST" -> **preserve**. Stages, in order (OSG chapter text, verify ch. 19) [unverified]:

  | # | Stage | What happens |
  | --- | --- | --- |
  | 1 | **Information governance** | Policies so data is discoverable before any case |
  | 2 | **Identification** | Locate potentially relevant data (custodians, date ranges) |
  | 3 | **Preservation** | **Legal hold** — stop deletion; before collection |
  | 4 | **Collection** | Gather/**acquire** into a central repository (forensic export) |
  | 5 | **Processing** | **Filter**, de-dupe, convert formats — mechanical volume cut |

  | # | Stage | What happens |
  | --- | --- | --- |
  | 6 | **Review** | Human judgment: relevance and privilege |
  | 7 | **Analysis** | Patterns, key people, timelines |
  | 8 | **Production** | Deliver to requesting party in agreed format |
  | 9 | **Presentation** | Display in deposition/court |

    - Hook: **"I IP CPR App"** (look at the IP used in a CPR app) — I·IP = governance, identification, preservation (hold); CPR = collection, processing, review; App = analysis, production, presentation. Discriminators: **preservation precedes collection** (freeze, then gather); **processing != review** (mechanical reduction vs. human relevance call). Example: "after acquisition, what NEXT" -> processing (filter erroneous/unnecessary data); "centralize the data" = collection (just done), "locate" = identification (earlier), "examine to comply" = review (later) (missed 2026-10-05: picked centralize)
- Exam traps / distractors:
  - **Sequence questions** (EDRM, incident steps, RMF): options include the *current* and *previous* stage as bait; answer is strictly the next one
  - **Relevant vs. material vs. competent**: illegal search -> not **competent** (not "irrelevant")
  - Logs are **documentary** evidence, but unauthenticated they become **hearsay**: the fix is an admin/custodian attesting to normal business generation
  - **Interview vs. interrogation**: the difference is whether the person is a suspect, not who asks
  - Order of volatility: **memory before disk**; "image the disk first" is the wrong first step on a live box. Example: live ransomware host -> memory dump, process/connection capture, then disk image, then pull firewall logs
  - **Best evidence** (original vs. copy) vs. **parol** (written vs. oral)
  - Forensic image != backup: a bit-for-bit image with hash preserves slack/unallocated space; a backup does not
  - ISC2 order of investigation priority: preserve **life/safety**, then **evidence**; and containment decisions weigh the need for evidence preservation against service availability [NIST SP 800-61]
- Related terms: investigation types (D1 1.5), incident management (7.6), warning banners (7.7), evidence storage (D3 3.9)
- Sources: [ISC2 outline], [OSG glossary], [RFC 3227], [NIST SP 800-86], [NIST SP 800-61]

## Logging and monitoring (7.2)
- Definition (ISC2 framing): logging = recording events; monitoring = reviewing them for policy violations, attacks, and failures; both are **detective** controls that feed **continuous monitoring** [OSG glossary]. Outline 7.2 items: IDPS, SIEM, continuous monitoring and tuning, egress monitoring, log management, threat intelligence (feeds, hunting), UEBA [ISC2 outline]
- Key facts:
  - Vocabulary the exam expects [OSG glossary]:

  | Term | ISC2 gloss |
  | --- | --- |
  | **Audit trail** | Records of user/system activity used for accountability |
  | **Clipping level** | Threshold in violation analysis; crossing it triggers logging/alerting |
  | **Sampling** | Data reduction to extract the important events from an audit trail |
  | **Log analysis** | Reviewing records for violations, malicious events, downtime, bottlenecks |
  | **syslog** | Standard transit to a centralized retention server (rsyslog, syslog-ng) |
  | **SIEM** | Centralized automation of monitoring across the enterprise |
  | **SOAR** | Automates collect/analyze/enrich with threat intel and responds to low/mid severity without humans |

  - **Egress monitoring** = watching outbound traffic to detect/prevent **exfiltration**; egress filter = outbound packet filter [OSG glossary]. Exam pairs it with **DLP**, **steganography** (message hidden in another file) and **watermarking** (hidden ownership info in a file) as the things egress monitoring must catch [OSG glossary]
  - **Threat intelligence** = information about threat actors and their threats so defenses can be built; **threat feed** = the source; **threat hunting** = **proactive** search through indicators of compromise, logs, observables for intruders already inside [OSG glossary]
  - **UEBA** (user and entity behavior analytics): the **E** extends user behavior analytics to non-user entities (hosts, services) whose activity still correlates to recon/intrusion [OSG glossary]
  - Log management (management view): protect log **integrity** (centralize, write-once, restricted access), **retention** per policy/regulation, **time sync** (NTP) so correlation and evidence hold up, define review frequency and who reviews [NIST SP 800-92 Sec. 2.3.2, 4.2, 5.5]; SP 800-53 **AU-6** Audit Record Review, Analysis, and Reporting [NIST SP 800-53]
  - Continuous monitoring in ISC2 terms = ongoing awareness feeding risk decisions (SP 800-137 framing) [NIST SP 800-137] - see D1 1.9 entry; **tuning** = reduce false positives without raising false negatives
- Exam traps / distractors:
  - **Threat hunting vs. threat intelligence**: hunting is the activity on your network; intel is the information (feeds) that may seed it
  - **Threat hunting vs. IDS alerting**: hunting is proactive, hypothesis-driven, assumes compromise; alerting is reactive
  - **UEBA vs. SIEM**: UEBA baselines behavior and flags deviation; SIEM correlates rules; UEBA typically sits on top of SIEM data
  - **Egress monitoring** is about data leaving; the exam distractor is ingress filtering/IDS
  - **Clipping level** = threshold to ignore noise (e.g. 3 failed logons), not a log-retention setting
  - Logs as **evidence**: retention + integrity + authentication by a custodian, else hearsay (7.1)
  - **SOAR** automates response; **SIEM** automates monitoring; neither replaces analyst judgment on high-severity events
- Related terms: IDS/IPS types (7.7), continuous monitoring (D1 1.9), log reviews (D6 6.2), evidence (7.1)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53], [NIST SP 800-92], [NIST SP 800-137]

## Configuration management (7.3)
- Definition (ISC2 framing): CM = (1) logging, auditing, monitoring activity related to security controls over time to identify agents of change; (2) administering setup and changes so systems are **deployed and stay in a secure, consistent state** across their lifetime [OSG glossary]. Outline 7.3 = provisioning, baselining, automation [ISC2 outline]
- Key facts:

  | Term | ISC2 gloss | Source |
  | --- | --- | --- |
  | **Baseline** | Minimum security every system must meet; also performance baseline (behavior IDS) or configuration baseline (CM) | [OSG glossary] |
  | **Baseline configuration** | Initial implementation of a system at the standardized minimum | [OSG glossary] |
  | **Baseline reporting** | Comparing current implemented security against the stated baseline | [OSG glossary] |
  | **Security baseline** | Standardized minimum all systems must comply with | [OSG glossary] |
  | **Provisioning** | Preallocating resources to deploy new server instances | [OSG glossary] |
  | **Infrastructure as code** (IaC) | Hardware config managed like code under DevOps | [OSG glossary] |
  | **Immutable architecture** | Server never changes post-deploy; rebuild/clone with changes, replace | [OSG glossary] |

  - Baselining flow: `image/template -> deploy -> scan against baseline -> report drift -> remediate via change management`
  - Baselines come from a **standard** (D1 1.6); the baseline is the technical instantiation of the standard; **scoping and tailoring** (D2 2.6) adjust it
  - SP 800-53 **CM-2** Baseline Configuration, **CM-3** Configuration Change Control [NIST SP 800-53]; **SP 800-128** Guide for Security-Focused Configuration Management of Information Systems [NIST SP 800-128]. Correction (audit 2026-09-28): title completed; it was missing "of Information Systems" (source: SP 800-128 title page)
  - Automation reduces **configuration drift** and human error; scanning tools compare hosts to baseline (SCAP-style checks) [NIST SP 800-128 Sec. 2.2.4, 3.5] [NIST SP 800-126]
- Exam traps / distractors:
  - **Configuration management vs. change management**: CM = what state systems are in (baseline, inventory, drift); change management = the approval process for altering that state (7.9). Example: the CAB ticket approving a new listener is change management; next week's scan showing that port open versus the image is CM
  - **Baseline vs. standard vs. guideline**: baseline = enforceable minimum config; guideline = optional advice. Example: standard says "TLS 1.2+ on every web server"; baseline = the hardened server image that enforces it; guideline = "prefer TLS 1.3 where clients support it"
  - **Baselining** in CM vs. in IDS: same word, configuration vs. normal-behavior meaning
  - Provisioning != patching; provisioning is deployment from the baseline
- Related terms: change management (7.9), security documentation hierarchy (D1 1.6), scoping/tailoring (D2 2.6), software CM (D8 8.2)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53], [NIST SP 800-128], [NIST SP 800-126]

## Foundational security operations concepts (7.4)
- Definition (ISC2 framing): personnel and privilege controls that limit what any one person can know, do, or accumulate; outline 7.4 = need-to-know/least privilege, separation of duties and responsibilities, privileged account management, job rotation, service-level agreements [ISC2 outline]
- Key facts:

  | Concept | ISC2 gloss | Distinguisher | Example |
  | --- | --- | --- | --- |
  | **Need to know** | Access to data/resource required for specific work tasks; clearance alone is insufficient [OSG glossary] | About **data/knowledge** | Cleared Secret, off the project -> no file access |
  | **Least privilege** | Minimum rights/permissions to do the job [OSG glossary] | About **actions/privileges** | Can read the share, not delete or install |
  | **Separation of duties** (SoD) | Compartmentalize responsibilities so no one subject can circumvent controls; admins get focused not system-wide privileges [OSG glossary] | Anti-fraud; forces **collusion** | One clerk creates vendors, another approves payments |
  | **Separation of privilege** | Granular permissions per type of privileged operation [OSG glossary] | Builds on least privilege | Backup right without restore right |
  | **Two-person control** | Two people required to perform an operation [OSG glossary] | Both act | Two admins approve the root-key export |
  | **Split knowledge** | SoD + two-person control: info/privilege divided among people (key custodians) [OSG glossary] | Neither knows the whole | Each custodian holds half the master key |
  | **Job rotation** | Rotate staff across positions: knowledge redundancy + fraud/misuse detection [OSG glossary] | Detective + deterrent | AP clerk moves to AR; successor spots the fake vendor |

  - **Mandatory vacations**: one to two weeks annually so tasks and privileges can be audited [OSG glossary] - detective control for fraud. Example: the covering clerk reconciles the account the vacationing one always handled and finds the skim; NOT a wellbeing or burnout control
  - **Collusion** = agreement between individuals to commit fraud [OSG glossary]; SoD raises the bar to collusion, job rotation and mandatory vacation make sustained collusion harder
  - **Privileged account management** (PAM): IAM solutions restricting access to privileged accounts or detecting use of elevated privileges [OSG glossary]; practices: separate admin accounts, MFA, session recording, just-in-time elevation, monitoring of **privileged operations functions** [OSG glossary]
  - **Service-level agreement** (SLA): contractual commitment on service metrics (availability, response, resolution) with remedies for miss; **MOU** = expression of aligned intent, not typically legally binding [OSG glossary]. Management view: SLA is how you push operational requirements to a vendor and measure them (D1 1.11 service-level requirements)
  - SP 800-53 **AC-5** Separation of Duties, **AC-6** Least Privilege [NIST SP 800-53]
- Exam traps / distractors:
  - **Need-to-know vs. least privilege**: "can read the file?" = need to know; "can delete/modify/install?" = least privilege. Clearance level alone never grants access
  - **SoD vs. least privilege**: one person both approves and pays -> SoD violation even if each right is minimal
  - **Job rotation vs. mandatory vacation**: rotation is permanent movement (cross-training + detection); vacation is a temporary audit window. Both are **detective**, primary aim fraud detection
  - **Two-person control vs. split knowledge**: two present and acting vs. each holds half the secret
  - **SLA vs. MOU vs. SLR**: SLA = binding with metrics; MOU = intent; service-level requirement = what you ask for before contract. Example: 99.9 % uptime with service credits = SLA; two agencies agreeing to share threat intel with no penalties = MOU; "we need 99.9 %" in the RFP = SLR
  - PAM is the technology; the **principle** is least privilege plus accountability
- Related terms: secure design principles (D3 3.1), personnel security (D1 1.8), privilege escalation/service accounts (D5 5.5), SLR (D1 1.11)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53]

## Resource protection and media management (7.5)
- Definition (ISC2 framing): protecting the organization's tangible and intangible resources - especially **media** (HDD, SSD, flash, USB, optical, tape [OSG glossary]) - through the lifecycle: label, store, transport, sanitize, destroy. Outline 7.5 = media management, media protection techniques, data at rest / in transit [ISC2 outline]
- Key facts:
  - Lifecycle controls: **marking/labeling** with classification; **media storage facilities** (locked cabinet or safe for blank, reusable, install media) [OSG glossary]; environmental control (temperature, humidity, magnetic fields); **inventory** and check-out; encrypted **transport**; track age and rotate before **MTBF** (mean time between failures) [OSG glossary]
  - Sanitization vocabulary (full detail in D2 "Data remanence and destruction methods"):

  | Term | Gloss | Source |
  | --- | --- | --- |
  | **Clear** | Logical techniques on all user-addressable locations; defeats simple, non-invasive recovery | [NIST SP 800-88] |
  | **Purge** | Physical or logical techniques; recovery infeasible even with state-of-the-art lab techniques | [NIST SP 800-88] |
  | **Destroy** | Recovery infeasible **and** media unusable afterward | [NIST SP 800-88] |
  | **Cryptographic erase** | Sanitize the keys; a **purge** technique | [NIST SP 800-88] |
  | **Degaussing** | Magnetic field destroys data on **magnetic** media; may damage modern drives | [OSG glossary] |

  - **SP 800-88 Rev. 2** (Sept 2025) supersedes Rev. 1 (Dec 2014); definitions above are from Rev. 2 [NIST SP 800-88]. SP 800-53 **MP-6** Media Sanitization [NIST SP 800-53]
  - **Data at rest** = stored statically on a device; **data in transit** = being communicated over a network [OSG glossary]; protection = encryption (full-disk/database vs. TLS/IPsec), plus access control and integrity checks; **data in use** lives in memory and is the hardest state (D2 2.6)
  - Cloud/SaaS media: you cannot degauss a provider's disk -> **cryptographic erase** and contract terms are the control
- Exam traps / distractors:
  - **Clear vs. purge**: overwriting a spinning disk for reuse in the same environment = clear; leaving org control = purge or destroy. Example: wiping a returned laptop for the next hire = clear; the same drive going to a recycler = purge (or destroy)
  - **Degaussing SSDs** does nothing; SSDs need purge via manufacturer commands or crypto erase, or destruction [NIST SP 800-88 Rev. 2 Sec. 3.1.2, 4.5.2]
  - **Erasing/deleting vs. clearing**: delete removes the pointer; data remains (**remanence**)
  - **Sanitization** is the umbrella; degaussing and purging can sanitize without destroying [OSG glossary]
  - Data at rest vs. in transit: a laptop in a car is **at rest**; the exam likes "data on a backup tape in a courier van" - still at rest, protect with encryption plus chain of custody
- Related terms: data remanence and destruction (D2 2.4), data states (D2 2.6), asset inventory (D2 2.3), backups (7.10)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-88], [NIST SP 800-53]

## Incident management (7.6)
- Definition (ISC2 framing): **incident** = any attempt to violate security policy, a successful penetration, compromise, or unauthorized access - any event with negative effect on CIA of assets [OSG glossary]; **event** = any occurrence [OSG glossary]. Incident response is the SOP for preventing, detecting, responding to, and returning to normal after violations [OSG glossary]. Management goal: **contain damage, preserve evidence, restore, and improve** - not attribution
- Key facts:
  - ISC2 seven steps (outline 7.6 order) with OSG glosses [ISC2 outline] [OSG glossary]:

  | # | Step | What happens | Example: ransomware on a file server |
  | --- | --- | --- | --- |
  | 1 | **Detection** | IDS/SIEM/user reports; triage event -> incident | EDR alert on mass file renames |
  | 2 | **Response** | Activate CIRT/CSIRT, assess, start evidence handling | CSIRT paged, memory captured, case opened |
  | 3 | **Mitigation** | = **containment**: cut the offending item off from causing further harm | Host VLAN-isolated, account disabled |
  | 4 | **Reporting** | Internal escalation + external (regulators, LE, customers) per **escalation** order | CISO briefed; GDPR 72 h clock noted |
  | 5 | **Recovery** | Remove damaged elements, repair/replace, return to production | Server rebuilt from image, shares restored |
  | 6 | **Remediation** | Root cause, eliminate the vulnerability (= eradication in NIST terms) | VPN flaw that let them in patched |
  | 7 | **Lessons learned** | Review to improve plan/procedures; aka after-action report (AAR) | AAR: add MFA to VPN, update playbook |

  - NIST **SP 800-61 Rev. 2** (Aug 2012) four-phase life cycle: **Preparation -> Detection and Analysis -> Containment, Eradication, and Recovery -> Post-Incident Activity** [NIST SP 800-61]; **Rev. 3** (Apr 2025) withdrew Rev. 2 and reframes as a **CSF 2.0 Community Profile**: Preparation = Govern/Identify/Protect; Detection and Analysis = Detect; Containment/Eradication/Recovery = Respond/Recover; Post-Incident = Identify (Improvement) [NIST SP 800-61]
  - Rev. 2 attack-vector categories (for reporting): External/Removable Media, Attrition (brute force), Web, Email, Impersonation, Improper Usage, Loss or Theft of Equipment, Other [NIST SP 800-61]
  - Containment strategy criteria [NIST SP 800-61]: potential damage/theft, **need for evidence preservation**, service availability, time/resources, effectiveness, duration of the solution
  - **Eradication** examples [OSG glossary]: remove malware, change configs, disable compromised accounts, block IPs/ports (also firing personnel)
  - Team names are interchangeable on the exam: CIRT, CSIRT, IRT [OSG glossary]; SP 800-53 **IR-4** Incident Handling [NIST SP 800-53]
  - Reporting duties: breach-notification laws and regulators (GDPR 72 h [GDPR Art. 33(1)] - D1 1.4), contractual (PCI), law enforcement where a crime is suspected; a **first responder** decision to involve LE changes evidence handling to court standard
- Exam traps / distractors:
  - **ISC2 order vs. NIST order**: ISC2 puts **recovery before remediation** (get the business running, then fix root cause); NIST bundles eradication before recovery. Answer in the vocabulary the question uses
  - **Mitigation = containment**: on the ISC2 list, "mitigation" is the isolation step, not risk mitigation
  - **Remediation vs. recovery**: recovery restores service; remediation removes the cause. Rebuilding from image without patching the vuln = recovery without remediation
  - **Lessons learned** is the final step and feeds preparation; skipping it is the classic "why did it recur" answer
  - **Event vs. incident**: an event is neutral; only negative CIA impact makes an incident
  - "Immediately power off the compromised host" - wrong: destroys volatile evidence and may trigger attacker logic (7.1); isolate at the network instead
  - **Reporting** is a step in the middle, not an afterthought; regulatory clocks start at detection/awareness, not at remediation
  - Detection in the ISC2 model presumes preparation already happened; when a distractor says "preparation" it is quoting NIST
- Related terms: forensics and evidence (7.1), DR response (7.11), breach notification (D1 1.4), SOAR (7.2), containment tools (7.7)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-61], [NIST SP 800-53], [GDPR Art. 33(1)]

## Detection and preventive measures (7.7)
- Definition (ISC2 framing): the operating and tuning of the control stack - firewalls, IDS/IPS, allow/deny listing, third-party services, sandboxing, honeypots/honeynets, anti-malware, ML/AI tools [ISC2 outline]. Exam wants **which control fits which threat and what its legal/operational limits are**, not configuration
- Key facts:
  - Firewall types, roughly in generational order:

  | Type | Decides on | Source |
  | --- | --- | --- |
  | **Static packet-filtering** (screening router) | Header: src/dst address, port | [OSG glossary] |
  | **Application-level** (proxy, e.g. **WAF**) | Full application payload for one protocol | [OSG glossary] |
  | **Circuit-level** (e.g. SOCKS) | Session/handshake validity, not content | [OSG glossary] |
  | **Stateful inspection** | State table tracking every channel; context of the session | [OSG glossary] |
  | **Deep packet inspection** (DPI) | Payload contents; integrated with app-level/stateful | [OSG glossary] |
  | **Next-generation** (NGFW) / **UTM** | All-in-one inline: FW + IDS/IPS + content filtering + more | [OSG glossary] |

  - Firewall architectures [OSG glossary]: **bastion host** (hardened, withstands attack), **screened host** (router filtering in front of a server), **screened subnet** (public servers isolated from internal), **multihomed/dual-homed** host (interfaces on multiple networks)
  - IDS/IPS detection methods [OSG glossary]:

  | Method | Detects by | Weakness |
  | --- | --- | --- |
  | **Knowledge-/signature-/pattern-based** | Match against known attack patterns | Misses **zero-day**; needs updates |
  | **Behavior-/anomaly-based** | Deviation from a learned baseline | **False positives**; learning period |
  | **Heuristic-based** | Compare suspicious programs to known malware examples | Tuning |

  - Placement: **NIDS** sees network traffic, blind to encrypted payloads and host activity; **HIDS** sees host and encrypted-in-transit content after decryption, but consumes host resources and is a target itself [OSG glossary]. **IPS** = inline, prevents; **IDS** = detects/alerts [OSG glossary]
  - **Allow list** = deny by default, only preapproved software runs (aka application allow listing, implicit deny); "whitelist"/"blacklist" are **deprecated** terms that may still appear -> allow list / block (deny) list [OSG glossary]
  - **Sandbox** = quarantine/isolation boundary so suspicious software cannot harm production; works for apps or whole OSes [OSG glossary]
  - Deception [OSG glossary]:

  | Term | Gloss |
  | --- | --- |
  | **Honeypot** | Single fake system that snares intruders; 100% fake, deliberately vulnerable-looking |
  | **Honeynet** | Two or more networked honeypots |
  | **Padded cell** | IDS diverts a detected intruder into a simulated environment where they can do no harm |
  | **Pseudo flaw** | Emulated well-known vulnerability on a honeypot or critical resource |
  | **Darknet** | Unused address space monitored for scanning/attack traffic |
  | **Warning banner** | Electronic no-trespassing sign: activity restricted, audited, monitored |

  - **Enticement** = luring someone to do something (intruder already intent; honeypot = legal); **entrapment** = encouraging an illegal act the person would not otherwise commit (illegal defense for the intruder) [OSG glossary]. Example: a honeypot share named FINANCE-SHARE that the intruder chooses to open = enticement (admissible); an agent persuading an employee to steal data they otherwise would not = entrapment
  - **Anti-malware**: OSG classes it as a **HIDS** example providing **preventive and corrective** control; watches memory, processes, storage [OSG glossary]. Management points: central management, update cadence, layered (gateway + endpoint), and it cannot stop what allow listing can
  - Third-party services: **MSSP**, **SECaaS** (Security as a Service), **MaaS** (Monitoring as a Service) reduce local cost/overhead [OSG glossary]; management view - you outsource execution, **not accountability**; SLA and right-to-audit
  - ML/AI [OSG glossary]: **machine learning** = programming a computer to solve problems from large datasets (often confused with AI); **AI** = simulation of human intelligence processes; **expert system** = accumulated human knowledge applied consistently, with an **inference engine** as second component; **neural network** = long chain of computational decisions (deep learning). Exam framing: ML/AI tools (UEBA, SOAR) **augment** analysts and lower false positives; they are not a substitute for policy or human judgment
- Exam traps / distractors:
  - **Enticement vs. entrapment**: the honeypot that invites an attacker who already chose to attack = enticement (legal); actively coaxing someone into crime = entrapment (their defense). Consult counsel before deploying; the exam wants "legal, but get legal review"
  - **Honeypot vs. padded cell**: honeypot attracts; padded cell receives a diverted intruder detected by the IDS. Example: a bait RDP host sitting in the DMZ = honeypot; the IDS catching a scanner and rerouting it into a simulated network = padded cell
  - **Signature vs. anomaly**: "new attack never seen before" -> anomaly; "too many false alarms" -> anomaly's cost; "must update definitions" -> signature
  - **Stateful vs. application-level**: stateful knows the session, not the payload semantics; WAF understands HTTP
  - **IPS vs. IDS**: inline blocking can cause **self-inflicted outage** on false positives - management trades availability for prevention
  - **Allow list vs. deny list**: allow list is the stronger posture (implicit deny); deny listing = signature AV logic and always incomplete. Example: allow list = only signed, approved binaries run, so a new ransomware variant fails by default; deny list = AV blocks known hashes, the new variant runs
  - **Sandbox vs. honeypot**: sandbox isolates *your* suspicious code; honeypot attracts *their* activity
  - **Anti-malware as preventive**: OSG says preventive **and** corrective (it removes). Distractor: "detective only"
  - Outsourcing to an MSSP transfers work, not liability
- Related terms: logging/monitoring (7.2), incident containment (7.6), NAC and endpoint security (D4 4.2), warning banners as legal notice (7.1)
- Sources: [ISC2 outline], [OSG glossary]

## Patch, vulnerability, and change management (7.8, 7.9)
- Definition (ISC2 framing): **patch management** = program ensuring relevant patches are evaluated, tested, deployed, and **audited to verify they stay applied** [OSG glossary]; **vulnerability management** = program to detect weaknesses; **vulnerability scans** (regular technical scans) and **vulnerability assessments** (broader evaluation) are its two elements [OSG glossary]; **change management** = process preventing unintended outages: request -> review -> approve -> test -> implement -> document [OSG glossary]
- Key facts:
  - Patch lifecycle (management order): 1. **Evaluate** (applicability, criticality) 2. **Test** in non-production 3. **Approve** via change management 4. **Deploy** (staged, automated) 5. **Verify/audit** that patches are present and not removed [OSG glossary]
  - **Hotfix** = modestly tested patch for one problem; update/patch = general fix [OSG glossary]. Emergency/out-of-band patches still go through change management, even if approval is expedited and documentation follows
  - Vulnerability management loop: `inventory -> scan/assess -> prioritize (CVSS + exposure + asset value) -> remediate or mitigate or accept (documented exception) -> rescan`. **CVE** = identifier list, **CVSS** = severity score (FIRST), scanner findings need **validation** (false positives) [CVE.org FAQ] [FIRST CVSS] [NIST SP 800-115 Sec. 7.3]
  - Not every finding gets patched: compensating controls and **risk acceptance by the owner** are valid outcomes; unpatched != unmanaged if documented
  - SP 800-53 **SI-2** Flaw Remediation, **CM-3** Configuration Change Control [NIST SP 800-53]
  - Change management elements the exam names: **change advisory/control board** (CAB/CCB) approval, **rollback/back-out plan**, testing, scheduling in maintenance windows, **versioning**, documentation and communication to stakeholders, **emergency change** path with retrospective review [NIST SP 800-53 CM-3, CM-3(1), CM-3(2), CM-2(3)] [NIST SP 800-128 Sec. 2.3.8, 3.1.1, 3.3, 3.4.1]
  - Change management's security purposes: prevent **unintended outages**, prevent changes that undo security (reopened ports, disabled logging), preserve the **baseline** (7.3), create an audit trail of who changed what when
  - Change types (ITIL-style): standard (pre-approved, low risk), normal (full CAB), emergency (expedited) [unverified - public axelos.com/peoplecert.org pages do not define the types; ITIL 4 Change Enablement practice guide is paywalled]
- Exam traps / distractors:
  - **Patch vs. vulnerability management**: a patch fixes one flaw; vuln management includes misconfigurations, missing controls, EOL software that has no patch. Example: EOL server with SMBv1 has no patch; vuln management still owns it via isolation, compensating control, or documented acceptance
  - **Scan vs. assessment vs. pen test**: scan = automated, finds candidates; assessment = evaluates and prioritizes; pen test = exploits (D6 6.2). Example: scanner flags a CVE on 40 hosts = scan; analyst ranks the 6 internet-facing ones first = assessment; red team exploits one = pen test
  - "Deploy the critical patch immediately to all systems" - the ISC2 answer is **test first**, then staged rollout via change management, unless active exploitation justifies an emergency change (still documented)
  - **Verification** is the step most often omitted in distractors: audit that the patch is present (patches get rolled back, images get redeployed)
  - **Change management vs. configuration management** (7.3): approval process vs. state tracking; the change record updates the baseline. Example: opening TCP 8443 is a change record; the baseline then updates so the next CM scan does not flag 8443 as drift
  - Emergency changes skip the *timing* of approval, never the *documentation*. Example: Log4Shell patch pushed overnight on the CISO's verbal approval; CAB reviews and records it next morning
  - Change management is a control against **integrity/availability** loss from authorized users, not against attackers
- Related terms: configuration management (7.3), vulnerability assessment and pen testing (D6 6.2), SDLC change management (D8 8.1), EOL/EOS (D2 2.5)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53], [NIST SP 800-128], [NIST SP 800-115], [CVE.org], [FIRST CVSS], [unverified]

<!-- REVIEW -->
## Recovery strategies - backups, sites, resilience (7.10)
- Definition (ISC2 framing): **recovery strategies** = practices, policies, procedures to recover the business [OSG glossary]; outline 7.10 = backup storage strategies (cloud, onsite, offsite), recovery site strategies (cold vs. hot, resource capacity agreements), multiple processing sites, system resilience/HA/QoS/fault tolerance [ISC2 outline]. Strategy is chosen by **RTO/RPO/MTD** from the BIA (D1 1.7), then cost
- Key facts:
  - Backup types [OSG glossary]:

  | Type | Copies | Archive bit | Restore needs |
  | --- | --- | --- | --- |
  | **Full** | Everything | Cleared | Last full only |
  | **Incremental** | Changed since last full **or incremental** | Cleared | Last full + **every** incremental in order |
  | **Differential** | Changed since last **full** | **Not** cleared | Last full + **last** differential only |

  - Trade-off: incremental = fastest backup, slowest restore; differential = slower growing backups, two-set restore. Example: Sunday full, Thursday restore - differential = Sun full + Thu; incremental = Sun full + Mon + Tue + Wed + Thu
  - Database/electronic strategies [OSG glossary]:

  | Strategy | Mechanism | RPO | Example |
  | --- | --- | --- | --- |
  | **Electronic vaulting** | Bulk transfer of backups to a remote site | Hours-day | Nightly backup set pushed to the offsite vault |
  | **Remote journaling** | Transaction logs since last bulk transfer shipped remotely | Minutes-hour | Transaction log shipped every 15 min |
  | **Remote mirroring** | Live database server at the backup site; most advanced | Near zero | Standby DB applies every write as it happens |

  - Storage location: **onsite** (fast restore, same-disaster exposure), **offsite** (survives site loss, slower; needs transport chain of custody + encryption), **cloud** (elastic, geographically separate; contract, egress cost, exit strategy). Keep at least one copy off-site and offline/immutable against ransomware [NIST SP 800-34 Sec. 3.4.2 (offsite)] [CISA #StopRansomware Guide Part 1 (offline, encrypted; immutable storage with caution)]. SP 800-53 **CP-9** System Backup [NIST SP 800-53]
  - Recovery sites [OSG glossary] [NIST SP 800-34]:

  | Site | Has | Ready in | Cost |
  | --- | --- | --- | --- |
  | **Cold** | Space, power, HVAC, telecom; few/no resources | Weeks [unverified - SP 800-34 Sec. 3.4.3 says only "Long" setup] | Low |
  | **Warm** | Equipment + data circuits, **no current data** | Days-hours | Medium |
  | **Hot** | Full servers, workstations, comms; **hours** | Hours | Medium/high |
  | **Mirrored** | Fully redundant, real-time mirroring; identical | Immediate | Highest |
  | **Mobile** | Self-contained trailer/transportable shell | Variable | Variable |

  - Agreements [OSG glossary]: **mutual assistance agreement** (MAA, aka **reciprocal agreement**) - two orgs pledge to share facilities in disaster (cheap; rarely enforceable, both may be hit, capacity/compatibility doubts); **service bureau** - leases computer time under contract; **resource capacity agreement** - cloud provider guarantees resources needed for the client's DR operations; **MOU** - intent, not typically binding
  - **Multiple processing sites**: run production across two or more sites so loss of one degrades rather than stops (active/active); SP 800-53 **CP-7** Alternate Processing Site [NIST SP 800-53]
  - Resilience vocabulary [OSG glossary]:

  | Term | Gloss | Example |
  | --- | --- | --- |
  | **Fault tolerance** | Suffer a fault, keep operating without data loss (RAID, redundant servers) | RAID 5 disk dies, users notice nothing |
  | **High availability** | Redundant components -> quick recovery from brief disruption; load balancing + failover; measured as % of year | Node fails, cluster back in 30 s |
  | **Failover** | Redirect workload to backup when primary fails (aka switchover); heartbeat-triggered | Heartbeat lost, standby firewall takes the VIP |
  | **Clustering** | Load balancing + fault tolerance across nodes | Three web nodes behind a load balancer |
  | **QoS** | Manage throughput, bit rate, packet loss, latency, jitter, delay, availability | VoIP prioritized over backup traffic |
  | **SPOF** | Any element whose loss causes significant downtime | The single unpaired core switch |

  - RAID [OSG glossary]: **RAID 0** striping, no fault tolerance; **RAID 1** mirroring (duplexing = separate controllers); **RAID 5** striping with parity (survives one disk). **RAID 6** double parity (two disks) [SNIA Dictionary]; **RAID 10** striped mirrors: RAID 0 stripe across RAID 1 mirror sets, survives one failure per mirror set [SNIA Dictionary]. Correction (audit 2026-09-28): was "mirrored stripes", which describes RAID 0+1 (a mirror of two stripe sets); SNIA defines RAID 10 as a stripe over mirrored sets
  - Metrics [OSG glossary]: **MTBF** anticipated failure interval; **MTTF** time to first failure; **MTTR** time to repair/restore; **MTD/MTO** max downtime before irreparable harm; **RTO** feasible recovery time (must be <= MTD); **RPO** acceptable data loss
- Exam traps / distractors:
  - **Redundancy vs. fault tolerance** = mechanism vs. property [OSG glossary]: redundancy = *spare components* (a means; a cold spare on the shelf is redundancy and the system still goes down); fault tolerance = the *ability to keep operating when a component fails* (redundancy + detection + automatic failover). Stem that paraphrases "available when elements fail" -> **fault tolerance**; redundancy is the ingredient offered as a distractor. Load balancing = performance/distribution; DR = restore *after* downtime. Example: payment system must stay up if a server dies -> fault tolerance, NOT redundancy (missed 2026-10-05: picked redundancy)
  - **Site tier for a DR *test***: the test window is the constraint — hot (gear + current data, hours) is the only tier that supports a parallel/full-interruption test inside a weekend; warm burns the window loading data; cold has nothing to exercise. "**All of the above**" (cold, warm, and hot) is the comprehensive-sounding non-answer — combined options lose on "which BEST" questions and only win on list questions. Shift: "least expensive site still testable" -> warm; "mirrored" = already live, beyond hot. Example: weekend DR test -> hot site, NOT "cold, warm, and hot" (missed 2026-10-05: picked all three)
  - **Symptom -> metric** [OSG glossary]: missing recent transactions -> **RPO** (age of last good copy); system took too long to return -> **RTO**; restored data came back *wrong/inconsistent* -> **WRT** (the integrity-verification window: reconciliation, consistency checks, interface tests); business could not survive the total outage -> **MTD** (= RTO + WRT). "Data problem -> RPO" is the reflex trap: RPO is *quantity/age* lost, WRT is *correctness* of what came back; "RPO too short" is the wrong direction (shorter = less loss). Example: DR simulation finds restored records invalid -> inadequate WRT, not RPO (missed 2026-10-05: picked RPO)
  - **Incremental vs. differential**: the only difference is the **archive bit**; "fastest nightly backup" -> incremental; "fastest restore short of full" -> differential
  - **Warm vs. hot**: warm has hardware but **no data**; the data is the expensive, hard part. "Hours" -> hot; "days" -> warm. Example: warm = racked servers at the colo, you ship tapes and load data; hot = same servers with last night's data already loaded; mirrored = already serving traffic
  - **Mirrored site vs. hot site**: hot needs data restore and activation; mirrored is already live
  - **Reciprocal agreement** weaknesses are the exam point, not its cost advantage: enforceability, shared regional disaster, capacity. Example: two hospitals in the same city pledge each other's data center, then the hurricane hits both
  - **Electronic vaulting vs. remote journaling**: batch backups vs. transaction logs; mirroring = live server
  - **Pillar word in the stem selects the control family**: "reliability/integrity of the *data*" -> off-site copy (**vaulting**; journaling holds only deltas and needs a base backup); "keep *operating*" -> power (**generator** for duration > **UPS** for bridge/graceful shutdown). A blackout is scenery; it names the threat, not the pillar. Practitioner reflex "blackout -> power" is the trap. Example: "ensure reliability of client data during a facility blackout" -> vaulting, NOT UPS (missed 2026-10-04: picked UPS)
  - **Fault tolerance vs. high availability**: FT = no interruption on component failure; HA = brief interruption then recovery. RAID 0 is neither
  - **RTO vs. RPO**: time to restore service vs. how much data (time) you can lose; RPO drives backup **frequency**, RTO drives **site type**. Example: RPO 1 h -> hourly journaling, nightly tape fails it; RTO 4 h -> hot/warm site, a cold site cannot make it
  - **QoS** is a performance/availability concept, not a security control; it appears as a distractor for "fault tolerance"
  - Backup that is never **test-restored** is not a recovery strategy (D6 6.3 backup verification)
- Related terms: BIA/MTD/RTO/RPO (D1 1.7), DR processes and DRP testing (7.11, 7.12), media protection (7.5), cloud shared responsibility (D3 3.5)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-34], [NIST SP 800-53], [SNIA Dictionary], [CISA], [unverified]

<!-- REVIEW -->
## Disaster recovery processes and DRP testing (7.11, 7.12)
- Definition (ISC2 framing): **disaster** = event bringing great damage or destruction; **disaster recovery** = recovering after a disaster destroyed the ability to perform mission-critical services; **DRP** = detailed procedures to restore partial or normal operations after a significant damaging event [OSG glossary]. DRP is the **IT/technical** subset of BCP (7.13). Outline 7.11 = response, personnel, communications, assessment, restoration, training/awareness, lessons learned; 7.12 = read-through/tabletop, walkthrough, simulation, parallel, full interruption, communications [ISC2 outline]
- Key facts:
  - DR process elements [ISC2 outline] with framing:

  | Element | Management content |
  | --- | --- |
  | **Response** | Activation criteria, who declares a disaster, first-responder duties; **life safety first** |
  | **Personnel** | Recovery team roles, alternates, contact tree; families and welfare of staff |
  | **Communications** | Out-of-band methods (phone trees, SMS, satellite), pre-written statements, single spokesperson, regulators/customers/media |
  | **Assessment** | Damage/outage assessment decides restore-in-place vs. alternate site |
  | **Restoration** | Bring facility and environment back to workable state [OSG glossary]; return from alternate site with **least critical** functions first |
  | **Training and awareness** | Everyone knows their role; new hires briefed; annual refresh |
  | **Lessons learned** | After-action review after every activation *and* every test; update the plan |

  - SP 800-34 Rev. 1 (May 2010) seven-step contingency planning process: 1. policy statement 2. **BIA** 3. identify preventive controls 4. create contingency strategies 5. develop the plan 6. testing, training, exercises (**TT&E**) 7. maintenance [NIST SP 800-34]. Plan family: BCP, COOP, Crisis Communications Plan, CIP Plan, Cyber Incident Response Plan, DRP, ISCP, **OEP** (occupant emergency plan) [NIST SP 800-34]
  - Test types, least to most disruptive (outline order) [ISC2 outline] [OSG glossary]:

  | # | Test | What happens | Disruption |
  | --- | --- | --- | --- |
  | 1 | **Read-through** / checklist | Copies distributed to team members for individual review | None |
  | 2 | **Structured walk-through** / **tabletop** | Group discusses steps, roles; verbal, minimal visual aids | None |
  | 3 | **Simulation** | Scenario given, team develops response; some measures actually tested; may interrupt **noncritical** activities | Low |
  | 4 | **Parallel** | Personnel relocate to alternate site and activate it; production continues at primary | Medium |
  | 5 | **Full interruption** | Primary shut down, operations moved to the alternate site | High; real risk |

  - SP 800-34 uses two exercise classes: **tabletop** (discussion-based) and **functional** (execute roles, e.g. failover, notifications); low-impact systems -> tabletop, moderate -> functional, high -> full-scale functional [NIST SP 800-34]
  - Test communications: inform **stakeholders** before/after, publish test status, notify **regulators** where tests could look like real outages or where testing is a compliance obligation [ISC2 outline]
  - Management view: every test must have measurable success criteria, and results must feed **plan maintenance**; an untested plan is assumed broken. Full interruption needs senior management sign-off because the test itself can cause the disaster
- Exam traps / distractors:
  - **Walk-through vs. tabletop vs. read-through**: read-through is **individual**; structured walk-through/tabletop is the **group** discussion; OSG treats structured walk-through and tabletop as near-synonyms. Example: each manager reads the ransomware playbook at their desk = read-through; the team talks it through in a conference room = tabletop
  - **Simulation vs. parallel**: simulation may touch noncritical operations; parallel actually **activates the alternate site** without stopping production. Example: simulation = team runs the call tree and restores one noncritical test server from tape; parallel = failover site brought up and processing alongside prod
  - **Parallel vs. full interruption**: both use the alternate site; only full interruption **stops the primary**. Example: prod data center powered down Saturday night and the DR site carries real customers = full interruption
  - "Most realistic test" = full interruption; "most realistic test acceptable to most orgs" = parallel
  - **Restoration order**: move the **least critical** functions back to the primary site first (the primary is unproven); move **most critical** functions to the alternate site first during the disaster. Example: after the flood, payroll moves to the hot site first; coming home, the intranet wiki returns to HQ first and payroll last
  - **DRP vs. BCP**: DRP = restore IT/systems after the disaster; BCP = keep the business running before/during; DRP is a component of BCP. Example: tellers switch to paper slips and calls reroute to another branch = BCP; rebuilding the core banking system at the hot site = DRP
  - **Lessons learned** applies after tests too, not only after real events
  - **Due care vs. due diligence in DRP terms** [OSG glossary]: writing the plan, roles, declaration procedures, personnel catalog = **due diligence** (knowing/planning); **exercising/testing** the plan = **due care** (practicing, maintaining after deployment). An untested plan is not reasonable care — "which best *demonstrates/ensures* due care" -> successful testing, not documentation. Validation beats governance when the stem says ensure / demonstrate / verify / confidence; governance beats validation when it asks about authority or decision. **Prerequisite != success factor**: "most critical to *build* the plan" -> BIA / asset inventory (input); "most critical to the plan's *success/effectiveness*" -> **regular drills and tests** (validation; also trains staff and exposes inventory gaps); "most important *overall* for the BCP program" -> **senior management support** when offered. Example: DRP success -> drills and tests, NOT the critical-asset inventory (missed 2026-10-05: picked inventory) Example: options roles outline / declaration procedure / personnel catalog / successful DRP tests -> tests (missed 2026-10-05: picked roles and responsibilities)
  - DR communications distractor: relying on the corporate email/phone system that is itself down - answer = **out-of-band** predefined methods
- Related terms: recovery strategies (7.10), BC planning (7.13), BIA/MEF/COOP (D1 1.7), incident lessons learned (7.6), OEP (7.15)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-34]

## Business continuity planning and exercises (7.13)
- Definition (ISC2 framing): **BCP** = contingency planning that keeps the business running through disruption to vital resources: assess risks to processes, their impact, develop response scenarios [OSG glossary]. Domain 1 (1.7) owns the analysis (BIA, dependencies); Domain 7 owns **participation, execution, and exercising** [ISC2 outline]
- Key facts:
  - BCP phases (OSG structure): 1. **project scope and planning** (business org analysis, team selection, resource requirements, legal/regulatory) 2. **BIA** (identify priorities, risk identification, likelihood, impact, resource prioritization) 3. **continuity planning** (strategy development, provisions and processes) 4. **approval and implementation** (senior management sign-off, plan documentation, training) [unverified - OSG chapter structure, verify against the OSG BCP chapter]
  - **BIA** identifies critical resources, threats, likelihood, and impact [OSG glossary]; produces **MTD**, then RTO/RPO drive 7.10 strategy choices
  - **COOP** = actions and preventive measures preventing downtime and maintaining availability; includes security policy, BCP, DRP [OSG glossary]; in US federal use it means continuing **mission-essential functions** at an alternate site (D1 1.7 MEF/COOP entry)
  - Exercises: same ladder as DRP tests (7.12) but scoped to business processes - tabletop for executives and process owners, functional for a single department's manual workarounds, full-scale rarely. SP 800-34 requires TT&E and plan maintenance as distinct steps [NIST SP 800-34]
  - Senior management role: **approve, fund, and champion** the plan; sign the acceptance of residual risk [unverified]; the plan is a **living document** reviewed at least annually and on major change [NIST SP 800-34 Sec. 3.1 sample policy (annual), Sec. 3.6 (organization-defined frequency or significant change)]
  - Personnel are the first priority in every ISC2 continuity question - "people before property before process"
- Exam traps / distractors:
  - **BCP vs. DRP**: BCP is strategic and business-wide (keep operating); DRP is tactical and IT-focused (restore); DRP nests inside BCP
  - **BCP vs. COOP**: COOP = continuity of the *organization's* essential functions (often government usage); BCP = the broader business planning process. Example: COOP = the agency keeps issuing benefit payments from an alternate facility; BCP = the whole plan around it - vendors, HR, communications, return to normal
  - **BIA belongs to planning** (D1), not to recovery execution - a question about "identify critical functions" is BIA, not DR. Example: "which systems must be back within 4 hours?" = BIA; "bring the hot site up" = DR
  - "Who approves the BCP?" -> **senior management**, not the CISO or the BCP team
  - **Exercise vs. test**: ISC2 uses "exercise" for BC (process/people) and "test" for DRP (technical), but the disruption ladder is identical. Example: finance walks through month-end close with the ERP assumed down = exercise; IT fails the ERP over to the DR site = test
  - Insurance is part of recovery strategy (**risk transfer**), not a substitute for a plan
- Related terms: BCP and BIA (D1 1.7), MEF/COOP (D1 1.7), DR processes and testing (7.11, 7.12), recovery strategies (7.10)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-34], [unverified]

## Physical security and personnel safety (7.14, 7.15)
- Definition (ISC2 framing): physical controls deter, delay, detect, and respond to unauthorized physical access; **human life and safety always outrank asset protection**. Outline 7.14 = perimeter and internal security controls; 7.15 = travel, security training/awareness (insider threat, social media, two-factor authentication fatigue), emergency management, duress [ISC2 outline]. Site *design* (CPTED, layout, utilities, fire) is D3 3.8-3.9; D7 is *operating* the controls
- Key facts:
  - Layered order: `deter -> deny -> detect -> delay -> respond`; perimeter controls first, then building, then room/rack
  - **CPTED** (Crime Prevention Through Environmental Design): design the environment to influence offender decisions; **natural surveillance** (open sightlines, obstacle-free entrances), natural **access control**, **territorial reinforcement** [OSG glossary]
  - Perimeter controls:

  | Control | ISC2 gloss | Source |
  | --- | --- | --- |
  | **Fence** | Perimeter-defining device separating protection levels; 3-4 ft deters casual, 6-7 ft too hard to climb easily, 8 ft + 3 strands barbed wire deters determined intruders | [OSG glossary] heights [unverified - not in OSG glossary; OSG body text only] |
  | **PIDAS** | Two-three fences; main 8-20 ft (electrified/razor wire/touch sensors), outer 4-6 ft keeps animals and casual trespassers off the main fence | [OSG glossary] |
  | **Lighting** | Most common perimeter control; discourages casual intruders; NIST-cited 2 ft-candles at 8 ft height | [OSG glossary] number [unverified - no NIST source found] |
  | **Bollards** | Stop vehicles ramming buildings | [OSG glossary] |
  | **Security guards** | Monitor and enforce; only control that can **make judgments**; costly, unreliable, subject to social engineering | [OSG glossary] framing [unverified - glossary says only monitor and enforce] |
  | **Guard dogs** | Perimeter control; deterrent + detective; liability and cost | [OSG glossary] |
  | **Security cameras / CCTV** | Record events in the lens area; live feed or recording; **detective** not preventive | [OSG glossary] |

  - Entry controls [OSG glossary]:

  | Control | Gloss |
  | --- | --- |
  | **Access control vestibule** (person trap; **mantrap** deprecated) | Double doors; contain the subject until identity is verified |
  | **Turnstile** | One person at a time, often one direction |
  | **Electronic access control** (EAC) | Electromagnet + credential reader + door-close sensor |
  | **Badge / smartcard / proximity card** | Physical ID and electronic access token |
  | **Lock** | Keeps door/gate/container closed; conventional, electronic, biometric |

  - Internal detection [OSG glossary]:

  | Sensor / alarm | Detects / does |
  | --- | --- |
  | **Infrared (heat-based) motion detector** | Changes in heat levels/patterns |
  | **Wave pattern** | Disturbance in ultrasonic/microwave reflection |
  | **Capacitance** | Change in electrical/magnetic field around an object |
  | **Photoelectric** | Change in visible light in dark rooms |
  | **Infrared linear beam** | Something crosses a threshold |
  | **Dual-technology sensor** | Two technologies to cut false alarms |

  | Alarm type | Behavior |
  | --- | --- |
  | **Deterrent** | Engages locks, shuts doors - makes further intrusion harder |
  | **Repellent** | Siren, lights - drives the intruder off |
  | **Notification** | Silent to intruder; logs and notifies guards/admins/law enforcement |

  - Social engineering at the door [OSG glossary]: **piggybacking** = convincing an authorized person to let you through; **tailgating** = following an authorized person who is **unaware**; **shoulder surfing** = observing screen/keyboard. Countermeasure: vestibules, turnstiles, guard, culture of challenging
  - SP 800-53 **PE-3** Physical Access Control [NIST SP 800-53]
  - Personnel safety (7.15):

  | Concern | Control |
  | --- | --- |
  | **Travel** | Pre-trip briefing, minimal/loaner devices, no untrusted Wi-Fi [CISA travel tip card], encrypted storage, know local laws (border device search, crypto import), check-in schedule, kidnapping/duress awareness [unverified] |
  | **Duress** | **Duress system**: button or code sends a distress call to a monitoring entity that responds per procedure; useful for lone workers [OSG glossary]; silent/duress code word for coerced logins or alarm disarm |
  | **Emergency management** | Plans and practices for personnel safety and security after a disaster [OSG glossary]; **OEP** guides minimizing threats to life, preventing injury, managing duress, handling travel, safety monitoring, protecting property [OSG glossary] [NIST SP 800-34] |
  | **Insider threat awareness** | Recognize indicators; reporting channels; pair with SoD/job rotation (7.4) |
  | **Social media** | Oversharing enables recon/pretexting; policy on travel posts and org info; **social media analysis** in hiring is a D1 1.8 control [OSG glossary] |
  | **2FA / MFA fatigue** (prompt bombing) | Attacker floods push prompts until user approves; counter with number matching [CISA number matching fact sheet], rate limits [unverified - not in CISA fact sheets], phishing-resistant authenticators [CISA phishing-resistant MFA fact sheet], and training to **report** unexpected prompts [CISA number matching fact sheet] |

- Exam traps / distractors:
  - **Life safety first**: if an option protects people and another protects data, people wins - even in a data-center fire or evacuation question. Fire door **fail-safe** (opens); vault **fail-secure** (locks) - the human-occupied space fails safe. Example: power fails - the data-center door unlocks so staff can leave (fail-safe); the server vault stays locked (fail-secure)
  - **Piggybacking vs. tailgating**: consent vs. unaware; both defeated by the **access control vestibule**, not by badges alone. Example: "hold the door, I left my badge upstairs" = piggybacking; slipping in behind someone before the door closes = tailgating
  - **Deterrent vs. detective**: lighting, fences, signage, dogs = deterrent; cameras, motion sensors, guards = detective (guards also respond). CCTV only *prevents* through deterrence when visible. Example: lit, fenced lot with a "CCTV in use" sign = deterrent; the motion sensor tripping at 02:00 = detective; the guard who walks over = response
  - **Guards** are the only control that adapts and makes decisions; the exam's "which control can respond to an unexpected situation" -> guard
  - **Mantrap** is deprecated vocabulary for access control vestibule/person trap; recognise it, answer with the new term
  - **Fence height**: 8 ft with barbed wire = determined intruder; 3-4 ft = casual only
  - **Duress vs. emergency management**: duress = individual under coercion right now; emergency management = organizational plan after a disaster. Example: the night operator keys the second disarm code that silently alerts the monitoring company = duress; the post-earthquake evacuation and roll-call plan = emergency management
  - **MFA fatigue** is a *user awareness* item on the outline, not just a technical control question - the "best" answer often includes training to report
  - Physical IDS (burglar alarm) is a valid "IDS" on the exam [OSG glossary]; don't assume network
- Related terms: site and facility design/controls (D3 3.8, 3.9), fail-safe vs. fail-secure (D3 3.1), personnel security policies and social media checks (D1 1.8), SoD/job rotation (7.4), OEP (7.11)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53], [NIST SP 800-34], [CISA], [unverified]
