# Domain 5: Identity and Access Management (IAM)

## Control physical and logical access to assets (5.1)
- Definition (ISC2 framing): access control = giving or restricting **subject** access to **objects** (resources), usually via an ACL [OSG glossary]; subject = active entity that exercises access (user, process, program); object = passive entity that provides data (file, database, printer) [OSG glossary]. Outline 5.1 lists six asset classes to protect: information, systems, devices, facilities, applications, services [ISC2 outline]
- Key facts:
  - **Physical access controls** restrict physical access / direct contact with systems or areas; **logical (technical) access controls** are hardware/software mechanisms (encryption, smartcards, passwords, ACLs) [OSG glossary]

  | Asset class | Typical controls | Exam angle |
  | --- | --- | --- |
  | Information | Classification labels, encryption, DLP, file ACLs | Protect the data, not just the host |
  | Systems | Logon + MFA, host hardening, privileged access | Server/OS layer |
  | Devices | Device certificates, MDM, NAC (802.1X) | Device identity != user identity |
  | Facilities | Badges, locks, guards, **access control vestibule** | Vestibule holds subject until authenticated |
  | Applications | **Constrained interface**, app-level roles | Hide/disable functions by privilege |
  | Services | API keys, service accounts, OAuth scopes | Non-person entities still need IAM |

  - **Access control vestibule**: double set of doors, often guarded, contains a subject until identity + authentication are verified; the term **mantrap** is deprecated [OSG glossary]
  - **Constrained (restricted) interface**: application restricts what users can do or see based on assigned privileges [OSG glossary]
  - **Content-dependent** access control = decision based on the object's *payload* (e.g. hide salary column); **context-dependent** = based on surroundings/sequence (time of day, prior step completed) [OSG glossary]
  - **Access control matrix**: subjects x objects; each *column* = **ACL** (object-focused), each *row* = **capability table/list** (subject-focused) [OSG glossary]
  - **Biometrics** are authentication for logical access but *identification* for physical access (face at a door identifies who entered) [OSG glossary]
  - Managerial view: access control is a *system* (policy -> identity -> authentication -> authorization -> audit) layered across physical and logical, not a single product; **defense in depth** applies (badge + logon + ACL)
- Exam traps / distractors:
  - **ACL vs capability table**: "which subjects can touch this object" -> ACL; "what can this subject touch" -> capability table
  - **Content- vs context-dependent**: "based on the data itself" -> content; "based on time/location/sequence" -> context
  - **Mantrap** offered as the current term -> vestibule; either way it is a *physical preventive* control, not detective
  - A badge reader is a **physical** control even though it is electronic; classify by what it protects (the facility), not by its circuitry — SP 800-53 places "physical access control systems or devices" beside guards under **PE-3 Physical Access Control** [NIST SP 800-53 PE-3 a.2]
  - **Subject vs object** flips: a process reading a file is the subject; the same process being killed by admin is the object
  - "Facilities" and "devices" appear as distinct outline items — physical security detail lives in 7.14; 5.1 tests the *mapping* of control type to asset class
- Related terms: least privilege / need to know (7.4), defense in depth (3.1), NAC (4.2), physical security (7.14), DLP (2.6), authorization models (5.4)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53]

## Identification, authentication, and AAA (5.2)
- Definition (ISC2 framing): **AAA** (authentication, authorization, accounting) actually names five elements — identification, authentication, authorization, auditing, accounting [OSG glossary]. Outline 5.2: design an identification and authentication strategy for people, devices, and services; includes MFA and password-less authentication [ISC2 outline]

  | Element | ISC2 gloss | Distinguisher |
  | --- | --- | --- |
  | **Identification** | Subject *professes* an identity; accountability begins here | Username, ID badge — a claim, not proof |
  | **Authentication** | Verifying the claimed identity via factors | Password, token, biometric |
  | **Authorization** | Ensuring requested activity is allowed given assigned rights | ACLs, roles, policy |
  | **Auditing** | Recording subject activity into logs | Makes accounting possible |
  | **Accounting/accountability** | Holding the subject responsible; needs tracked identity + actions | Requires strong authN + audit trail |

  [OSG glossary]
- Key facts:
  - Authentication factors [OSG glossary]:

  | Factor | Type | Examples |
  | --- | --- | --- |
  | Something you **know** | Type 1 | Password, PIN, passphrase, **cognitive password** / knowledge-based questions |
  | Something you **have** | Type 2 | Smartcard, token device, memory card, phone |
  | Something you **are** | Type 3 | Fingerprint, iris, retina, face, hand geometry, voice |
  | Somewhere you **are** | — | Geolocation, IP range |
  | Something you **do** | — | Signature dynamics, keystroke dynamics, gesture |
  | Something you **exhibit** | — | Discoverable fact about subject/connection (local vs remote, encrypted vs not) |

  - **MFA** = two or more *different* factors; password + PIN is *one* factor used twice [OSG glossary]. **Strong authentication** = two or more factors "even if those factors aren't unique" [OSG glossary] — looser than MFA
  - **NIST SP 800-63B-4** (Digital Identity Guidelines: Authentication and Authenticator Management, 2025) authenticator types [NIST SP 800-63B]:

  | Authenticator type | Factor(s) | Note |
  | --- | --- | --- |
  | Password (memorized secret) | Know | Sec. 3.1.1 |
  | Look-up secret | Have | Printed recovery codes |
  | Out-of-band device | Have | Push/SMS; **PSTN/SMS = restricted** (3.2.9) |
  | Single-factor OTP | Have | TOTP app, hardware token |
  | Multi-factor OTP | Have + know/are | Token unlocked by PIN/biometric |
  | Single-factor cryptographic | Have | FIDO security key, certificate |
  | Multi-factor cryptographic | Have + know/are | PIV smartcard + PIN, passkey + biometric |

  - SP 800-63B-4 password rules: min **15 chars** single-factor / **8** when part of MFA, allow >= 64; composition rules **SHALL NOT** be imposed; **no periodic rotation** (change only on evidence of compromise); check against **blocklists** of common/compromised passwords [NIST SP 800-63B]. Contrast: OSG **password complexity** = 3 of 4 character classes, no username/real name [OSG glossary] — the exam may still frame complexity/age as controls; if a question cites NIST, pick length + blocklist over composition/rotation
  - **Assurance levels** (SP 800-63-4 Sec. 3.3.2; Rev. 4 published 2025, supersedes 800-63-3) [NIST SP 800-63-4]:

  | Level | IAL (proofing) | AAL (authentication) | FAL (federation) |
  | --- | --- | --- | --- |
  | 1 | Core attributes validated; some self-asserted; remote OK | Single- or multi-factor | Signed assertion; bearer OK |
  | 2 | More evidence, rigorous validation; remote or on-site | **Two distinct factors**; phishing-resistant option offered | Single-RP audience, injection protection, pre-established trust |
  | 3 | **On-site attended** by trained agent + **biometric** collected | Phishing-resistant **crypto authenticator**, non-exportable key, hardware FIPS 140 | **Holder-of-key** / bound authenticator; protects against IdP compromise |

  - Reauthentication (SP 800-63B-4): AAL2 24 h overall / 1 h idle; AAL3 12 h overall / 15 min idle [NIST SP 800-63B]
  - OTP tokens [OSG glossary]: **synchronous dynamic** = time-based, clocks synced -> **TOTP** (RFC 6238, default 30 s step) [RFC 6238]; **asynchronous dynamic** = counter/challenge-response -> **HOTP** (RFC 4226, HMAC-SHA-1 counter) [RFC 4226]. **Static token** = swipe card/USB key, identity not really authentication [OSG glossary]
  - Biometrics [OSG glossary]:

  | Metric | Meaning | Sensitivity |
  | --- | --- | --- |
  | **FRR** (false rejection) — Type I | Valid subject rejected; device too sensitive | Rises as sensitivity rises |
  | **FAR** (false acceptance) — Type II | Invalid subject accepted; not sensitive enough | Falls as sensitivity rises |
  | **CER** (crossover error rate) | Point where FAR = FRR; compare devices — **lower = more accurate** | Tune toward FRR for high-security |
  | Throughput | Scan + authenticate time; ~6 s or faster for acceptance | Usability |
  | Enrollment | Registering the reference template; secure enrollment requires physical proof of identity | Identity proofing dependency |

  - Physiological (fingerprint, face, retina, iris, palm, hand geometry, voice) vs behavioral (signature dynamics, keystroke dynamics: flight and dwell time) [OSG glossary]
  - **Password-less / phishing-resistant**: **FIDO2 / WebAuthn** (W3C Recommendation, Level 3, 2026) public-key credentials **scoped to the relying-party origin**, so a phishing site cannot replay them; roles relying party / authenticator / client; CTAP2 carries authenticator transport [W3C WebAuthn]. **Passkeys** = WebAuthn **discoverable credentials** (spec lists "Passkey" as a synonym, Sec. 4); **synced** (multi-device) or **device-bound** (single-device) [W3C WebAuthn Sec. 4, 1.2.1-1.2.2] [FIDO Alliance]. **PIV** (Personal Identity Verification) smartcard per **FIPS 201-3** (2022) = have + know in one device; the U.S. DoD variant is the **CAC** [FIPS 201-3] [OSG glossary]
  - **Mutual authentication** = each entity proves itself to the other (Kerberos AP_REP, EAP-TLS) [OSG glossary]; **challenge-response** = server sends random challenge, client answers with hash of secret + challenge [OSG glossary]
  - **Account lockout** disables after N failed logons (counters brute-force/dictionary); **account expiration** disables at a set date — "often confused" [OSG glossary]. **Clipping level** = threshold before violations are logged [OSG glossary]
  - Devices and services: **certificate-based authentication** for devices, systems, services [OSG glossary]; **device authentication** may combine credentials with **context-aware authentication** (location, time, connection type, endpoint) [OSG glossary]
- Exam traps / distractors:
  - **Identification vs authentication**: typing a username is identification; a badge *shown* to a guard is identification, a badge *swiped + PIN* is authentication
  - **MFA vs two same-type factors**: password + security question = single factor; token + PIN = two factors; "strong authentication" != MFA in OSG wording
  - **FAR vs FRR direction**: increasing sensitivity *raises* FRR and *lowers* FAR; a security-first setting accepts more false rejections. Type I = reject (FRR), Type II = accept (FAR) — same numbering as statistics
  - **CER**: lower is better; it is for comparing devices, not a tuning target
  - **SMS OTP**: exam-acceptable "something you have" but NIST calls PSTN out-of-band *restricted*; if options include an authenticator app or FIDO key, prefer it
  - **Password rotation**: legacy control; NIST removed it. If the question is anchored on NIST, "force change only on compromise" is correct
  - **Phishing-resistant**: only origin-bound public-key authenticators (WebAuthn, PIV) qualify; TOTP and push are *not* phishing-resistant — they are replayable/relayable
  - **MFA fatigue / prompt bombing** (7.15): control = number matching / limiting prompts, not "disable MFA"
  - **Accountability** needs *both* auditing and authentication strong enough to tie actions to one person; shared accounts break it
  - **Lockout vs expiration**; **clipping level** is an audit threshold, not a lockout
- Related terms: session management / identity proofing / SSO (next entry), authentication systems (5.6), MFA fatigue (7.15), privileged account management (7.4), zero trust dynamic authN (3.1)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-63-4], [NIST SP 800-63B], [RFC 6238], [RFC 4226], [W3C WebAuthn], [FIDO Alliance], [FIPS 201-3]

## Identity strategy: groups/roles, sessions, proofing, FIM, credential management, SSO, JIT (5.2)
- Definition (ISC2 framing): **identity management (IdM)** = technology, policies, procedures ensuring subjects get accounts with properly *limited* access for their responsibilities; aka **IAM** [OSG glossary]. Outline 5.2 sub-items: groups and roles; AAA; session management; registration, proofing, establishment of identity; **FIM** (federated identity management); credential management systems (password vaults); **SSO** (single sign-on); **JIT** (just-in-time) [ISC2 outline]
- Key facts:
  - **Groups and roles**: a **group** is an administrative simplification — similar users are members, access is assigned to the group, all members inherit it [OSG glossary]; **security groups** may hold users, applications, devices [OSG glossary]; a **role** is a *job function* used by RBAC to regulate access [OSG glossary]. Managerial framing: roles are defined by the business (job), groups implement them in the directory
  - **Session management**: controls what happens *after* authentication — idle/absolute timeouts, **screen lock** [OSG glossary], reauthentication for sensitive actions, session-token protection against **session hijacking** and **replay** [OSG glossary]. NIST reauth bounds: AAL2 24 h / 1 h idle, AAL3 12 h / 15 min idle [NIST SP 800-63B]. NIST SP 800-53 Rev. 5 controls: **AC-12 Session Termination** [NIST SP 800-53]; **AC-10 Concurrent Session Control** (limit concurrent sessions per account/type), **AC-11 Device Lock** (lock after inactivity or on user request; retain until re-authentication) [NIST SP 800-53 AC-10, AC-11]
  - **Registration, proofing, establishment of identity** — **NIST SP 800-63A-4** (Identity Proofing and Enrollment, 2025) [NIST SP 800-63A]:
    1. **Resolution** (Sec. 2.3): collect evidence + core attributes; is the applicant a *unique* identity in the population?
    2. **Validation** (Sec. 2.4): evidence is genuine, attributes checked against authoritative/credible sources
    3. **Verification** (Sec. 2.5): link the claimed identity to the *person present* (biometric comparison, confirmation code)
    4. **Enrollment**: applicant becomes a **subscriber**; authenticators are bound to the account by the **CSP** (credential service provider)
  - Proofing modes: remote unattended, remote attended (video), on-site unattended (kiosk), on-site attended [NIST SP 800-63A]; IAL3 requires on-site attended + biometric (see previous entry). OSG: **enrollment** = establishing a new identity or authentication factor; secure enrollment needs physical proof of identity [OSG glossary]. Onboarding ties proofing to HR (1.8): HR verifies the person, IAM creates the account
  - **FIM**: federation links a subject's accounts across sites/services/entities into one, accomplishing SSO across organizations; commonly SAML [OSG glossary]. FIM is "a single sign-on based identity solution" [OSG glossary]. Roles: **IdP** (identity provider) creates/manages identities and asserts authentication; **SP** (service provider) = resource host that consumes assertions [OSG glossary]. Provisioning across domains: legacy **SPML** (Service Provisioning Markup Language, XML) [OSG glossary]; modern **SCIM** (System for Cross-domain Identity Management) REST/JSON — RFC 7643 schema, RFC 7644 protocol (2015) [RFC 7644]
  - **Credential management systems / password vaults**: encrypted store for credentials to sites/resources that require *different* credentials — i.e. where SSO isn't available; aka credential manager, password locker [OSG glossary]. **Secrets management** is broader: password hashes, session/storage keys, certificates, API tokens, federation [OSG glossary]. Privileged-credential vaulting is **PAM** (7.4)
  - **SSO**: authenticate once, then access resources without being rechallenged [OSG glossary]. LAN SSO = **Kerberos** [OSG glossary]; web/cross-org SSO = SAML/OIDC. Managerial trade: fewer passwords + central audit + fast deprovisioning vs **single point of compromise** — pair SSO with MFA and short sessions
  - **JIT**: (a) **JIT provisioning** = federated identity auto-creates the account/relationship at first login with no administrator action [OSG glossary]; (b) **JIT access/privilege** = privilege granted for a bounded window on request, no standing admin rights (zero standing privilege; PAM feature) — NIST: "just enough privileges at the time they are needed ... and then removing those privileges", characterized as **just-enough and just-in-time** access rights [NIST SP 1800-35 Vol. B, ICAM component]; OSG glossary defines only JIT provisioning [OSG glossary]. Outline 5.2 says only "Just-in-time (JIT)" — read the stem to decide which
  - **IDaaS** (identity as a service): third-party IAM; "effectively provides SSO for the cloud," esp. for SaaS access [OSG glossary]
- Exam traps / distractors:
  - **FIM vs SSO**: FIM is a *means* of SSO across trust domains; SSO inside one domain (Kerberos) is not federation
  - **Group vs role**: "accountants get access" via a *role* (business concept) vs "Finance-RW group" (directory object) — RBAC questions want role
  - **Password vault vs SSO**: vault = many credentials stored; SSO = one authentication reused. A vault is the fallback where SSO can't reach
  - **Enrollment vs registration vs proofing**: proofing verifies the human; enrollment binds authenticators to the account; "registration" is the OSG umbrella. Weak proofing undermines strong authentication (IAL caps effective assurance)
  - **JIT provisioning vs JIT access**: creating the account vs elevating an existing account temporarily
  - **SPML vs SCIM**: both provisioning; SCIM is the live one. **SAML** is *not* a provisioning protocol (assertions, not account creation) — though JIT provisioning can ride on a SAML assertion
  - **Session timeout** is a *logical/technical* control that mitigates unattended sessions — not "screen filter" (privacy) or "lockout" (failed logons)
  - **Password-less** does not mean factor-less: a passkey is have (+ are/know to unlock)
- Related terms: AAA/MFA (previous entry), third-party federation (5.3), provisioning lifecycle (5.5), Kerberos/SAML/OIDC (5.6), PAM (7.4), onboarding (1.8)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-63A], [NIST SP 800-63B], [NIST SP 800-53], [NIST SP 1800-35], [RFC 7644]

## Federated identity with a third-party service (5.3)
- Definition (ISC2 framing): where the IdP and federation plumbing live. **On-premises federated identity management** = SSO solution hosted fully on-site; **cloud-based federation** = a third-party service shares federated identities; **hybrid federation** = elements partly on-premises, partly cloud [OSG glossary]. Outline 5.3: on-premises, cloud, hybrid [ISC2 outline]
- Key facts:

  | Model | Where identities/IdP live | Strength | Weakness / exam angle |
  | --- | --- | --- | --- |
  | **On-premises** | Org-hosted directory + IdP (AD FS-style) | Full control, data stays in-house, works offline | Org owns availability, patching, HA; scaling to SaaS is manual |
  | **Cloud** (IDaaS) | Third-party IdP holds/authenticates identities | Fast SaaS integration, provider HA, built-in MFA | **Vendor dependency**, data residency, outage = no logins anywhere |
  | **Hybrid** | On-prem directory is source of truth, synced/federated to cloud IdP | Keeps legacy Kerberos/LDAP apps + cloud SSO | Two control planes to secure; sync agents and password-hash sync are high-value targets |

  - Federation vocabulary (NIST SP 800-63C-4, Federation and Assertions, 2025) [NIST SP 800-63C]:
    - **CSP** proofs and enrolls the subscriber; **IdP** bridges the subscriber account to the **RP** (relying party) — IdP and CSP may be the same entity
    - **Assertion** = verifiable, signed statement about the subscriber to the RP
    - **Bearer assertion** (possession suffices; FAL1-2) vs **holder-of-key / bound** assertion (subscriber must also prove the referenced authenticator; FAL3)
    - **Front-channel** (through the browser — injection-prone) vs **back-channel** (server-to-server — stronger) presentation
    - **Trust agreement** (Sec. 3.5): documented permissions, xAL requirements, attribute purposes, obligations among CSP/IdP/RP
  - Vocabulary map: SAML **SP** = OIDC/NIST **RP**; SAML **IdP** = OIDC **OP** (OpenID Provider) = NIST IdP
  - **RADIUS federation**: 802.1X option letting users authenticate to partner networks in a federated group (e.g. eduroam-style) [OSG glossary]
  - Managerial checklist for a third-party IdP: contract/SLA + right to audit (1.4, 1.11 SCRM); attribute minimization in assertions (privacy, GDPR); incident notification; **deprovisioning propagation** (does offboarding at the IdP kill RP sessions?); assertion key rotation; break-glass local admin for IdP outage; logging both sides (IdP authN + RP authZ)
  - Federation transfers **authentication** (and attributes); the RP still performs **authorization** — the org remains accountable for access decisions on its own resources
- Exam traps / distractors:
  - **Hybrid ≠ multi-cloud**: hybrid = on-prem + cloud identity components; two cloud IdPs is still "cloud"
  - **IDaaS = SSO/IAM as a service**, not merely a hosted directory or a password vault
  - **SP vs RP vs OP**: same roles, different specs — an option is not wrong because it says RP instead of SP
  - **Bearer vs holder-of-key**: "token replay by whoever holds it" -> bearer weakness; FAL3 fixes it
  - **Front-channel** SAML POST through the browser is normal, but the *injection* protection question wants back-channel/artifact or FAL2 controls
  - **IdP compromise** = every RP falls; the remedy set is FAL3, IdP hardening, MFA at the IdP — not "add MFA at each RP"
  - Moving the IdP to a third party does **not** transfer accountability or the authorization decision; "the provider is responsible for who accesses our data" is the wrong option
  - Risk of cloud federation is primarily **availability + third-party risk**, not "weaker cryptography"
- Related terms: FIM/SSO/IDaaS (previous entry), SAML/OAuth/OIDC (5.6), SCRM (1.11), shared responsibility (3.1), cloud-based systems (3.5)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-63C]

## Authorization mechanisms: DAC, MAC, RBAC, rule-based, ABAC, risk-based, PDP/PEP (5.4)
- Definition (ISC2 framing): **authorization** = ensuring the requested activity/object access is permitted given the rights and privileges assigned to the *authenticated* identity; commonly represented by ACLs [OSG glossary]. Outline 5.4: RBAC, rule-based, MAC, DAC, ABAC, risk-based, and access policy enforcement via **PDP/PEP** (policy decision point / policy enforcement point) [ISC2 outline]
- Key facts:

  | Model | Who/what decides | Discriminator | Typical example |
  | --- | --- | --- | --- |
  | **DAC** (discretionary) | **Owner/creator** of the object | Identity/group based, defined per object via ACL | NTFS permissions, Unix mode bits |
  | **MAC** (mandatory) | **System**, via classification **labels** on subjects and objects | Subject clearance vs object label; owner cannot override | SELinux, military multilevel systems |
  | **RBAC** (role-based) | Admin assigns **job-function roles**; roles carry permissions | Nondiscretionary; follows org chart; fixes privilege creep | Accountant role -> ledger app |
  | **Rule-based** (RuBAC) | Global **rules/filters** applied to *all* subjects | Not identity-specific; if-then conditions | Firewall, proxy, router ACLs |
  | **ABAC** (attribute-based) | Policy over **attributes** of subject, object, operation, environment | Fine-grained, dynamic; many attributes, not a role | "Managers in Finance may read payroll from a managed device 08-18h" |
  | **Risk-based** | Software computes a **risk score** from environment/situation/policy at request time | Decision changes with risk, not just attributes; step-up MFA or deny | Impossible-travel login -> require MFA |

  [OSG glossary] [NIST SP 800-162]
  - **Nondiscretionary** = access regulated by **roles or tasks** (RBAC, **task-based** = work tasks/operations) [OSG glossary]; DAC is the only *discretionary* model — everything else is centrally administered
  - MAC environments: **hierarchical** (levels), **compartmentalized** (domains, no level relationship), **hybrid** (levels containing compartments) [OSG glossary]. **Lattice-based** access control = nondiscretionary variant defining upper and lower bounds per subject-object relationship, usually following label levels [OSG glossary]. **Need to know** is required in addition to an equal/greater clearance [OSG glossary]
  - **ABAC** per **NIST SP 800-162** (Guide to ABAC Definition and Considerations, 2014, upd. 2019): authorization determined by evaluating attributes of **subject, object, requested operation, environment conditions** against policy [NIST SP 800-162]. OSG lists attributes of user, object, system, application, network, service, time of day [OSG glossary]. **Context-aware authentication** (location, time, connection, endpoint) is the authentication-side cousin of ABAC [OSG glossary]
  - **Rule-based** is the model behind firewalls, proxies, routers [OSG glossary]; the acronym **RBAC** is "improperly" used for rule-based — exam writes rule-based as RuBAC/Rule-BAC [OSG glossary]
  - Policy enforcement architecture — **XACML 3.0** (eXtensible Access Control Markup Language, OASIS Standard, Jan 2013) [OASIS XACML]:

  | Component | Function |
  | --- | --- |
  | **PAP** (policy administration point) | Creates the policy / policy set |
  | **PDP** (policy decision point) | Evaluates applicable policy, renders the **decision** |
  | **PEP** (policy enforcement point) | Intercepts access, sends decision request, **enforces** result |
  | **PIP** (policy information point) | Source of **attribute values** (directory, device posture, threat intel) |
  | Context handler | Translates native request <-> XACML, gathers PIP attributes for the PDP |

  - Flow: `subject -> PEP -> PDP (policy from PAP, attributes from PIP) -> PEP permits/denies`. Zero trust mapping (SP 800-207): PDP = policy engine + policy administrator; PEP = gateway/agent that opens, monitors, terminates the session (see Domain 3 zero trust entry) [NIST SP 800-207]
  - Implementation objects: **ACL** = object's list of allowed subjects (DAC mechanism); **capability table** = subject's list of objects/privileges [OSG glossary]; **constrained interface** = application-level enforcement (5.1)
  - Managerial: RBAC minimizes administrative cost and supports access reviews and SoD; ABAC/risk-based support zero trust but need reliable attribute sources (PIP quality = decision quality); MAC where regulatory/label integrity is non-negotiable; DAC scales worst and leaks via owner discretion
- Exam traps / distractors:
  - **DAC vs MAC**: "owner grants access" -> DAC; "labels/clearances, owner cannot share" -> MAC. "Mandatory" means system-enforced labels, not "military only" or "strict RBAC"
  - **RBAC vs group-based DAC**: groups in a DAC system still let owners grant; RBAC removes owner discretion and derives access from job function
  - **Rule-based vs role-based**: rules apply to everyone regardless of identity (firewall); roles are per job. Watch the acronym
  - **ABAC vs RBAC**: "role explosion" / needs many conditions (device, time, location) -> ABAC; "new hire gets standard access for the job" -> RBAC
  - **ABAC vs risk-based**: attributes are evaluated against *static* policy; risk-based adds a *computed score* that may demand step-up authentication mid-session. Both can be "dynamic" — risk-based is the one that *changes with threat*
  - **Content-/context-dependent** are access control *techniques*, not the six models
  - **PDP vs PEP**: decides vs enforces; "denies the packet" -> PEP; "evaluates the request against policy" -> PDP; "stores the attributes" -> PIP; "writes the policy" -> PAP
  - **Lattice** is not a separate exam model — it is how MAC/nondiscretionary bounds are expressed; Bell-LaPadula/Biba (3.2) are *models*, MAC is the *mechanism*
  - **Least privilege** and **need to know** are principles applied *through* these models, not models themselves
- Related terms: security models (3.2), zero trust PE/PA/PEP (3.1), constrained interface / ACL vs capability (5.1), access reviews (5.5), SoD (7.4)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-162], [OASIS XACML], [NIST SP 800-207]

## Identity and access provisioning lifecycle (5.5)
- Definition (ISC2 framing): **identity and access provisioning life cycle** = creation, management, deletion of accounts; provisioning = granting accounts appropriate privileges at creation and throughout the account's life [OSG glossary]. Outline 5.5: account access review (user, system, service); provisioning/deprovisioning (onboarding, offboarding, transfers); role definition and transition; privilege escalation (sudo, auditing); service account management [ISC2 outline]
- Key facts:
  1. **Request + approve**: business need documented; the **asset/data owner** (not IT) approves; role chosen from defined RBAC catalogue
  2. **Provision (onboarding)**: add identity to IAM, bind authenticators, assign role — least privilege; onboarding also covers role changes and added privilege [OSG glossary]
  3. **Use + monitor**: log privileged use, watch for anomalies (UEBA, 7.2)
  4. **Review / recertify**: **recertification** = periodic assessment of job responsibilities vs account rights [OSG glossary]; covers **user, system, service** accounts
  5. **Modify (transfer)**: remove old role *before* adding new — transfers are the main source of **privilege creep**
  6. **Deprovision (offboarding)**: remove the identity from IAM at departure [OSG glossary]; **disable first, delete later** (preserve audit trail, encrypted data, mailbox) — **account revocation** = deprovisioning by deleting [OSG glossary]; SP 800-53 specifies **disable** within an org-defined period when accounts "are no longer associated with a user or individual" (**AC-2(3) Disable Accounts**) and treats removal as a separate AC-2 f action [NIST SP 800-53 AC-2 f, AC-2(3)]; the retention rationale for the disable-then-delete ordering is OSG chapter practice [unverified — audit 2026-09-28: not stated in SP 800-53; check OSG ch. 13]

  - Vocabulary [OSG glossary]:

  | Term | Gloss | Fix |
  | --- | --- | --- |
  | **Excessive privilege** | More access than assigned tasks dictate | Curtail immediately on discovery |
  | **Privilege / creeping privilege** | Unneeded rights accumulate as roles change | Reviews + remove-before-add on transfer |
  | **Access aggregation** | Combining nonsensitive items to learn sensitive info | Need to know, review combined entitlements |
  | **Generic account prohibition** | No shared/guest/anonymous accounts where security matters | Named accounts -> accountability |
  | **Account expiration** | Auto-disable at a date (contractors, temps) | Distinct from lockout |

  - **Access review** governance: NIST SP 800-53 Rev. 5 **AC-2 Account Management** (create/enable/modify/disable/remove, periodic review) [NIST SP 800-53]; reviewer = manager/owner attesting, *not* the IAM administrator (SoD); review outputs feed 6.3 account-management evidence. Frequency risk-tiered: privileged and service accounts more often than standard users — SP 800-53 leaves the review frequency org-defined (**AC-2 j**) and lets it vary per "roles or classes of users" (**AC-6(7) Review of User Privileges**) [NIST SP 800-53 AC-2 j, AC-6(7)]; the specific tiering is practice [unverified — audit 2026-09-28: no primary source prescribes it]
  - **Role definition and transition**: roles map to job functions and are owned by the business; role engineering keeps role count manageable; transition = re-assign role, verify SoD conflicts (e.g. one person cannot hold "create vendor" and "approve payment") [OSG glossary — SoD]
  - **Privilege escalation**: user obtains access they would not normally have — inadvertently via **SUID/SGID** programs, or by becoming another user via **su/sudo** (Unix/Linux) or **RunAs** (Windows); aka elevation of privilege [OSG glossary]. Controls: **PAM** (privileged account management) restricts privileged accounts and detects elevated use [OSG glossary]; **AC-6 Least Privilege** [NIST SP 800-53]; sudo with per-command rules and centrally shipped logs; no direct root/shared admin logon; **JIT elevation** instead of standing rights; **separation of privilege** = granular permissions per privileged operation rather than all-or-nothing admin [OSG glossary]. Auditing of privileged functions is the *detective* half — sudo restriction is *preventive*, sudo logging is *detective*
  - **Service accounts**: user account controlling the access and capabilities of an *application*; aka managed service account [OSG glossary]. Controls: named owner and documented purpose; inventory; deny interactive logon; long random rotated secrets held in a vault / **secrets management** [OSG glossary]; least privilege (no Domain Admin for a backup job); include in access reviews; monitor for interactive or off-host use; platform-managed variants rotate secrets automatically — Windows **gMSA**: "the Windows operating system manages the password for the account instead of relying on the administrator"; Azure **managed identities**: "You don't need to manage credentials. Credentials aren't even accessible to you" [Microsoft docs — gMSA overview; managed identities overview]
  - Managerial: lifecycle is a *process* control — HR event (hire/transfer/terminate) must trigger IAM action within a defined SLA; orphaned and dormant accounts are the metric auditors count
- Exam traps / distractors:
  - **Disable vs delete** on termination: disable (immediately, retain data/audit) is the "best" answer; delete is later, after retention needs are met
  - **Transfer vs termination**: transfer is the scenario where **privilege creep** appears; termination is where **orphaned accounts** appear
  - **Access review vs audit**: review = owner/manager recertifies entitlements periodically; audit = independent verification that the review process works (6.5)
  - **Excessive privilege vs privilege creep**: creep is the *process* over time; excessive privilege is the *state* at a point in time
  - **PAM**: on this exam = privileged account/access management, not Pluggable Authentication Modules
  - **Privilege escalation** as an *attack* (vertical: user -> admin; horizontal: user -> peer) [unverified — audit 2026-09-28: no NIST or MITRE ATT&CK definition of vertical/horizontal found; ATT&CK TA0004 defines only "Privilege Escalation"; the split is OWASP/pentest vocabulary] vs as a *sanctioned* mechanism (sudo) — controls target the mechanism: restrict + log
  - **Service account** questions: "reset password every 90 days" is not the best answer if "vault + rotate + deny interactive logon + owner" is offered; shared human use of a service account = accountability failure
  - **Who approves access**: data owner, not security team or IAM admin; security **enforces**, owner **decides**
  - **Account lockout vs expiration vs revocation**: failed attempts vs date vs deletion
- Related terms: onboarding/termination (1.8), PAM/SoD/least privilege (7.4), account management evidence (6.3), RBAC (5.4), JIT (5.2), UEBA (7.2)
- Sources: [ISC2 outline], [OSG glossary], [NIST SP 800-53], [Microsoft docs], [unverified]

## Authentication systems: Kerberos, RADIUS/TACACS+/Diameter, LDAP, SAML, OAuth, OIDC (5.6)
- Definition (ISC2 framing): the protocols and services that implement identification/authentication and AAA — LAN SSO (**Kerberos**), remote-access AAA (**RADIUS**, **TACACS+**, **Diameter**), directories (**LDAP**), web/federated SSO (**SAML**, **OAuth**, **OIDC**), port-based network access (802.1X/EAP) [ISC2 outline] [OSG glossary]
- Key facts:
  - **Kerberos** (RFC 4120, V5, 2005): ticket-based, **trusted third party**, symmetric-key, typically private-LAN SSO [OSG glossary] [RFC 4120]. **KDC** (key distribution center) = **AS** (authentication service/server) + **TGS** (ticket-granting service); **realm** = users/computers under one Kerberos authority (~domain); **TGT** = primary token, lifetime-stamped; **ticket** = the authentication factor presented to services [OSG glossary]
    1. `client -> AS` **AS_REQ / AS_REP**: proves knowledge of password-derived key, receives **TGT** (encrypted so only the KDC can read it) [RFC 4120]
    2. `client -> TGS` **TGS_REQ / TGS_REP**: presents TGT, receives **service ticket** for a specific server — no password re-entry (this *is* the SSO) [RFC 4120]
    3. `client -> server` **AP_REQ / AP_REP**: presents service ticket + authenticator; optional AP_REP gives **mutual authentication** [RFC 4120]
  - Kerberos properties: tickets carry endtime set by local policy; **renewable** tickets have two expiries; clocks loosely synced, ~**5 min** skew tolerated for replay detection [RFC 4120 Sec. 1.6, 3.2.3]; KDCs "SHOULD listen ... on port **88**" (UDP required, TCP should) [RFC 4120 Sec. 7.2.1-7.2.2] [IANA]. Weaknesses for the exam: KDC = **single point of failure** and highest-value target; **golden ticket** = attacker holds the **KRBTGT** hash and mints tickets at will [OSG glossary]; **pass the hash** reuses cached credential material without the plaintext [OSG glossary]; time-sync dependency
  - AAA protocols:

  | Protocol | Transport / port | AAA handling | Confidentiality |
  | --- | --- | --- | --- |
  | **RADIUS** (RFC 2865, 2000) | UDP **1812** authN, **1813** accounting (RFC 2866) | AuthN + authZ **combined** in Access-Accept | Only **User-Password** attribute hidden (MD5 XOR) |
  | **TACACS+** (RFC 8907, 2020, Informational) | TCP **49** | AuthN, authZ, accounting **separated** | Whole body **obfuscated** (MD5 pad) — RFC calls it obfuscation, not encryption |
  | **Diameter** (RFC 6733, 2012) | TCP/SCTP **3868**; TLS/DTLS 5658 | RADIUS successor; failover, agents, capability negotiation | **TLS/DTLS/IPsec** mandated |

  [RFC 2865] [RFC 8907] [RFC 6733]
  - OSG framing: TACACS lineage TACACS -> XTACACS (separated AAA) -> **TACACS+** (adds two-factor; most used; Cisco proprietary) [OSG glossary]; RADIUS centralizes authentication of *remote access* (dial-up, wireless, broadband) [OSG glossary]; 802.1X makes clients pass RADIUS/TACACS+ before network access [OSG glossary]
  - **LDAP** (RFC 4511, 2006): X.500-derived directory access protocol, port **389** [OSG glossary] [RFC 4511]; **LDAPS** = TLS-wrapped (port **636**, IANA-registered as "ldap protocol over TLS/SSL", not defined in an RFC) [IANA]; **SASL** = authentication framework option for LDAP [OSG glossary]; a **directory service** is the central resource database, not itself an SSO system [OSG glossary]; Active Directory is X.500-based [OSG glossary]
  - Federation / web SSO protocols:

  | Protocol | Purpose | Roles | Token / artifact |
  | --- | --- | --- | --- |
  | **SAML 2.0** (OASIS Standard, Mar 2005) | XML **authentication + attribute** exchange across security domains; web SSO | **IdP** (asserting party) -> **SP** (relying party) | Signed XML **assertion**: authentication, attribute, authorization-decision statements; HTTP Redirect/POST/Artifact bindings |
  | **OAuth 2.0** (RFC 6749, 2012) | **Authorization** framework — delegated access to APIs, no credential sharing | Resource owner, **client**, **authorization server**, **resource server** | **Access token** (bearer — "any party in possession ... can use it", RFC 6750 [RFC 6750]) — not proof of identity |
  | **OIDC** (OpenID Connect Core 1.0) | Identity layer **on top of OAuth 2.0** — authentication | **OP** (OpenID Provider) -> **RP**; End-User | **ID token** = JWT with iss, sub, aud, exp, iat |

  [OASIS SAML] [RFC 6749] [OIDC Core]
  - SAML flows: **SP-initiated** (user hits SP, redirected to IdP) vs **IdP-initiated** (user starts at IdP portal) [OASIS SAML]
  - OAuth grants (RFC 6749 Sec. 1.3/4): **authorization code** (redirect-based, confidential clients — the recommended flow, hardened with **PKCE** (Proof Key for Code Exchange), RFC 7636 — public clients **MUST** use it, authorization servers MUST support it [RFC 7636] [RFC 9700 Sec. 2.1.1]); **implicit** (browser-only; clients "SHOULD NOT use the implicit grant" per the OAuth 2.0 Security BCP [RFC 9700 Sec. 2.1.2]); **resource owner password credentials** (legacy, credential sharing); **client credentials** (service-to-service, no user) [RFC 6749]
  - OSG framing vs mechanism: OSG glossary calls OAuth "an open standard for **authentication** and access delegation" [OSG glossary]; RFC 6749 explicitly calls it an **authorization** framework [RFC 6749]. Exam wants: OAuth = delegated *authorization*; **OIDC** = the authentication layer; if an option says "OAuth authenticates the user," prefer OIDC/SAML when offered. **OpenID** (legacy) = older SSO standard; **OpenID Connect** = the OAuth-based one [OSG glossary]
  - 802.1X / **EAP** (Extensible Authentication Protocol): port-based NAC; EAP-TLS = mutual certificate authentication; PEAP/EAP-TTLS tunnel weaker inner methods in TLS [OSG glossary]
  - SOC mapping: Kerberos AS/TGS exchanges are logged on the DC (Windows event IDs **4768** "Kerberos authentication ticket (TGT) was requested" / **4769** "Kerberos service ticket was requested"; DC-only events [Microsoft docs — Security auditing 4768, 4769]); SAML failures show at the IdP, authorization failures at the SP; RADIUS/TACACS+ accounting = your network-device command audit trail
- Exam traps / distractors:
  - **AS vs TGS**: AS issues the TGT after the initial credential check; TGS issues **service tickets**; the KDC is both. "Ticket used to request other tickets" -> TGT
  - **Kerberos scope**: provides identification + authentication + SSO; **authorization** is done by the resource (ACLs / group info carried in the ticket) — an option saying Kerberos "authorizes file access" is the distractor
  - **Kerberos crypto**: symmetric, no PKI required (**PKINIT**, RFC 4556, is an extension adding public-key pre-authentication to the AS exchange) [RFC 4556]; contrast with certificate-based EAP-TLS
  - **RADIUS vs TACACS+**: UDP vs TCP; password-only vs full-body protection; combined vs separated AAA; TACACS+ is the *device administration* choice, RADIUS the *network access* choice
  - **Diameter**: not **wire-compatible** with RADIUS despite being its successor — coexists via translation gateways; reliable transport is the discriminator [RFC 6733 Sec. 1]. Correction (audit 2026-09-28): previously "not backward-compatible"; RFC 6733 Sec. 1 says Diameter "does not share a common protocol data unit (PDU) with RADIUS" but "considerable effort has been expended in enabling backward compatibility with RADIUS" through gateways — exam distractors still phrase it as "not backward compatible"
  - **SAML vs OAuth vs OIDC**: XML authN assertions for enterprise web SSO / delegated API authorization / JSON authN on OAuth. "Mobile app logs in with Google" -> OIDC; "app posts to your calendar without your password" -> OAuth; "enterprise SSO to a SaaS via corporate IdP" -> SAML (or OIDC)
  - **Access token vs ID token**: access token authorizes API calls; ID token asserts who authenticated. Presenting an access token as identity proof is the classic misuse
  - **SP = RP**; **IdP = OP** — vocabulary swap is not a wrong answer
  - **LDAP** is a directory *protocol* (bind = authentication against the directory) — not an SSO or federation protocol; **Kerberos** is LAN SSO, **SAML/OIDC** is web SSO
  - **Time skew** breaks Kerberos (replay window), not RADIUS; "users cannot log on after clock drift" -> Kerberos
  - **Golden ticket** (KRBTGT, forge TGTs) vs **pass the hash** (reuse NTLM hash) vs **silver ticket** (forge TGS/service ticket with the service account's hash; no KDC interaction, so harder to detect) [MITRE ATT&CK T1558.001, T1558.002]
- Related terms: SSO/FIM (5.2), federation models (5.3), Kerberos exploitation / pass the hash (3.7), NAC (4.2), remote access (4.3), PKI (3.6)
- Sources: [ISC2 outline], [OSG glossary], [RFC 4120], [RFC 4556], [RFC 2865], [RFC 8907], [RFC 6733], [RFC 4511], [IANA], [OASIS SAML], [RFC 6749], [RFC 6750], [RFC 7636], [RFC 9700], [OIDC Core], [Microsoft docs], [MITRE ATT&CK]
